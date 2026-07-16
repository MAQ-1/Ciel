import axios from "axios";
import graph from "../graph/graph.js"

// api key for agents

export const agent= async(req,res)=>{
    try{
        
        //taking prompt from user
        const {prompt,conversationId}=req.body;
        if(!prompt||!conversationId){
            return res.status(400).json({error:"Prompt and conversation ID are required"})
        }
          
        // calling the save-message api
          await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`,{conversationId,
            role:"user",
            content:prompt
          })
         
        //   starting the graph
          const result= await graph.invoke({
            prompt,conversationId

          })
             
        //   retutn ai response
          const response= result.aiResponse;

          return res.status(200).json({response})


    }catch(error){
        return res.status(500).json({error:error.message})
    }
}