import { getModel } from "../config/llmModels.js";
import { generatePdf } from "../utils/generatePdf.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfAgent = async (state) => {
    const requestStart = Date.now();

    try {
        await checkAgentLimit(state.userId, "pdf");

        const llm = getModel("pdf");

        const llmStart = Date.now();

        const prompt = `
You are Orchestrix PDF Generator.

Create a professional, educational PDF about the given topic.

Return ONLY a valid JSON object.

Never return markdown.

Never return \`\`\`.

Never explain anything.

Do not return markdown, code fences, explanations, or extra text.

JSON Format:

    {
    "title": "",
    "subtitle": "",
    "sections": [
        {
        "heading": "",
        "points": []
        }
    ]
    }

Requirements:

- Generate 4-5 sections.
- Each section must have a clear heading.
- Each section must contain 3-4 informative bullet points.
- Each bullet should be approximately 25-40 words.
- Explain the topic clearly and concisely.
- Include examples when useful.
- Maintain a logical flow from basic to advanced concepts.
- Avoid repetition and unnecessary details.
- Keep the total content around 600-900 words.
- Do not create empty sections.
- Do not create empty bullet points.
- Do not add extra sections after completing the topic.

Topic:

${state.prompt}
`;

        const res = await llm.invoke(prompt);

        console.log(
            `[PDF] LLM completed | ${Date.now() - llmStart}ms`
        );

        let text = "";

        if (typeof res.content === "string") {
            text = res.content;
        }
        else if (Array.isArray(res.content)) {
            text = res.content
                .map(item => {
                    if (typeof item === "string") return item;
                    return item.text || "";
                })
                .join("");
        }
        else {
            text = String(res.content ?? "");
        }

        text = text.trim();

        if (!text) {
            throw new Error("The model returned an empty response.");
        }

        text = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("No JSON object found in the model response.");
        }

        text = text.substring(firstBrace, lastBrace + 1);

        let data;

        try {
            data = JSON.parse(text);
        } catch (err) {
            throw new Error("Model returned malformed JSON.");
        }

        await deductCredits(state.userId, "pdf");

        const pdfStart = Date.now();

        const pdfBuffer = await generatePdf(data);

        console.log(
            `[PDF] PDF generated | ${Date.now() - pdfStart}ms | size=${pdfBuffer.length} bytes`
        );

        const filename = `pdf-${Date.now()}.pdf`;

        const uploadStart = Date.now();

        await uploadToS3(
            filename,
            pdfBuffer,
            "application/pdf"
        );

        console.log(
            `[PDF] S3 upload completed | ${Date.now() - uploadStart}ms`
        );

        const downloadUrl = await getFromS3(filename, 600);

        console.log(
            `[PDF] Request completed | total=${Date.now() - requestStart}ms`
        );

        return {
            ...state,
            aiResponse: `
# PDF Generated

**${data.title}**

📄 [Download PDF](${downloadUrl})

⌛ Link expires in 10 minutes.
`.trim()
        };

    } catch (error) {

        console.error(
            `[PDF] Request failed | total=${Date.now() - requestStart}ms | message=${error?.message}`
        );

        return {
            ...state,
            aiResponse: error?.data?.message || `❌ Can't generate the pdf`
        };
    }
};