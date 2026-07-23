import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter";
// chatAgent and searching  Model

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey:process.env.GROQ_API_KEY,
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
})

const gemini= new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    apiKey:process.env.GOOGLE_API_KEY,
    temperature: 0,
    maxRetries: 2,
    // other params...
})


// coding model
const openrouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 8192,
  // other params...
});


// vision model image generation and image understanding


// creatinga model which give us a model 

export const getModel=async(agent)=>{
    switch(agent){
        case "chat":
            return groq;
        case "search":
            return groq;
        case "vision":
            return groq;
        case "pdf":
            return gemini;
        case "ppt":
            return gemini;
        case "coding":
            return openrouter;
        default:
            return groq;
    }
}