import React from 'react'
import { PanelLeftIcon, PenSquare, Plus, MessageSquare, Coins, LogOut, PanelRight, Menu, X } from "lucide-react";
import { useEffect, useState } from 'react'
import { getConversation } from '../features/getConversation.js'
import { useDispatch } from 'react-redux'
import { createConversation } from '../features/createConversation.js'
import { setConversation } from '../redux/conversationSlice.js'
import { addConversation } from '../redux/conversationSlice.js'
import { useSelector } from 'react-redux'
import { setSelectedConversation } from "../redux/conversationSlice";
import { setUserData } from "../redux/userSlice.js"
import { User } from "lucide-react";
import logout from '../features/Logout.js'
import { useRef } from 'react';
import BillingDrawer from './BillingDrawer.jsx';

function SideBar({ sidebarOpen, setSidebarOpen }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector((state) => state.conversation);
  const { userData } = useSelector((state) => state.user);
  const [imageError, setimageError] = useState(false)
  const avatarRef = useRef(Date.now());
  const [showBilling, setShowBilling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false)

  // Get conversation setting data and dispatching to reducer slice
  useEffect(() => {
    const getConv = async () => {
      const data = await getConversation();
      dispatch(setConversation(data.conversations))
    }
    getConv();
  }, [userData?._id])

  // Conversation create handle 
  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data.conversation))
  }

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  // Side bar open and collapsed
  if (collapsed) {
    return (
      <div className="hidden md:flex flex-col items-center w-14 h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
          onClick={() => setCollapsed(false)}
        >
          <PanelRight />
        </button>

        <button className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all duration-200 bg-transparent border-none cursor-pointer"
          onClick={() => dispatch(setSelectedConversation(null))}>
          <Plus />
        </button>

        {/* conversation */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {conversations.map((conv) => {
            const isActive = selectedConversation?._id === conv._id;
            return (
              <div
                key={conv._id}
                onClick={() => {
                  dispatch(setSelectedConversation(conv));
                }}
                className={`flex items-center gap-2.5 cursor-pointer mb-1 px-3 py-2.5 rounded-[10px] border transition-all duration-200 ease-in-out ${isActive
                    ? "bg-indigo-500/10 border-indigo-500/20"
                    : "border-transparent hover:bg-white/5"
                  }`}
              >
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 ${isActive
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "bg-white/5 text-slate-500"
                    }`}
                >
                  <MessageSquare size={18} />
                </div>
              </div>
            );
          })}
        </div>

        {/* image */}
        <div className="relative shrink-0">
          {userData?.avatar && !imageError ? (
            <img
              key={avatarRef.current}
              src={`${userData.avatar}?${Date.now()}`}
              alt="Profile"
              className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
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
      </div>
    )
  }

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        className='lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer'
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={14} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className='lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-[270px] bg-[#0d0f14] border-r border-white/[0.06] 
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Close button for mobile */}
        <button
          className='lg:hidden absolute top-3.5 right-3.5 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer'
          onClick={() => setMobileOpen(false)}
        >
          <X size={14} />
        </button>

        {/* Sidebar Container */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* ================= HEADER ================= */}
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/6">
            <div
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 cursor-pointer"
              onClick={() => setCollapsed(true)}
            >
              <PanelLeftIcon />
            </div>

            <span className="flex-1 text-[16px] font-semibold text-slate-100 tracking-tight">
              Ciel-AI
            </span>

            <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
              Free
            </span>

            <button
              onClick={() => {
                dispatch(setSelectedConversation(null));
                if (window.innerWidth < 1024) setMobileOpen(false);
              }}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 cursor-pointer"
            >
              <PenSquare size={18} />
            </button>
          </div>

          {/* ================= NEW CHAT BUTTON ================= */}
          <div className="px-4 py-4">
            <button
              onClick={() => {
                dispatch(setSelectedConversation(null));
                if (window.innerWidth < 1024) setMobileOpen(false);
              }}
              className="w-full flex cursor-pointer items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-700 rounded-xl py-[10px] hover:opacity-90 transition-opacity duration-150"
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

          {/* ================= CONVERSATION LIST ================= */}
          <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {conversations.map((conv) => {
              const isActive = selectedConversation?._id === conv._id;
              return (
                <div
                  key={conv._id}
                  onClick={() => {
                    dispatch(setSelectedConversation(conv));
                    if (window.innerWidth < 1024) setMobileOpen(false);
                  }}
                  className={`flex items-center gap-2.5 cursor-pointer mb-1 px-3 py-2.5 rounded-[10px] border transition-all duration-200 ease-in-out ${isActive
                      ? "bg-indigo-500/10 border-indigo-500/20"
                      : "border-transparent hover:bg-white/5"
                    }`}
                >
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 ${isActive
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "bg-white/5 text-slate-500"
                      }`}
                  >
                    <MessageSquare size={18} />
                  </div>
                  <span className="truncate text-sm text-slate-200">
                    {conv.title || "New Chat"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ================= FOOTER ================= */}
          <div className="border-t border-white/6 p-3">
            <div className="px-3.5 py-3.5">
              {userData ? (
                <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150">
                  {/* user photo */}
                  <div className="relative shrink-0">
                    {userData?.avatar && !imageError ? (
                      <img
                        key={avatarRef.current}
                        src={`${userData.avatar}?${Date.now()}`}
                        alt="Profile"
                        className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
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
                    <p className="text-xs text-slate-400 mt-px">free</p>
                  </div>

                  {/* coins and logout button */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBilling(true)}
                      className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.05]"
                    >
                      <Coins size={15} />
                    </button>

                    <button
                      className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-red-500 cursor-pointer hover:bg-white/[0.05]"
                      onClick={() => {
                        logout();
                        setimageError(false);
                        dispatch(setUserData(null));
                      }}
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-700">
                  login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Billing Drawer Component */}
      <BillingDrawer
        open={showBilling}
        onClose={() => setShowBilling(false)}
      />
    </>
  );
}

export default SideBar