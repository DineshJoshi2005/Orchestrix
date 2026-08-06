import React from 'react'
import { Check, Code2, Copy, Eye, PanelRightClose, PanelRightOpen } from "lucide-react"
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import Editor from "@monaco-editor/react"
import { easeInOut, motion } from "motion/react"
import { updateArtifactFile } from '../redux/messageSlice';

const Artifact = () => {
    const dispatch = useDispatch();
    const { artifacts } = useSelector(state => state.message);
    const [collapsed, setCollapsed] = useState(false);
    const [tab, setTab] = useState("code");
    const [activeFile, setActiveFile] = useState(0);
    const [copied, setCopied] = useState(false);
    if (artifacts.length == 0) return;
    

    const file = artifacts[0]?.files[activeFile]?.content;
    const activeFileData = artifacts[0]?.files[activeFile];
    const htmlFile = artifacts[0]?.files?.find(f => f.name === "index.html");
    const cssFile = artifacts[0]?.files?.find(f => f.name === "style.css");
    const jsFile = artifacts[0]?.files?.find(f => f.name === "script.js");

    const canPreview = Boolean(htmlFile)

    const previewDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            ${cssFile?.content || ""}
        </style>
    </head>
    <body>
        ${htmlFile?.content||""}

    <script>
        ${jsFile?.content||""}
    </script>
    </body>
    </html>
    `
    const handleCopy = async() => {
        await navigator.clipboard.writeText(file ?? "");
        setCopied(true);
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    const detectLanguage = (fileName="") => {
        const name = fileName.toLowerCase()

        if (name.endsWith(".html"))
            return "html";
        if (name.endsWith(".css"))
            return "css";
        if (name.endsWith(".js"))
            return "javascript";
        if (name.endsWith(".jsx"))
            return "javascript";
        if (name.endsWith(".ts"))
            return "typescript";
        if (name.endsWith(".json"))
            return "json";
        if (name.endsWith(".tsx"))
            return "typescript";
        if (name.endsWith(".py"))
            return "python";
        if (name.endsWith(".cpp"))
            return "cpp";
        if (name.endsWith(".java"))
            return "java";
        if (name.endsWith(".c"))
            return "c";

        return "plaintext"
    }
    return (
        <motion.div
            initial={{ width: "450px" }}
            animate={{ width: collapsed ? 48 : 450 }}
            transition={{
                ease: easeInOut
            }}
            className='hidden lg:flex h-full border-1 border-white/[0.06] flex-col overflow-hidden shrink-0 '>
            {!collapsed ? <div className='flex flex-col h-full bg-[#0d0f14]'>
                <div className='h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0'>
                    <button className='flex items-center justify-center w-7 h-7 text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0' onClick={() => setCollapsed(true)}>
                        <PanelRightClose />
                    </button>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <div className='flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0'>
                            <Code2 className='text-indigo-400' size={13} />
                        </div>
                        <div className='text-[13px] font-medium text-slate-200 truncate'>{artifacts[0]?.title}</div>
                    </div>
                    <div className='flex items-center gap-1 shrink-0'>
                        <button onClick={handleCopy} className='flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer '>
                            {copied ? <Check size={15}/> : <Copy size={15} />}
                        </button>

                    </div>
                    {canPreview && 
                        <div className='flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg '>
                            <button onClick={() => setTab("code")} className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md cursor-pointer transition-colors duration-150 ${tab === "code" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-200"}`}>
                                <Code2 size={12} /> Code
                            </button>
                            <button onClick={() => setTab("preview")} className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md  cursor-pointer transition-colors duration-150 ${tab === "preview" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-200"}`}>
                                <Eye size={12} /> Preview
                            </button>
                        </div>}
                </div>
                {tab === "code" && 
                    <div className='h-auto border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0'>
                        {artifacts[0]?.files?.map((f, index) => (
                            <button onClick={() => setActiveFile(index)} className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/[0.05] relative cursor-pointer bg-transparent ${activeFile == index ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}>
                                {f?.name}
                                {activeFile === index &&
                                    <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full ' />}
                            </button>
                        ))}
                    </div>
                }

                <div className='flex-1 overflow-hidden '>
                    {(tab == "preview" && canPreview) ?
                        <motion.div
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                            transition={{
                                duration:0.5
                            }}
                            className='h-full w-full'
                        >
                            <iframe title='preview' srcDoc={previewDoc} sandbox='allow-scripts' className='w-full h-full bg-white'/>
                        </motion.div> :

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                duration: 0.5
                            }}
                            className='h-full w-full'
                        >
                            <Editor
                                theme="vs-dark"
                                language={detectLanguage(activeFileData?.name)}
                                value={activeFileData?.content}
                                onChange={(value) => {
                                    dispatch(
                                        updateArtifactFile({
                                            artifactId: artifacts[0].id,
                                            fileIndex: activeFile,
                                            content: value ?? ""
                                        })
                                    );
                                }}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    wordWrap: "on",
                                    automaticLayout: true,
                                    
                                    padding: { top: 16 },
                                    lineNumbers: "on",
                                    renderLineHighlight: "none"
                                }}
                            />
                        </motion.div>}
                </div>
            </div> : <div className='hidden lg:flex h-full border-1 border-white/[0.06] flex-col items-center py-4 gap-3 shrink-0 bg-[#0d0f14]'>
                <button className='flex items-center justify-center w-7 h-7 text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0' onClick={() => setCollapsed(false)}>
                    <PanelRightOpen />
                </button>
                <div className='flex items-center gap-2 flex-1 min-w-0'>
                    <div className='text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap'
                        style={{
                            writingMode: "vertical-lr"
                        }}>{artifacts[0]?.title}</div>
                </div>
            </div>}
        </motion.div>
    )
}

export default Artifact
