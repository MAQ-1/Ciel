import React from 'react'
import Home from './pages/Home'

import { useEffect } from 'react'
import getCurrentUser from './features/getCurrentUser.js'
import {useDispatch} from 'react-redux'
import {setUserData} from './redux/userSlice.js'
import { Routes, Route } from "react-router-dom";

function App() {
    
  const dispatch = useDispatch()
// current user data fetching and storing in reducer slice 
      useEffect(()=>{
        const fetchCurrentUser=async()=>{
        const data= await getCurrentUser()
        dispatch(setUserData(data))
        }
        fetchCurrentUser()
      },[dispatch])
  
  return (
   <>
    <Home/>
   </>
  )
}

export default App