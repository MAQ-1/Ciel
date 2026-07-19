import axios from "axios";

export const getMessages=async(conversationId)=>{
    try{
         const {data}=await axios.get(`${process.env.CHAT_SERVICE_URL}/get-messages/${conversationId}`);
         return data;
    }catch(err){
        console.error("Error fetching messages: from agent get messages", err);
        throw err;
    }
}