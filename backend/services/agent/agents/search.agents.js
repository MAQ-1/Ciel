import searchTool from "../config/tavily.js";
import { deductCredits } from "../util/deductCredits.js";
import { checkAgentLimit } from "../config/agentlimit.js";
export const searchAgent = async (state) => {

  try {
    await checkAgentLimit(state.userId, "search")
    const results = await searchTool.invoke({
      query: state.prompt
    })
    await deductCredits(state.userId, "search");
    console.log("Search Results:", results);

    return {
      ...state,
      searchResults: results,
      images: results.images,
    };

  } catch (error) {

    if (error.status == 429) {
      return {
        ...state,
        aiResponse: error?.data?.message
      }
    }
    return {
      ...state,
      searchResults: [],
      images: [],
    }
  }
}