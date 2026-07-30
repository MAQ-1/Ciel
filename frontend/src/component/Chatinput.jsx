import React from 'react'
import { Mic, Paperclip, Send, MicOff } from "lucide-react"
import { useState } from 'react'
import sendMessage from '../features/sendMessage.js'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addMessage, setLoading, setArtifacts } from '../redux/messageSlice.js'
import { createConversation } from '../features/createConversation.js'
import { setSelectedConversation, addConversation } from '../redux/conversationSlice.js'
import { updateConversation } from '../features/updateConversation.js'
import { setConvTitle } from '../redux/conversationSlice.js'
import { useEffect } from 'react'
import { Zap, MessageSquare, Code2, FileText, ImageIcon, Presentation, Globe, X } from "lucide-react"
import { useRef } from 'react'


function Chatinput() {
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const { selectedConversation } = useSelector((state) => state.conversation)
  const { messages, isLoading } = useSelector((state) => state.message)
  const [value, setValue] = useState("")
  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState(null)

  const fileRef = useRef(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);


  // FOR MIC
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setValue(transcript);
    }

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, [])

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported")
      return
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SSE stream handler for coding agent.
  // Uses native fetch so we can read the response body as a stream.
  // This is the fix for the 504: the server sends SSE headers + heartbeat
  // immediately, keeping the ALB connection alive throughout LLM generation.
  // ─────────────────────────────────────────────────────────────
  const sendCodingStream = async ({ prompt, conversationId, agent }) => {
    const baseURL = import.meta.env.VITE_SERVER_URL || ""

    const res = await fetch(`${baseURL}/api/agent/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        prompt,
        conversationId,
        agent,
      }),
    })

    if (!res.ok) {
      throw new Error(`Stream request failed with status ${res.status}`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""
    let result = { text: null, artifacts: null, error: null }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n\n")
      buffer = lines.pop() // keep the incomplete trailing chunk

      for (const line of lines) {
        // SSE comments (": heartbeat", ": generating") — skip silently
        if (line.startsWith(":")) continue
        if (!line.startsWith("data: ")) continue

        const raw = line.slice(6).trim()
        if (raw === "[DONE]") return result

        try {
          const parsed = JSON.parse(raw)
          if (parsed.error) {
            result.error = parsed.error
            return result
          }
          // Final event from agentStream controller
          if (parsed.text !== undefined) result.text = parsed.text
          if (parsed.artifacts !== undefined) result.artifacts = parsed.artifacts
        } catch {
          // malformed chunk — ignore
        }
      }
    }

    return result
  }

  const handleSendMessage = async () => {
    const prompt = value.trim()
    if (!prompt) return

    dispatch(setLoading(true))

    let conversation = selectedConversation
    if (!conversation) {
      const conv = await createConversation()
      dispatch(setSelectedConversation(conv))
      dispatch(addConversation(conv))
      conversation = conv
    }

    if (conversation.title === "New Chat") {
      await updateConversation({ id: conversation._id, title: prompt })
      dispatch(setConvTitle({ conversationId: conversation._id, title: prompt }))
    }

    dispatch(addMessage({ role: "user", content: prompt }))
    setValue("")

    const agentKey = selectedAgent.toLowerCase()
    // Auto routes to an unknown agent on the backend — could be coding (slow).
    // Coding is always slow.
    // Both must use the SSE route so ALB heartbeat keeps the connection alive.
    const useStream = agentKey === "coding" || agentKey === "auto" || agentKey === "vision"

    if (useStream) {
      // ── CODING / AUTO: use SSE stream route ─────────────────
      try {
        const result = await sendCodingStream({
          prompt,
          conversationId: conversation._id,
          agent: agentKey,
        })

        dispatch(setLoading(false))
        setSelectedFile(null)

        if (result.error) {
          dispatch(addMessage({
            role: "assistant",
            content: `Error: ${result.error}`,
            images: []
          }))
          return
        }

        if (result.artifacts?.length > 0) {
          dispatch(setArtifacts(result.artifacts))
          dispatch(addMessage({
            role: "assistant",
            content: result.text || "Code generated successfully.",
            images: []
          }))
        } else {
          dispatch(addMessage({
            role: "assistant",
            content: result.text || "No response received.",
            images: result.images || []
          }))
        }
      } catch (err) {
        console.error("Stream error:", err)
        dispatch(setLoading(false))
        setSelectedFile(null)
        dispatch(addMessage({
          role: "assistant",
          content: "Generation is taking longer than expected. Please refresh to see the result.",
          images: []
        }))
      }
    } else {
      // ── ALL OTHER AGENTS: existing axios route ───────────────
      const formData = new FormData()
      formData.append("prompt", prompt)
      formData.append("conversationId", conversation._id)
      formData.append("agent", selectedAgent.toLowerCase())
      if (selectedFile) formData.append("file", selectedFile)

      const data = await sendMessage(formData)

      dispatch(setLoading(false))
      setSelectedFile(null)

      if (data) {
        dispatch(setArtifacts(data.artifacts || []))
        dispatch(addMessage({ role: "assistant", content: data.answer, images: data.images }))
      } else {
        dispatch(addMessage({
          role: "assistant",
          content: "Failed to get a response. Please try again.",
          images: []
        }))
      }
    }
  }


  const agents = [
    { id: "auto",    icon: Zap,          label: "Auto"        },
    { id: "chat",    icon: MessageSquare, label: "Chat"        },
    { id: "coding",  icon: Code2,         label: "Coding"      },
    { id: "pdf",     icon: FileText,      label: "PDF"         },
    { id: "vision",  icon: ImageIcon,     label: "vision"      },
    { id: "ppt",     icon: Presentation,  label: "PPT"         },
    { id: "search",  icon: Globe,         label: "Search"      },
  ]


  return (
    <>
      <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] ng=[#0d0f14]">

        <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">

          {/* agent selector */}
          <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
            {agents.map((agent) => {
              const isActive = selectedAgent === agent.label;
              const Icon = agent.icon;
              return (
                <div
                  key={agent.label}
                  onClick={() => setSelectedAgent(agent.label)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all
                    ${isActive
                      ? "bg-gradient-to-r from-indigo-500 to-violet-700 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                      : "bg-white/[0.05] text-slate-400 border-transparent hover:bg-white/[0.08] hover:text-slate-200 cursor-pointer"
                    }`}
                >
                  <Icon size={15} className={isActive ? "text-white" : "text-slate-500"} />
                  {agent.label}
                </div>
              )
            })}
          </div>

          {/* file preview */}
          {selectedFile && (
            <div className="my-1">
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 relative">
                {selectedFile.type === "application/pdf" ? (
                  <>
                    <FileText size={18} className="text-red-400" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-[10px] text-white/80 max-w-[100px] truncate">{selectedFile.name}</span>
                      <span className="text-[8px] text-white/40">{(selectedFile.size / 1024).toFixed(0)} KB</span>
                    </div>
                  </>
                ) : selectedFile.type.startsWith("image/") ? (
                  <>
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-8 w-8 rounded object-cover" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-[10px] text-white/80 max-w-[100px] truncate">{selectedFile.name}</span>
                      <span className="text-[8px] text-white/40">{(selectedFile.size / 1024).toFixed(0)} KB</span>
                    </div>
                  </>
                ) : (
                  <span className="text-[10px] text-white">{selectedFile.name}</span>
                )}
                <button
                  onClick={() => setSelectedFile(null)}
                  className="ml-1 rounded-full p-0.5 hover:bg-white/10 transition"
                >
                  <X size={12} className="text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          )}

          <textarea
            onChange={(e) => setValue(e.target.value)}
            value={value}
            placeholder="Type your message..."
            className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input type="file" accept=".pdf,image/*" hidden ref={fileRef} onChange={(e) => {
                const file = e.target.files[0];
                if (file) setSelectedFile(file);
              }} />

              <button
                onClick={() => fileRef.current.click()}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer"
              >
                <Paperclip size={16} />
              </button>

              <button
                onClick={toggleMic}
                className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-150 bg-transparent cursor-pointer hover:scale-105 active:scale-95
                  ${listening
                    ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50 border-red-400"
                    : "border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 hover:border-slate-500/30"
                  }`}
              >
                {listening ? <Mic size={16} /> : <MicOff size={16} />}
              </button>
            </div>

            <button
              disabled={!value?.trim() || isLoading}
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
    </>
  )
}

export default Chatinput
