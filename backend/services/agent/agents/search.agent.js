import { getSearchTool } from "../config/tavily.js";
import { deductCredits } from "../utils/deductCredits.js";


export const searchAgent = async (state) => {
    try {
        const searchTool = await getSearchTool();
        const result = await searchTool.invoke({
            query: `${state.prompt}
            Search for the latest information.
            Prefer official sources.
            `
        });
        await deductCredits(state.userId, "search")
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