import redis from '../../../shared/redis/redis.js';

import {getMessages} from "../util/getMessages.js";
export const getMemory=async(conversationId)=>{
    
        const key=`messages-${conversationId}`;
        
       const cached= await redis.get(key)

     if(cached){
        return JSON.parse(cached);
     }
    //  agr nhi hai to set krdo  messages ko 

       const result = await getMessages(conversationId);

    // Extract only the messages array
      const messages = result.messages;

     await redis.set(key, JSON.stringify(messages),
    "EX",24*60*60); // 24 hours expiration

     return messages;
    
}

// function to add message to redis cache

export const addMessage=async(conversationId,role,content)=>{
     const key =`messages-${conversationId}`;
     const rawMessages= await redis.get(key);
        
    //  raw message hai to usseparse kro warna empty aray return krdo
     const messages=rawMessages?JSON.parse(rawMessages):[];
    
     //adding new message to the messages array
     messages.push({role,content});

     if(messages.length>20){
        messages.shift(); // Remove the oldest message
     }

     // updating the redis cache)
     await redis.set(key, JSON.stringify(messages),
     "EX",24*60*60); // 24 hours expiration
} 