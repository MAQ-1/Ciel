import axios from "axios";

export const deductCredits=async(userId, agent)=>{
    try{
         const {data}=await axios.post(`${process.env.AUTH_SERVICE_URL}/deduct-credits`, { userId, agent });
         return data;
    }catch(err){
        console.error("Error deducting credits: from agent", err);
        throw err;
    }
}