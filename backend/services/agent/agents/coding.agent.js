import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";

export const codingAgent = async (state) => {
    try {

        await checkAgentLimit(state.userId, "coding")
        const intentLLM = await getModel("intent");
        const llm = await getModel("coding");

        const intentRes = await intentLLM.invoke(`
You are an intent classifier.

Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
`);

        const intent = intentRes.content.trim();

        console.log(intent);

        if (intent === "CODE_GENERATION") {

            const prompt = `
You are Orchestrix Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Requirements:

- Responsive
- Modern UI
- CSS Variables
- Flexbox/Grid
- Smooth animations
- Beautiful spacing
- Single page unless requested otherwise

Images:
- Always use real Unsplash image URLs.
- Never use placeholder images.

Return ONLY a valid JSON object.

Schema:

    {
    "files":[
        {
        "name":"index.html",
        "content":"..."
        },
        {
        "name":"style.css",
        "content":"..."
        },
        {
        "name":"script.js",
        "content":"..."
        }
    ]
    }

Rules:

- No markdown
- No explanation
- No code fences
- Response MUST start with {
- Response MUST end with }
- Output MUST be valid JSON.

User Request:

${state.prompt}
`;

            const res = await llm.invoke(prompt);

            let text = String(res.content).trim();


            text = text
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            if (!text.endsWith("}")) {
                throw new Error(
                    "Model output appears truncated. Increase maxTokens or generate a smaller project."
                );
            }

            let data;

            try {

                data = JSON.parse(text);

            } catch (err) {

                console.log("Initial JSON Parse Failed");
                console.log(err.message);


                const repairLLM = await getModel("chat");

                const repaired = await repairLLM.invoke(`
You are a JSON repair tool.

Your ONLY job is to repair invalid JSON.

Rules:

- Return ONLY valid JSON.
- Do not explain.
- Do not wrap with markdown.
- Preserve every file.
- Do not remove content unless absolutely necessary.
- Escape invalid characters if needed.

JSON:

${text}
`);

                let repairedText = String(repaired.content)
                    .replace(/^```json\s*/i, "")
                    .replace(/^```\s*/i, "")
                    .replace(/\s*```$/i, "")
                    .trim();

                data = JSON.parse(repairedText);

            }
            await deductCredits(state.userId, "coding")

            return {
                ...state,
                aiResponse: "Code Generated Successfully",
                artifacts: [
                    {
                        id: Date.now(),
                        type: "Project",
                        title: state.prompt,
                        files: data.files || []
                    }
                ]
            };
        }

        const res = await llm.invoke(`
The user's request is:

${intent}

Return Markdown only.

Never generate project files.

Use headings:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:

${state.prompt}
`);
        console.log(res.response_metadata);
        await deductCredits(state.userId, "coding")

        return {
            ...state,
            aiResponse: res.content,
            artifacts: []
        };
    } catch (error) {
        console.log(error);
        return {
            ...state,
            aiResponse: error?.data?.message || `😢 Can't Generate the code`,
            artifacts: []
        };
    }
};