import React from 'react'
import { Mic, Paperclip, Send } from "lucide-react"
import { useState } from 'react'
import sendMessage from '../features/sendMessage.js'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addMessage } from '../redux/messageSlice.js'
import { createConversation } from '../features/createConversation.js'
import { setSelectedConversation, addConversation } from '../redux/conversationSlice.js'
import { updateConversation } from '../features/updateConversation.js'
import { setConvTitle } from '../redux/conversationSlice.js'
import { useEffect } from 'react'
import { Zap, MessageSquare, Code2, FileText, ImageIcon, Presentation, Globe } from "lucide-react"
import { setArtifacts } from '../redux/messageSlice.js'




function Chatinput() {
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const { selectedConversation } = useSelector((state) => state.conversation)
  const { messages } = useSelector((state) => state.message)
  const [value, setValue] = useState("")
  const dispatch = useDispatch()
  





  const handleSendMessage = async () => {

    let conversation = selectedConversation;
    if (!conversation) {
      const conv = await createConversation()
      dispatch(setSelectedConversation(conv))
      dispatch(addConversation(conv))
      conversation = conv
    }

    // setting title
    if (conversation.title == "New Chat") {
      const update = await updateConversation({
        id: conversation._id,
        title: value.trim()
      });
      dispatch(setConvTitle({ conversationId: conversation._id, title:value.trim() }))
    }

    const payload = {
      prompt: value.trim(),
      conversationId: conversation?._id,
      agent: selectedAgent.toLowerCase() // Send the selected agent to the backend
    }

    dispatch(addMessage({ role: "user", content: value.trim() }))

    setValue("") // Clear the input field after sending the message
   

    const data = await sendMessage(payload)
    dispatch(setArtifacts(data?.artifacts || []))
    dispatch(addMessage({ role: "assistant", content: data?.answer,images:data?.images }))
    console.log("data from sendMessage", data)
  }

   
  // mapping all the agent on site
  const agents=[
    {
      id:"auto",
      icon:Zap,
      label:"Auto"
    },
    {
      id:"chat",
      icon:MessageSquare,
      label:"Chat"
    },

    {
      id:"coding",
      icon:Code2,
      label:"Coding"
    },
    {
      id:"pdf",
      icon:FileText,
      label:"PDF"
    },

    {
      id:"vision",
      icon:ImageIcon,
      label:"vision"
    },

    {
      id:"ppt",
      icon:Presentation,
      label:"PPT"
    },
    {
      id:"search",
      icon:Globe,
      label:"Search"
    }
  ]



  return (
    <div className="w-full overflow-hidden px-3  md:px-5 py-4 border-t border-white/[0.06]
    ng=[#0d0f14]">

      {/* Chat input field */}
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
       
       
         {/* all ai agent icon */}
          <div 
         
          className="flex w-[80%] gap-2 pr-2 flex-wrap">
              {agents.map((agent)=>{
                   const isActive=selectedAgent===agent.label;
                   const Icon=agent.icon;

                   return(
                     <div
                     key={agent.label}
                      onClick={()=>setSelectedAgent(agent.label)}
                     className={` flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full  text-xs font-medium border transition-all 
                     ${isActive
                      ? "bg-gradient-to-r from-indigo-500 to-violet-700 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                      : "bg-white/[0.05] text-slate-400 border-transparent hover:bg-white/[0.08] hover:text-slate-200 cursor-pointer"
                     }`}>

                       <Icon size={15}
                        className={
                          isActive?"text-white"
                          :"text-slate-500"
                        }/>

                        {agent.label}

                     </div>
                   )
              })}
          </div>
       
       
        <textarea
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="Type your message..."
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600
           leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
        />


        {/* mic icon  */}

        <div className="flex items-center justify-between ">

          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Paperclip size={16} />
            </button>

            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Mic size={16} />
            </button>
          </div>



          {/* send button */}
          <button
            disabled={!value?.trim()}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-150
    ${value?.trim()
                ? "bg-gradient-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white border-transparent cursor-pointer"
                : "bg-white/[0.05] text-slate-600 border-transparent cursor-not-allowed opacity-60"
              }`}
          >
            <Send size={16} />
          </button>
        </div>



      </div>



    </div>
  )
}

export default Chatinput