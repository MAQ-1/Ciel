import React from 'react'
import { PanelRightClose, Code2, PanelRightOpen, Eye, Copy,Check } from "lucide-react";
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { motion } from "motion/react"
import Editor from '@monaco-editor/react';


function Artifact() {
  const { artifacts } = useSelector((state) => state.message)
  const [collapsed, setCollapsed] = React.useState(false);
  const [tab, setTab] = useState("code")
  const [activeFile, setActiveFile] = useState(0)
  const files = artifacts[0]?.files[activeFile]
  const [copied, setCopied] = useState(false);



//  copy handler 
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(files?.content || " ");
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // preview files
  const htmlFile=artifacts[0]?.files?.find(f=>f.name==="index.html")
  const cssFile=artifacts[0]?.files?.find(f=>f.name==="style.css")
  const jsFile=artifacts[0]?.files?.find(f=>f.name==="script.js")

  const canPreview = Boolean(htmlFile)
   

  const previewDoc=`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>

      ${(cssFile?.content || "").replace(/\.\s*$/gm, "")}

    </style>
</head>
<body>

    ${(htmlFile?.content || "")
    .replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, "")
    .replace(/<link[^>]*href=["'][^"']+\.css["'][^>]*>/gi, "")
    .replace(/\.\s*$/gm, "")}


    <script>

    ${(jsFile?.content || "").replace(/\.\s*$/gm, "")}

    </script>
</body>
</html>
`  

// console.log(previewDoc);
// language detection for monaco editor
  
const detectLanguage=(filename="")=>{
   const name=filename.toLowerCase()
    // Web Technologies
    if(name.endsWith(".js")) return "javascript"
    if(name.endsWith(".jsx")) return "jsx"
    if(name.endsWith(".ts")) return "typescript"
    if(name.endsWith(".tsx")) return "tsx"
    if(name.endsWith(".html") || name.endsWith(".htm")) return "html"
    if(name.endsWith(".css")) return "css"
    if(name.endsWith(".scss")) return "scss"
    if(name.endsWith(".sass")) return "sass"
    if(name.endsWith(".less")) return "less"
    if(name.endsWith(".vue")) return "vue"
    if(name.endsWith(".svelte")) return "svelte"
    
    // Backend Languages
    if(name.endsWith(".py")) return "python"
    if(name.endsWith(".java")) return "java"
    if(name.endsWith(".php")) return "php"
    if(name.endsWith(".rb")) return "ruby"
    if(name.endsWith(".go")) return "go"
    if(name.endsWith(".rs")) return "rust"
    if(name.endsWith(".c")) return "c"
    if(name.endsWith(".cpp") || name.endsWith(".cc") || name.endsWith(".cxx")) return "cpp"
    if(name.endsWith(".h")) return "c-header"
    if(name.endsWith(".hpp")) return "cpp-header"
    if(name.endsWith(".cs")) return "csharp"
    if(name.endsWith(".swift")) return "swift"
    if(name.endsWith(".kt") || name.endsWith(".kts")) return "kotlin"
    if(name.endsWith(".dart")) return "dart"
    if(name.endsWith(".lua")) return "lua"
    if(name.endsWith(".r")) return "r"
    if(name.endsWith(".m")) return "objective-c"
    if(name.endsWith(".mm")) return "objective-cpp"
    if(name.endsWith(".pl") || name.endsWith(".pm")) return "perl"
    if(name.endsWith(".ex") || name.endsWith(".exs")) return "elixir"
    if(name.endsWith(".erl") || name.endsWith(".hrl")) return "erlang"
    if(name.endsWith(".clj") || name.endsWith(".cljs") || name.endsWith(".cljc")) return "clojure"
    if(name.endsWith(".scala")) return "scala"
    if(name.endsWith(".groovy")) return "groovy"
    if(name.endsWith(".nim")) return "nim"
    if(name.endsWith(".cr")) return "crystal"
    if(name.endsWith(".zig")) return "zig"
    
    // Shell & Scripting
    if(name.endsWith(".sh") || name.endsWith(".bash") || name.endsWith(".zsh")) return "shell"
    if(name.endsWith(".ps1")) return "powershell"
    if(name.endsWith(".bat") || name.endsWith(".cmd")) return "batch"
    if(name.endsWith(".awk")) return "awk"
    if(name.endsWith(".sed")) return "sed"
    
    // Data & Config
    if(name.endsWith(".json")) return "json"
    if(name.endsWith(".jsonc") || name.endsWith(".json5")) return "jsonc"
    if(name.endsWith(".xml")) return "xml"
    if(name.endsWith(".yml") || name.endsWith(".yaml")) return "yaml"
    if(name.endsWith(".toml")) return "toml"
    if(name.endsWith(".ini") || name.endsWith(".cfg") || name.endsWith(".conf")) return "ini"
    if(name.endsWith(".sql")) return "sql"
    if(name.endsWith(".prisma")) return "prisma"
    if(name.endsWith(".graphql") || name.endsWith(".gql")) return "graphql"
    if(name.endsWith(".proto")) return "protobuf"
    
    // Markup & Docs
    if(name.endsWith(".md")) return "markdown"
    if(name.endsWith(".rst")) return "restructuredtext"
    if(name.endsWith(".adoc")) return "asciidoc"
    if(name.endsWith(".tex")) return "latex"
    if(name.endsWith(".bib")) return "bibtex"
    
    // Templates
    if(name.endsWith(".ejs")) return "ejs"
    if(name.endsWith(".hbs") || name.endsWith(".handlebars")) return "handlebars"
    if(name.endsWith(".pug") || name.endsWith(".jade")) return "pug"
    if(name.endsWith(".mustache")) return "mustache"
    if(name.endsWith(".njk") || name.endsWith(".nunjucks")) return "nunjucks"
    if(name.endsWith(".jsp")) return "jsp"
    if(name.endsWith(".asp") || name.endsWith(".aspx")) return "asp"
    if(name.endsWith(".erb")) return "erb"
    if(name.endsWith(".haml")) return "haml"
    if(name.endsWith(".slim")) return "slim"
    
    // Build & DevOps
    if(name.endsWith(".dockerfile") || name === "dockerfile") return "dockerfile"
    if(name.endsWith(".makefile") || name === "makefile" || name.endsWith(".mk")) return "makefile"
    if(name.endsWith(".cmake") || name === "cmakelists.txt") return "cmake"
    if(name.endsWith(".tf") || name.endsWith(".tfvars")) return "terraform"
    if(name.endsWith(".hcl")) return "hcl"
    if(name.endsWith(".nix")) return "nix"
    
    // WebAssembly
    if(name.endsWith(".wat")) return "wat"
    if(name.endsWith(".wasm")) return "wasm"
    
    // Regular expressions / special
    if(name.endsWith(".regex") || name.endsWith(".re")) return "regex"
    
    return "plaintext"
}



  if(artifacts.length == 0) return null;

  return (
    <motion.div
      initial={{ width: 500 }}
      animate={{ width: collapsed ? 48 : 500 }}
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
              <button 
              onClick={handleCopyCode}
              className='p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150'>
               
               {copied ? <Check size={15}/> : <Copy size={15} />}
               
              </button>

              {/* Tab switcher */}
              {canPreview &&
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
              </div>}
              




            </div>
          </div>

    {/* file name  */}
         
         {tab==="code" && 
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
          </div>}
          
         
         {/* code editor */}

           <div className='flex-1 overflow-hidden'>
            {(tab=="preview" && canPreview)? <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transiton={{ duration: 0.5 }}
              className='h-full w-full'
              >
              <iframe title="preview" srcDoc={previewDoc} className='h-full w-full bg-slate-900' />
              </motion.div>
              :
               <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transiton={{ duration: 0.5 }}
              className='h-full w-full'
              > 
              <Editor
               theme="vs-dark"
               language={detectLanguage(files?.name)}
               value={files.content}
                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 20, fontSize:13,wordWrap: "on",scrollBeyondLastLine: false,automaticLayout: true,
               padding:{top:16} ,lineNumbers: "on",renderLineHighlight: "none",cursorBlinking: "blink",}}
              />

              </motion.div>
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