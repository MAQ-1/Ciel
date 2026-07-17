import React from 'react'
import api from '../utils/axios';

async function logout() {
  try{
const {data} = await api.get("/api/auth/logout")
console.log(data)
 return data;
     
  }catch(error){
    console.error("Logout failed:", error.response?.data || error);
    throw error;
  }
}

export default logout;