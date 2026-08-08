import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";
import { deductCredits } from "../utils/deductCredits.js";

export const chatAgent = async (state) => {
    
    try {
        
        const llm = await getModel("chat");
        const history = await getMemory(state.conversationId);

        const searchResults = state.searchResults?.results
            ?.slice(0, 3)
            .map(result => `
Title: ${result.title}
Source: ${result.url}
Content: ${result.content.slice(0, 1200)}
`)
            .join("\n");

        const searchContext = searchResults
            ? `
Reference Information:

${searchResults}
`
            : "";

        const systemPrompt = `
You are Orchestrix, an intelligent AI assistant.

${searchContext}

Instructions:

If additional factual information is available:

- Treat it as your own knowledge.
- Never mention or imply that you used search results, retrieved information, context, tools, references, external sources, or any internal process.
- Never use phrases such as:
  - "According to the search results..."
  - "The reference information..."
  - "The information provided..."
  - "Based on the retrieved data..."
  - "The available context..."
- Answer naturally as though you already know the information.
- If the available information is insufficient to answer completely, simply state that the exact information is not currently available.
- Offer the closest helpful answer using the information you have.
- Never fabricate facts.
- Never mention why you cannot answer in terms of missing search results or missing context.

General Rules:

- For greetings and simple conversations, reply naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.
- Keep answers concise unless the user asks for detail.
- Be clear, professional, and helpful.

Markdown Formatting:

- Use # for titles.
- Use ## for sections.
- Leave one blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language identifiers.
- Keep paragraphs short.
- Never write headings and content on the same line.
- Never generate unnecessarily large walls of text.
`;

        const messages = [
            new SystemMessage(systemPrompt)
        ];

        history.forEach(msg => {
            if (msg.role === "user") {
                messages.push(new HumanMessage(msg.content));
            } else {
                messages.push(new AIMessage(msg.content));
            }
        });

        messages.push(new HumanMessage(state.prompt));

        const response = await llm.invoke(messages);

        await deductCredits(state.userId,"chat")
        return {
            ...state,
            aiResponse: response.content
        };
    } catch (error) {
        console.log(error);
        return {
            ...state,
            aiResponse: "😢 Can't Generate response"
        };
    }
};