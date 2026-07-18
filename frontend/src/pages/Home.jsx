import React from 'react'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from '../utils/firebase';
import api from '../utils/axios';
import { FcGoogle } from "react-icons/fc";
import Button from '../ui/Button.jsx';
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'
import SideBar from '../component/SideBar.jsx';
import ChatArea from '../component/ChatArea.jsx';
import Artifact from '../component/Artifact.jsx';
import { useState } from 'react';

function Home() {

  // extract the user data from the redux store
  const { userData } = useSelector((state) => state.user)
  // console.log("userData",userData)
  const dispatch = useDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // handle login in site

  const handlelogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token })
      dispatch(setUserData(data.user))
    } catch (error) {
      console.error("Error logging in", error)
    }
  }


  // Google login function
  const GoogleLogin = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider)
      const token = await data.user.getIdToken()
      await handlelogin(token)
      //   console.log(token)

    } catch (error) {
      console.error("Error signing in with Google", error)

    }

  }

  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
      <SideBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 min-w-0 flex">
        <ChatArea setSidebarOpen={setSidebarOpen} />
        <Artifact />
      </div>
  
   {/* login pop up */}
      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-85 bg-[#13151c] border border-white/8 rounded-2xl p-7 flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to Ciel-AI
              </h2>

              <p className="text-[13px] text-slate-500">
                Please login to continue
              </p>
            </div>

            <Button className="w-full gap-3" onClick={GoogleLogin}>
              <FcGoogle size={20} />
              Continue with Google
            </Button>

          </div>
        </div>
      )}
    </div>
  )
}

export default Home
