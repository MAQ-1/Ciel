import { Annotation } from "@langchain/langgraph";

// custom state schema jo hum apss krenge
export const agentState = Annotation.Root({
  prompt:Annotation(),
  aiResponse:Annotation(),
  agent:Annotation(),
  conversationId:Annotation(),
  searchResults:Annotation(),
  images:Annotation(),
  artifacts:Annotation(),

})

