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
        
        case "pdf":
            return new ChatGoogleGenerativeAI({
                model: "gemini-3.5-flash",
                temperature: 0.2,
            });
        
        case "ppt":
            return new ChatGoogleGenerativeAI({
                model: "gemini-3.5-flash",
                temperature: 0.4,
                    });
        case "imageAnalyzer":
            return new ChatGoogleGenerativeAI({
                model: "gemini-3.5-flash"
            });
        default:
            return new ChatGroq({
                model: "openai/gpt-oss-120b",
            });
    }
};