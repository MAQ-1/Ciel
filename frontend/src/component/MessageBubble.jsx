import React from 'react'
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useState } from 'react'
import { X, ExternalLink } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

function MessageBubble({ role, content, images }) {

  const isUser = role === "user"
  const [lightBox, setLightBox] = React.useState(null)
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };




  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold mr-2.5 flex-shrink-0 shadow-sm shadow-purple-500/30">
          AI
        </div>
      )}
      <div className={`relative max-w-[78%] px-4.5 py-3 rounded-2xl text-[14px] leading-relaxed
            ${isUser
          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-sm shadow-md shadow-blue-500/20"
          : "bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] text-slate-200 rounded-bl-sm shadow-sm"
        }`}>

        {!isUser && (
          <div className="absolute -left-1.5 top-3 w-3 h-3 bg-white/[0.06] border-l border-b border-white/[0.08] rotate-45" />
        )}

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
              >
                <img
                  src={img}

                  onClick={() => setLightBox(img)}
                  loading="lazy"
                  onError={(e) => e.currentTarget.remove()}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}

        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mt-5 mb-3">
                {children}
              </h1>
            ),

            h2: ({ children }) => (
              <h2 className="text-xl font-bold mt-4 mb-2">
                {children}
              </h2>
            ),

            h3: ({ children }) => (
              <h3 className="text-lg font-bold mt-3 mb-2">
                {children}
              </h3>
            ),

            p: ({ children }) => (
              <p className="mb-3 leading-7 break-words">
                {children}
              </p>
            ),

            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-3 space-y-1">
                {children}
              </ul>
            ),

            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-3 space-y-1">
                {children}
              </ol>
            ),

            li: ({ children }) => <li>{children}</li>,

            strong: ({ children }) => (
              <strong className="font-semibold text-white">
                {children}
              </strong>
            ),

            em: ({ children }) => (
              <em className="italic">
                {children}
              </em>
            ),

            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-400 hover:underline"
              >
                {children}
                <ExternalLink size={14} />
              </a>
            ),

            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-slate-500 pl-4 italic my-3 text-slate-300">
                {children}
              </blockquote>
            ),

            hr: () => (
              <hr className="my-4 border-white/10" />
            ),

            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");

              if (!inline && match) {
                return (
                  <div className="relative my-4 group">
                    <button
                      onClick={() => handleCopyCode(codeString)}
                      className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md bg-zinc-800/90 px-2 py-1 text-xs text-slate-200 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-zinc-700"
                    >
                      {copiedCode === codeString ? (
                        <>
                          <Check size={14} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy
                        </>
                      )}
                    </button>

                    <SyntaxHighlighter
                      language={match[1]}
                      style={oneDark}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: "12px",
                        padding: "1rem",
                        background: "#18181b",
                      }}
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              return (
                <code
                  className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-sky-300"
                  {...props}
                >
                  {children}
                </code>
              );
            },

            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full border border-white/10 rounded-lg overflow-hidden">
                  {children}
                </table>
              </div>
            ),

            thead: ({ children }) => (
              <thead className="bg-white/5">
                {children}
              </thead>
            ),

            tbody: ({ children }) => (
              <tbody>{children}</tbody>
            ),

            th: ({ children }) => (
              <th className="border border-white/10 px-3 py-2 text-left font-semibold">
                {children}
              </th>
            ),

            td: ({ children }) => (
              <td className="border border-white/10 px-3 py-2">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </Markdown>
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-[10px] font-bold ml-2.5 flex-shrink-0 shadow-sm shadow-purple-500/20">
          U
        </div>
      )}

      {lightBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <button
            onClick={() => setLightBox(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={lightBox}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain border border-white/10"
          />
        </div>
      )}
    </div>
  )
}

export default MessageBubble