import {getModel} from "../config/llmModels.js";

// chat agent getting the prompt and resposne
export const chatAgent=async(state)=>{
  const llm= awaitgetModel("chat");
  const systemPrompt="You are a Ciel-AI, an intelligent Ai assistant."
  const response = await llm.invoke([
    {
        "role":"system",
        "content":systemPrompt
    },
       {
      "role":"human",
         "content":state.prompt
 
       }  
    ]
  );
  

  return {
    ...state,
    aiResponse: response.content
  }
}