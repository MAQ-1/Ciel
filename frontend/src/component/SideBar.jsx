import React from 'react'
import {PanelLeftIcon,PenSquare,Plus} from "lucide-react";
import {useEffect} from 'react'
import {getConversation} from '../features/getConversation.js'
import {useDispatch} from 'react-redux'
import {createConversation} from '../features/createConversation.js'
import {setConversation} from '../redux/conversationSlice.js'
import {addConversation} from '../redux/conversationSlice.js'
import {useSelector} from 'react-redux'



function SideBar() {
  const[collapsed,setCollapsed]=React.useState(false)
  const dispatch=useDispatch();
  const { conversations } = useSelector((state) => state.conversation);
  console.log("conversations:", conversations);
  console.log("length:", conversations.length);

//   get conversation setting data and dispatching to reducer slice
  useEffect(()=>{
    const getConv=async()=>{
    const data= await getConversation();

    dispatch(setConversation(data.conversations))
    }
    getConv();
  },[])

//   conversation create handle 

const handleCreateConversation=async()=>{
    const data= await createConversation();
    dispatch(addConversation(data.conversation))
}
  
  


  return (
    <div className='fixed lg:static inset-y-0 left-0 z-50 w-67.5 h-screen shrink-0 
     bg-[#0d0f14] border-r border-white/6'>
      
       {/* Main content */}

          <div className='flex flex-col h-full'>
               <div className="flex items-center gap-2.5 px-4 py-4 border-b border-whilte/6">
                   {/* Panel  */}
                           <div className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200
                            hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
                            onClick={()=>setCollapsed(true)}>
                                 <PanelLeftIcon/>
                           </div>

                    {/* Logo */}
                      <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
                         Ciel-AI
                      </span>
                    {/* Subscription type */}
                      <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
                         free
                      </span>

                    {/* new conversation icon */}
                     
                     <button className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200
                     hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none
                     cursor-pointer" onClick={handleCreateConversation}>
                         <PenSquare size={18}/>
                     </button>

               </div>

               {/* add new conversation button */}

                <div className="flex-1 o px-4 py-4 pb-1">
                   <button className="w-full flex items-center justify-center gap-2 
                   text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700
                    rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150"
                    onClick={handleCreateConversation}>
                    <Plus size={15}/>
                      New Chat
                   </button>
                </div>

                {/* conversation list */}

             {conversations.length === 0 ? (
                
                <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
                    No Recent Conversation
                </div>
                ) : (
                <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
                    Recents
                </div>
                )}
             
                
          </div>
    </div>
  )
}

export default SideBar