import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getModel = (agent) => {
    switch (agent) {
        case "chat":
        case "search":
            return new ChatGroq({
                model: "openai/gpt-oss-120b",
            });

        case "coding":
            return new ChatGoogleGenerativeAI({
                model: "gemini-2.5-flash",
            });

        default:
            return new ChatGroq({
                model: "openai/gpt-oss-120b",
            });
    }
};