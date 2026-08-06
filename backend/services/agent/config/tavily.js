import { TavilySearch } from "@langchain/tavily";

export const getSearchTool = () => {
    return new TavilySearch({
        maxResults: 5,
        apiKey: process.env.TAVILY_API_KEY,
        topic: "general",
        includeImages: true,
    })
}

