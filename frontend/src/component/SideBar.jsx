import React from 'react'
import { PanelLeftIcon, PenSquare, Plus, MessageSquare ,Coins,LogOut} from "lucide-react";
import { useEffect,useState } from 'react'
import { getConversation } from '../features/getConversation.js'
import { useDispatch } from 'react-redux'
import { createConversation } from '../features/createConversation.js'
import { setConversation } from '../redux/conversationSlice.js'
import { addConversation } from '../redux/conversationSlice.js'
import { useSelector } from 'react-redux'
import { setSelectedConversation } from "../redux/conversationSlice";
import {setUserData} from "../redux/userSlice.js"
import { User } from "lucide-react";
import logout from '../features/Logout.js'
import { useRef } from 'react';




function SideBar() {
  const [collapsed, setCollapsed] = React.useState(false)
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector((state) => state.conversation);
  const { userData } = useSelector((state) => state.user);
  const [imageError,setimageError]=useState(false)
  const avatarRef = useRef(Date.now());

  //   get conversation setting data and dispatching to reducer slice
  useEffect(() => {
    const getConv = async () => {
      const data = await getConversation();
      console.log(data);

      dispatch(setConversation(data.conversations))
    }
    getConv();
  }, [userData?._id])

  //   conversation create handle 

  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data.conversation))
  }
 
  // console.log("userData in sidebar:", userData);

  return (
              <div
                className="fixed lg:static inset-y-0 left-0 z-50 w-67.5 h-screen shrink-0
                          bg-[#0d0f14] border-r border-white/6"
              >
                {/* Sidebar Container */}
                <div className="flex flex-col h-full overflow-hidden">

                  {/* ================= HEADER ================= */}
                  <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/6">

                    {/* Collapse Sidebar */}
                    <div
                      className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg
                                text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]
                                transition-colors duration-150 cursor-pointer"
                      onClick={() => setCollapsed(true)}
                    >
                      <PanelLeftIcon />
                    </div>

                    {/* Logo */}
                    <span className="flex-1 text-[16px] font-semibold text-slate-100 tracking-tight">
                      Ciel-AI
                    </span>

                    {/* Plan */}
                    <span
                      className="text-[10px] font-medium text-indigo-400
                                bg-indigo-500/10 border border-indigo-500/20
                                px-2 py-0.5 rounded-full tracking-wide"
                    >
                      Free
                    </span>

                    {/* New Chat Icon */}
                    <button
                      onClick={handleCreateConversation}
                      className="flex items-center justify-center w-7 h-7 rounded-lg
                                text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]
                                transition-colors duration-150 cursor-pointer"
                    >
                      <PenSquare size={18} />
                    </button>
                  </div>

                  {/* ================= NEW CHAT BUTTON ================= */}
                  <div className="px-4 py-4">
                    <button
                      onClick={handleCreateConversation}
                      className="w-full flex items-center justify-center gap-2
                                text-sm font-medium text-white
                                bg-gradient-to-r from-indigo-500 to-violet-700
                                rounded-xl py-[10px]
                                hover:opacity-90 transition-opacity duration-150"
                    >
                      <Plus size={15} />
                      New Chat
                    </button>
                  </div>

                  {/* ================= RECENTS TITLE ================= */}
                  <div className="px-5 pb-2">
                    {conversations.length === 0 ? (
                      <p className="text-[10.5px] font-semibold uppercase tracking-widest text-slate-500">
                        No Recent Conversation
                      </p>
                    ) : (
                      <p className="text-[10.5px] font-semibold uppercase tracking-widest text-slate-500">
                        Recents
                      </p>
                    )}
                  </div>

                  {/* ================= CONVERSATION LIST (ONLY THIS SCROLLS) ================= */}
                  <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {conversations.map((conv) => {
                      const isActive =
                        selectedConversation?._id === conv._id;

                      return (
                        <div
                          key={conv._id}
                          onClick={() => dispatch(setSelectedConversation(conv))}
                          className={`flex items-center gap-2.5 cursor-pointer
                                    mb-1 px-3 py-2.5 rounded-[10px] border
                                    transition-all duration-200 ease-in-out
                                    ${isActive
                              ? "bg-indigo-500/10 border-indigo-500/20"
                              : "border-transparent hover:bg-white/5"
                            }`}
                        >
                          {/* Icon */}
                          <div
                            className={`flex items-center justify-center
                                      w-7 h-7 rounded-lg
                                      transition-all duration-200
                                      ${isActive
                                ? "bg-indigo-500/15 text-indigo-400"
                                : "bg-white/5 text-slate-500"
                              }`}
                          >
                            <MessageSquare size={18} />
                          </div>

                          {/* Conversation Title */}
                          <span className="truncate text-sm text-slate-200">
                            {conv.title || "New Chat"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* ================= FOOTER ================= */}
                  <div className="border-t border-white/6 p-3">
                    {/* Add profile/settings/logout later */}

                        <div className="px-3.5 py-3.5">
                           {userData ?( 
                           <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] 
                           transition-colors duration-150">
                                  
                                  {/* user photo */}
                                  <div className="relative shrink-0">
                                          {userData?.avatar && !imageError ? (
                                            <img
                                               key={avatarRef.current}
                                               src={`${userData.avatar}?${Date.now()}`} 
                                              alt="Profile"
                                              className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                                              onLoad={() => console.log("✅ Image Loaded")}
                                              onError={(e) => {
                                                
                                                setimageError(true);
                                              }}
                                            />
                                          ) : (
                                            <div className="w-9 h-9 rounded-[10px] border-2 border-indigo-500/25 flex items-center justify-center">
                                              <User size={18} className="text-slate-400" />
                                            </div>
                                          )}
                                   </div>

                                   {/* user details */}

                                   <div className="flex-1 min-w-0">
                                        <p className="text-[13.5px] font-semibold text-slate-300 truncate">
                                          {userData?.name || "Guest User"}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-px">{"free"}</p>
                                   </div>

                                   {/* coins and logout button */}
                                   <div className="flex gap-2" >
                                     <button className="flex items-center justify-center w-7 h-7 rounded-[7px] 
                                     border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.05]">
                                        <Coins size={15}/>
                                     </button>

                                     <button className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none
                                      bg-transparent text-red-500 cursor-pointer hover:bg-white/[0.05]"
                                      onClick={()=>{
                                        logout();
                                        setimageError(false);
                                        dispatch(setUserData(null));
                                      }}>
                                        <LogOut size={18}/>
                                     </button>
                                   </div>
                           </div>
                           )
                           :
                           <button>
                              login
                            </button>}
                        </div>
                  </div>

                </div>
              </div>
  );
}

export default SideBar