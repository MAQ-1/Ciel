import React from 'react'
import api from '../utils/axios'

async function sendMessage(payload) {
 
    try{
   const {data}=await api.post("/api/agent/chat", payload)
//    console.log("message sent",data)
   return data
    }catch(error){
        console.error("Error sending message",error)
    }
}

export default sendMessage