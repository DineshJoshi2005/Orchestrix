import { getModel } from "../config/llmModels.js";
import { generatePdf } from "../utils/generatePdf.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "pdf")
        
        const llm = getModel("pdf");

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

        const res = await llm.invoke(prompt);

        console.log("========== RAW RESPONSE ==========");
        console.dir(res, { depth: null });

        let text = "";

        // Handle every possible response format
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

        console.log("========== RAW TEXT ==========");
        console.log(text);

        if (!text) {
            throw new Error("The model returned an empty response.");
        }

        // Remove markdown fences if present
        text = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Find JSON object
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
            console.log("========== INVALID JSON ==========");
            console.log(text);
            throw new Error("Model returned malformed JSON.");
        }
        await deductCredits(state.userId, "pdf")
        const pdfBuffer = await generatePdf(data);

        const filename = `pdf-${Date.now()}.pdf`;

        await uploadToS3(
            filename,
            pdfBuffer,
            "application/pdf"
        );

        const downloadUrl = await getFromS3(filename, 600);

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
        console.error(error);

        return {
            ...state,
            aiResponse: error?.data?.message || `❌ Can't generate the pdf`
        };
    }
};