import React from 'react'
import { Mic, Paperclip, Send } from "lucide-react"
import { useState } from 'react'
import sendMessage from '../features/sendMessage.js'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addMessage } from '../redux/messageSlice.js'

function Chatinput() {
  
  const {selectedConversation}=useSelector((state)=>state.conversation)
  const { messages } = useSelector((state) => state.message)
  const [value, setValue] = useState("")
  const dispatch=useDispatch()
  
  const handleSendMessage=async()=>{
     const payload={
       prompt:value.trim(),
       conversationId:selectedConversation?._id
     } 
       dispatch(addMessage({role:"user",content:value.trim()}))
        
       setValue("") // Clear the input field after sending the message
        // console.log("Payload:", payload);
        // console.log("Selected Conversation:", selectedConversation);
        // console.log("Value:", value);

     const data=await sendMessage(payload)
      dispatch(addMessage({role:"assistant",content: data.response}))
     console.log("data from sendMessage",data)
  }




  return (
    <div className="w-full overflow-hidden px-3  md:px-5 py-4 border-t border-white/[0.06]
    ng=[#0d0f14]">

      {/* Chat input field */}
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
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