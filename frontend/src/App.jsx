import React from 'react'
import Home from './pages/Home'
import { useEffect } from 'react'
import getCurrentUser from './features/getCurrentUser.js'


function App() {
 
  useEffect(()=>{
    const fetchCurrentUser=async()=>{
     await getCurrentUser()
    }
    fetchCurrentUser()
  },[])
  
  return (
   <>
     <Home />
   </>
  )
}

export default App