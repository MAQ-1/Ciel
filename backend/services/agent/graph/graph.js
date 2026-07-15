import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agents.js";
import { codingAgent } from "../agents/codin.agents.js";
import { visionAgent } from "../agents/vision.agents.js";
import { pdfAgent } from "../agents/pdf.agents.js";
import { pptAgent } from "../agents/ppt.agents.js";
import { searchAgent } from "../agents/search.agents.js";


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
    search:"search"
})

// add the remaing edge
workflow.addEdge("search","chat")
workflow.addEdge("chat","__end__")
workflow.addEdge("coding","__end__")
workflow.addEdge("vision","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("ppt","__end__")

const graph=workflow.compile()
// graph done
export default graph