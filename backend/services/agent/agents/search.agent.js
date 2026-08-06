import { getSearchTool } from "../config/tavily.js";


export const searchAgent = async (state) => {
    try {
        const searchTool = await getSearchTool();
        const result = await searchTool.invoke({
            query: `${state.prompt}
            Search for the latest information.
            Prefer official sources.
            `
        });
        console.log(result);
        return {
            ...state,
            searchResults: result,
            images: result.images
        }
    } catch (error) {
        console.log(error);
        return {
            ...state,
            searchResults: [],
            images:[]
        }
    }
}