import React from 'react'
import {MessageSquare} from "lucide-react"
import { useSelector } from 'react-redux'


function Nav() {
  
const{selectedConversation}=useSelector((state)=>state.conversation)    




  return (
    <div className='flex items-center gap-2.5 justify-between h-16 px-4 bg-[#0d0f14] border-b border-white/[0.06]'>
             <div>
                 <MessageSquare className='w-5 h-5 text-slate-400'/>
             </div>

             <div>
                {selectedConversation?.title || "New Chat"}
             </div>

             <div>
                 
             </div>
    </div>
  )
}

export default Nav