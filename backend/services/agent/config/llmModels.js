import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter"

export const getModel = (agent) => {
    switch (agent) {
        case "chat":
            return new ChatGroq({
                model: "openai/gpt-oss-120b",
            });
        case "search":
            return new ChatGroq({
                model: "openai/gpt-oss-120b",
            });

        case "coding":
            return new ChatOpenRouter({
                model: "deepseek/deepseek-chat",
                temperature: 0,
                maxTokens: 8000
            })

        default:
            return new ChatGroq({
                model: "openai/gpt-oss-120b",
            });
    }
};