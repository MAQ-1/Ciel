import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

// chatAgent  Model

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


// creatinga model which give us a model 

export const getModel=async(agent)=>{
    switch(agent){
        case "chat":
            return groq;
        case "search":
            return groq;
        case "vision":
            return gemini;
        case "pdf":
            return gemini;
        case "ppt":
            return gemini;
        case "coding":
            return gemini;
        default:
            return groq;
    }
}