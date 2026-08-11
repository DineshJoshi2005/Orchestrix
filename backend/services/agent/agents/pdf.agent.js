import { getModel } from "../config/llmModels.js";
import { generatePdf } from "../utils/generatePdf.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfAgent = async (state) => {
    const requestStart = Date.now();

    try {
        console.log(`[PDF] Request started | user=${state.userId}`);

        const limitStart = Date.now();

        await checkAgentLimit(state.userId, "pdf");

        console.log(
            `[PDF] Agent limit check completed | ${Date.now() - limitStart}ms`
        );

        const llmStart = Date.now();

        const llm = getModel("pdf");

        console.log(
            `[PDF] Model initialized | ${Date.now() - llmStart}ms`
        );

        const prompt = `
You are Orchestrix PDF Generator.

Generate a professional educational PDF.

Return ONLY a valid JSON object.

Never return markdown.

Never return \`\`\`.

Never explain anything.

JSON Format:

{
"title":"",
"subtitle":"",
"sections":[
{
"heading":"",
"points":[]
}
]
}

Requirements:

- Generate 5-6 sections.
- Every section should have a heading.
- Every section should contain 4-5 detailed bullet points.
- Every bullet should contain roughly 35-60 words.
- Include examples wherever appropriate.
- Explain concepts instead of giving summaries.
- Maintain a logical order.
- Avoid repetition.
- Total length should be around 1200-1600 words.

Topic:

${state.prompt}
`;

        console.log(`[PDF] Prompt prepared`);

        const llmInvokeStart = Date.now();

        const res = await llm.invoke(prompt);

        console.log(
            `[PDF] LLM response received | ${Date.now() - llmInvokeStart}ms`
        );

        const parseStart = Date.now();

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

        console.log(
            `[PDF] Response parsed successfully | ${Date.now() - parseStart}ms`
        );

        const creditStart = Date.now();

        await deductCredits(state.userId, "pdf");

        console.log(
            `[PDF] Credits deducted | ${Date.now() - creditStart}ms`
        );

        const pdfStart = Date.now();

        const pdfBuffer = await generatePdf(data);

        console.log(
            `[PDF] PDF generated | ${Date.now() - pdfStart}ms | size=${pdfBuffer.length} bytes`
        );

        const uploadStart = Date.now();

        const filename = `pdf-${Date.now()}.pdf`;

        await uploadToS3(
            filename,
            pdfBuffer,
            "application/pdf"
        );

        console.log(
            `[PDF] PDF uploaded to S3 | ${Date.now() - uploadStart}ms`
        );

        const urlStart = Date.now();

        const downloadUrl = await getFromS3(filename, 600);

        console.log(
            `[PDF] Download URL generated | ${Date.now() - urlStart}ms`
        );

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