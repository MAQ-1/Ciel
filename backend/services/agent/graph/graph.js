import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agents.js";
import { codingAgent } from "../agents/codin.agents.js";
import { visionAgent } from "../agents/vision.agents.js";
import { pdfAgent } from "../agents/pdf.agents.js";
import { pptAgent } from "../agents/ppt.agents.js";
import { searchAgent } from "../agents/search.agents.js";
import { pdfRagAgent } from "../agents/pdfRag.agents.js";
import { imageAnalyzerAgent } from "../agents/imageAnalyzer.agents.js";
// graph done 
const workflow=new StateGraph(agentState)

//Node creating (name, there work)
workflow.addNode("router",router)
workflow.addNode('chat',chatAgent)
workflow.addNode('coding',codingAgent)
workflow.addNode('vision',visionAgent)
workflow.addNode('pdf',pdfAgent)
workflow.addNode('ppt',pptAgent)
workflow.addNode('search',searchAgent)
workflow.addNode('pdfRag',pdfRagAgent)
workflow.addNode('imageAnalyzer',imageAnalyzerAgent)


//Now connecting edges (from,to)

workflow.addEdge("__start__","router")
// conditonal edges (from,to,condition)
workflow.addConditionalEdges("router",(state)=>{
    switch(state.agent){
        case "chat":
            return "chat"
        case "coding":
            return "coding"
        case "vision":
            return "vision"
        case "pdf":
            return "pdf"
        case "ppt":
            return "ppt"
        case "search":
            return "search"
        case "pdfRag":
            return "pdfRag"
        case "imageAnalyzer":
            return "imageAnalyzer"
        default:
            return "chat"
    }
},{
    // returning the state of the graph
    chat:"chat",
    coding:"coding",
    vision:"vision",
    pdf:"pdf",
    ppt:"ppt",
    search:"search",
    pdfRag:"pdfRag",
    imageAnalyzer:"imageAnalyzer"
})

// add the remaing edge
workflow.addEdge("search","chat")
workflow.addEdge("chat","__end__")
workflow.addEdge("coding","__end__")
workflow.addEdge("vision","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("ppt","__end__")
workflow.addEdge("pdfRag","__end__")
workflow.addEdge("imageAnalyzer","__end__")

const graph=workflow.compile()
// graph done
export default graph