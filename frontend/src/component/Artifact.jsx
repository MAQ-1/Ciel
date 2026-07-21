import React from 'react'
import { PanelRightClose, Code2, PanelRightOpen, Eye, Copy } from "lucide-react";
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { motion } from "motion/react"

function Artifact() {
  const { artifacts } = useSelector((state) => state.message)
  const [collapsed, setCollapsed] = React.useState(false);
  const [tab, setTab] = useState("code")
  const [activeFile, setActiveFile] = useState(0)
  
  const files = artifacts[0]?.files[activeFile]?.content
  const 




  if (artifacts.length == 0) return null;

  return (
    <motion.div
      initial={{ width: 350 }}
      animate={{ width: collapsed ? 48 : 350 }}
      transition={{ duration: 0.25 }}
      className="hidden lg:flex h-full border border-white/[0.06] bg-[#0d0f14] flex-col overflow-hidden shrink-0"
    >
      {!collapsed ? (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-14 px-3 border-b border-white/[0.06] flex items-center gap-2 shrink-0">
            {/* Collapse button */}
            <button
              className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0'
              onClick={() => setCollapsed(true)}
            >
              <PanelRightClose size={20} />
            </button>

            {/* Title section */}
            <div className='flex items-center gap-2.5 flex-1 min-w-0'>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 shrink-0">
                <Code2 className='w-4 h-4' />
              </div>
              <span className='text-sm text-slate-300 truncate'>
                {artifacts[0]?.title}
              </span>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2 shrink-0'>
              {/* Copy button */}
              <button className='p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150'>
                <Copy size={15} />
              </button>

              {/* Tab switcher */}
              <div className="flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.06] p-0.5 rounded-md">
                <button
                  onClick={() => setTab("code")}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded transition-all duration-150
                    ${tab === "code"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <Code2 size={12} />
                  <span>Code</span>
                </button>
                <button
                  onClick={() => setTab("preview")}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded transition-all duration-150
                    ${tab === "preview"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <Eye size={12} />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>

    {/* file name  */}
          <div className='flex border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0'>
            {
              artifacts[0]?.files?.map((f, index) => (
                <button
                  key={index}
                  className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/[0.05] relative cursor-pointer bg-transparent ${activeFile === index ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  onClick={() => setActiveFile(index)}
                >
                  {f?.name}
                  {activeFile === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full"/>
                  )}
                </button>
              ))
            }
          </div>


        </div>
      ) : (
        /* Collapsed state */
        <div className='flex flex-col items-center py-4 gap-3 h-full'>
          <button
            className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/05 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0'
            onClick={() => setCollapsed(false)}
          >
            <PanelRightOpen size={20} />
          </button>
          <div className='flex-1 flex items-center'>
            <div
              className='text-[10px] font-medium text-slate-500 tracking-widest uppercase whitespace-nowrap'
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)"
              }}
            >
              {artifacts[0]?.title}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Artifact