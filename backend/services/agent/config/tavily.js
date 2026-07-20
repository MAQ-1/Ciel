import { TavilySearch } from "@langchain/tavily";

console.log("TAVILY_API_KEY:", process.env.TAVILY_API_KEY);
const searchTool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeImages: true,
});

export default searchTool;