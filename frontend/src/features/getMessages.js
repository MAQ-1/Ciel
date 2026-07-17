import api from "../api/api.js";

import React from 'react'

async function getMessages(id) {
 try{
      const {data} = await api.get(`/api/chat/get-messages/${id}`)
      return data
 }catch(error){
    console.log(error)
    return []
 }
}

export default getMessages