import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";
import { deductCredits } from "../util/deductCredits.js";
import { checkAgentLimit } from "../config/agentlimit.js";

// chat agent getting the prompt and resposne
export const chatAgent = async (state) => {

  try {

    checkAgentLimit(state.userId, "chat")

    const llm = await getModel("chat");

    const history = await getMemory(state.conversationId);

    console.log(history);
    // console.log(Array.isArray(history));

    const searchContext = state.searchResults ? `Web Search Results:
  
  ${JSON.stringify(state.searchResults)}
  Answer the User using only the above search results
  `: ""

    const systemPrompt = `
  You are Ciel AI, an intelligent and professional AI assistant .
  
  ${searchContext}
  if searchContext exists:

- Use search results to answer.
-Do no mention internal tools.

Rules:
- For simple question. greeting, and short queries, respond naturally in plain text.
- for technical, educational , coding , or detailed topics , use clean Markdown.

 Formatting:

- Answer the user's question directly.
- Do not greet or introduce yourself unless asked.
- Do not say "How can I help you today?" after every response.
- Keep responses natural and conversational.
- Use clean Markdown when appropriate.
- Use headings for long answers.
- Use bullet points and numbered lists when useful.
- Use tables only for comparisons.
- Use fenced code blocks with language names.
- Write complete, production-quality code.
- Explain code after presenting it.
- Never invent facts or APIs.
- If uncertain, clearly state it.
- Match the user's language automatically.
  
  `


    const messages = [
      new SystemMessage(systemPrompt),
    ];

    history.forEach(msg => {
      if (msg.role === "user") {
        messages.push(new HumanMessage(msg.content));
      } else {
        messages.push(new AIMessage(msg.content));
      }
    });


    messages.push(new HumanMessage(state.prompt));
    // console.log(messages);


    const response = await llm.invoke(messages);
    await deductCredits(state.userId, "chat");

    return {
      ...state,
      aiResponse: response.content
    }

  } catch (error) {
    if (error.status == 429) {
      return {
        ...state,
        aiResponse: error?.data?.message
      }
    }
    return {
      ...state,
      aiResponse: "failed to generate response",
    }
  }

}