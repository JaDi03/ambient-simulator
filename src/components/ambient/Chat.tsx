'use client';

import { useState, useRef, useEffect } from 'react';
import CodeSimulator from './CodeSimulator';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface SubMission {
    title: string;
    tagline: string;
    desc: string;
    goal: string;
    action: string;
    prompt: string;
    code: string;
}

const SUB_MISSIONS: SubMission[] = [
    {
        title: "Technical Check",
        tagline: "Grounded UX",
        desc: "Research a technical topic you know deeply. Watch for hallucinations and output quality.",
        goal: "Evaluate precision.",
        action: "Proof of Logits verification.",
        prompt: "Explain how the Solana Virtual Machine (SVM) handles account-based concurrency compared to EVM.",
        code: `// Ambient Web2 API - Verified Inference\nconst response = await fetch("https://api.ambient.xyz/v1/chat/completions", {\n  method: "POST",\n  headers: { "Authorization": "Bearer AMBIENT_API_KEY" },\n  body: JSON.stringify({\n    model: "zai-org/GLM-4.6",\n    messages: [{ role: "user", content: "..." }],\n    wait_for_verification: true,\n    emit_verified: true\n  })\n});`
    },
    {
        title: "Context Stress",
        tagline: "Window Synthesis",
        desc: "Summarize a long paper or blog post to challenge the context window and reasoning bounds.",
        goal: "Validate synthesis.",
        action: "Distributed token processing.",
        prompt: "Based on the official docs, explain the core difference between Proof of Work (Ambient) and Proof of Stake (Solana).",
        code: `// 600B+ Parameter Context Processing\nimport { AmbientClient } from "ambient-ai-sdk";\n\nconst ambient = new AmbientClient("YOUR_KEY");\nconst stream = await ambient.chat.completions.create({\n  model: "zai-org/GLM-4.6",\n  messages: [{ role: "user", content: payload }],\n  stream: true,\n  verify: "pol" // Proof of Logits\n});`
    },
    {
        title: "Logic Pulse",
        tagline: "Reasoning Baseline",
        desc: "Request multi-step reasoning, not just answers. Assess cognitive PROCESSING limits.",
        goal: "Analyze logic tiers.",
        action: "Sequential reasoning chain.",
        prompt: "Solve this riddle using step-by-step logic: If a decentralised network has 100 nodes but only 33% are needed for consensus, what happens if 40 nodes go offline? Explain the impact on safety vs liveness.",
        code: `// Multi-step Decentralized Reasoning\nconst logicJob = {\n  type: "inference",\n  configuration: {\n    reasoning: "extensive",\n    steps: "sequential"\n  },\n  payload: prompt,\n  wait_for_proof: true\n};\n\nconst result = await ambient.execute(logicJob);`
    }
];

export default function Chat() {
    const [activeTab, setActiveTab] = useState(1);
    const [web2Mode, setWeb2Mode] = useState<'manual' | 'auto'>('manual');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [activeCode, setActiveCode] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Standard shared height for all panels
    const PANEL_HEIGHT = "h-[820px]";

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const runSubMission = (mission: SubMission) => {
        setActiveCode(mission.code);
        setIsSimulating(true);
        setInput(mission.prompt);
    };

    const handleSimulatedComplete = () => {
        setIsSimulating(false);
        handleSubmit(undefined, true);
    };

    const runWeb2Challenge = (step: number) => {
        if (step === 1) {
            setActiveCode(`// Challenge #1: Prepare Request\nconst payload = {\n  model: "zai-org/GLM-4.6",\n  messages: [{ role: "user", content: "Who is Ambient?" }],\n  wait_for_verification: true\n};`);
            setIsSimulating(true);
        } else if (step === 2) {
            setActiveCode(`// Challenge #1: Execute Call\nconst response = await fetch("https://api.ambient.xyz/v1/chat/completions", {\n  method: "POST",\n  body: JSON.stringify(payload)\n});`);
            setIsSimulating(true);
        } else if (step === 3) {
            setActiveCode(`// Challenge #1: Inspect Receipt\n// PoL Found: 0x72a...dff0\n// Consensus Status: 100% Verified\nconsole.log("Integrity Guaranteed.");`);
            setIsSimulating(true);
            setIsVerifying(true);
        }
    };

    const handleSubmit = async (e?: React.FormEvent, forcePrompt?: boolean) => {
        if (e) e.preventDefault();
        const finalInput = forcePrompt ? input : input;
        if (!finalInput.trim() || isTyping || isSimulating) return;

        const userMessage: Message = { role: 'user', content: finalInput };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setIsVerifying(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage], verify: true }),
            });
            if (!response.ok) throw new Error('Network error');
            const reader = response.body?.getReader();
            if (!reader) return;
            let assistantContent = '';
            setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;
                        try {
                            const json = JSON.parse(data);
                            const content = json.choices[0]?.delta?.content || '';
                            assistantContent += content;
                            setMessages((prev) => {
                                const last = prev[prev.length - 1];
                                if (last.role === 'assistant') {
                                    return [...prev.slice(0, -1), { role: 'assistant', content: assistantContent }];
                                }
                                return prev;
                            });
                        } catch (e) { }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
            setIsVerifying(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch justify-center max-h-[92vh]">

            {/* COLUMN 1: Description & Global Tab Selector (Left - 450px) */}
            <div className={`flex flex-col w-full lg:w-[450px] shrink-0 gap-6 ${PANEL_HEIGHT}`}>
                {/* Description Box */}
                <div className="glass-card bg-white/95 p-8 rounded-[2.5rem] shadow-xl border-cyan-500/10 text-left h-[260px] shrink-0">
                    <div className="text-[10px] uppercase tracking-[0.4em] font-black text-cyan-600 mb-4">Introduction</div>
                    <h3 className="text-2xl font-bold mb-4 tracking-tighter text-black leading-none">Ambient Simulator</h3>
                    <p className="text-[14px] text-black/60 leading-relaxed font-medium">
                        Explore the decentralized machine intelligence protocol through live verification loops.
                    </p>
                    <div className="mt-4 p-4 bg-cyan-50/50 rounded-2xl border border-cyan-100/50">
                        <p className="text-[11px] text-cyan-800 font-bold leading-relaxed italic">
                            "Verifiable AI at decentralized scale."
                        </p>
                    </div>
                </div>

                {/* Global Mission Selectors (1, 2, 3) */}
                <div className="glass-card bg-white/95 p-8 rounded-[2.5rem] shadow-xl border-cyan-500/10 flex-grow overflow-hidden">
                    <div className="text-[10px] uppercase tracking-[0.4em] font-black text-cyan-600 mb-6 text-left">Navigation Hub</div>
                    <div className="flex flex-col gap-4">
                        {[
                            { id: 1, title: 'Mission 1', tag: 'User Loop' },
                            { id: 2, title: 'Mission 2', tag: 'Web2 Audit' },
                            { id: 3, title: 'Mission 3', tag: 'Web3 Ledger' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group flex items-center justify-between border-2 p-5 rounded-[2rem] text-left transition-all ${activeTab === tab.id ? 'bg-cyan-50 border-cyan-400/50 shadow-md scale-[1.02]' : 'bg-white border-transparent hover:border-cyan-400/30 hover:bg-zinc-50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`text-2xl font-black transition-colors ${activeTab === tab.id ? 'text-cyan-600' : 'text-black/10'}`}>0{tab.id}</span>
                                    <h4 className={`font-black text-[14px] uppercase tracking-tighter transition-colors ${activeTab === tab.id ? 'text-cyan-800' : 'text-black'}`}>{tab.title}</h4>
                                </div>
                                <span className="text-[9px] bg-cyan-100/50 text-cyan-700 px-3 py-1 rounded-full uppercase font-black tracking-widest">{tab.tag}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* COLUMN 2: Instructions Panel (Center - 450px) */}
            <div className={`flex flex-col w-full lg:w-[450px] shrink-0 ${PANEL_HEIGHT}`}>
                <div className="glass-card bg-white/90 p-8 rounded-[2.5rem] shadow-xl border-cyan-500/10 overflow-y-auto h-full scrollbar-hide">

                    {activeTab === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-cyan-600 mb-3 text-left">Community Activation</div>
                            <h2 className="text-3xl font-extralight mb-6 leading-tight tracking-tight text-left">User Loop: <br /> Use & Break It</h2>

                            <div className="space-y-6 mb-8 text-left">
                                <div className="space-y-2">
                                    <h4 className="text-[11px] uppercase font-black text-black/40 tracking-wider">Step 1: Protocol Explorer</h4>
                                    <p className="text-[13px] text-black/60 leading-relaxed font-medium">
                                        Go to <a href="https://t.co/QLYcQ8tSPv" target="_blank" className="text-cyan-600 font-bold hover:underline">app.ambient.xyz</a> and start testing the network as per the <a href="https://x.com/ambient_xyz/status/1999168669641789680?s=20" target="_blank" className="text-cyan-600 font-bold hover:underline">official announcement</a>.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-[11px] uppercase font-black text-black/40 tracking-wider">Step 2: Community Reporting</h4>
                                    <p className="text-[13px] text-black/60 leading-relaxed font-medium">
                                        Submit research write-up in: <a href="https://discord.com/channels/1334942930695225365/1448970141940322354" target="_blank" className="bg-cyan-50 px-2 py-0.5 rounded text-cyan-700 font-bold hover:bg-cyan-100 transition-colors inline-flex items-center gap-1">testnet-feedback</a>
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-black/5">
                                    <p className="text-[13px] font-black text-black/80 mb-2 leading-tight">
                                        Or do it right here and see the real code:
                                    </p>

                                    <div className="flex items-center gap-2 mb-4 text-cyan-600">
                                        <span className="text-[10px] uppercase font-black tracking-widest">Choose an option</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="animate-bounce">
                                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                                        </svg>
                                    </div>

                                    <div className="flex flex-col gap-3 mb-6">
                                        {SUB_MISSIONS.map((m) => (
                                            <button
                                                key={m.title}
                                                onClick={() => runSubMission(m)}
                                                className="group w-full bg-zinc-400/[0.03] border-2 border-transparent hover:border-cyan-400/50 p-4 rounded-2xl text-left transition-all hover:bg-white hover:shadow-md"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-black text-[13px] group-hover:text-cyan-600 transition-colors uppercase tracking-tight">{m.title}</h3>
                                                    <span className="text-[8px] bg-cyan-100/50 text-cyan-700 px-2 py-0.5 rounded-full uppercase font-black tracking-widest">{m.tagline}</span>
                                                </div>
                                                <p className="text-[11px] text-black/40 font-medium leading-tight line-clamp-1">{m.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-cyan-600 mb-3 text-left">Developer Mission</div>
                            <h2 className="text-3xl font-extralight mb-2 leading-tight tracking-tight text-left uppercase">Web2 Loop:</h2>
                            <h3 className="text-xl font-black text-black/40 mb-6 tracking-tighter uppercase italic leading-none">Micro-Challenge #1</h3>

                            {/* Mission Strategy Selector */}
                            <div className="flex bg-zinc-100 p-1 rounded-full mb-8 relative">
                                <button
                                    onClick={() => setWeb2Mode('manual')}
                                    className={`flex-1 py-2 text-[10px] uppercase font-black rounded-full transition-all relative z-10 ${web2Mode === 'manual' ? 'text-cyan-800' : 'text-black/30'}`}
                                >Manual Path</button>
                                <button
                                    onClick={() => setWeb2Mode('auto')}
                                    className={`flex-1 py-2 text-[10px] uppercase font-black rounded-full transition-all relative z-10 ${web2Mode === 'auto' ? 'text-cyan-800' : 'text-black/30'}`}
                                >Auto Path</button>
                                <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ${web2Mode === 'auto' ? 'translate-x-full' : 'translate-x-0'}`} />
                            </div>

                            <div className="space-y-6 text-left">
                                <div className="p-5 bg-cyan-50/50 border border-cyan-100/50 rounded-2xl mb-4">
                                    <p className="text-[12px] font-bold text-cyan-900 mb-1">Challenge Objective:</p>
                                    <p className="text-[13px] text-cyan-800 leading-snug">Make your first verified inference call to the protocol.</p>
                                </div>

                                {web2Mode === 'manual' ? (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="space-y-2">
                                            <h4 className="text-[11px] uppercase font-black text-black/40 tracking-wider">Guide & Resources</h4>
                                            <p className="text-[13px] text-black/60 leading-relaxed font-medium italic">Follow the official documentation to setup your environment and execute your first request.</p>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <a href="https://ambient.xyz/docs" target="_blank" className="flex items-center justify-between p-4 bg-white border-2 border-zinc-100 rounded-2xl hover:border-cyan-400 group transition-all">
                                                <span className="text-[13px] font-black group-hover:text-cyan-700 uppercase tracking-tighter">1. API Documentation</span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-300 group-hover:text-cyan-500"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
                                            </a>
                                            <a href="https://ambient.xyz/verify" target="_blank" className="flex items-center justify-between p-4 bg-white border-2 border-zinc-100 rounded-2xl hover:border-cyan-400 group transition-all">
                                                <span className="text-[13px] font-black group-hover:text-cyan-700 uppercase tracking-tighter">2. Audit Receipt Portal</span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-300 group-hover:text-cyan-500"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
                                            </a>
                                        </div>
                                        <div className="mt-4 p-4 border-2 border-zinc-50 rounded-2xl">
                                            <p className="text-[10px] uppercase font-black text-black/20 mb-2">Technical Insight</p>
                                            <p className="text-[11px] text-black/40 leading-relaxed font-bold uppercase tracking-tight">The <span className="text-cyan-600">Proof of Logits</span> ensures that the model output you receive hasn't been tampered with by any intermediary node.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div className="space-y-2 mb-6">
                                            <h4 className="text-[11px] uppercase font-black text-black/40 tracking-wider">Task Breakdown</h4>
                                            <ul className="space-y-2">
                                                {['Send prompt via Web2 API', 'Receive official response', 'Inspect cryptographic proof'].map((task, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-[12px] font-bold text-black/60">
                                                        <div className="w-4 h-4 rounded-full border-2 border-cyan-200 flex items-center justify-center text-[8px] font-black text-cyan-600">{i + 1}</div>
                                                        {task}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <button onClick={() => runWeb2Challenge(1)} className="w-full text-left p-4 bg-white border-2 border-zinc-100 rounded-2xl hover:border-cyan-400 group transition-all">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[12px] font-black group-hover:text-cyan-700 uppercase tracking-tighter">01. Prepare Request</span>
                                                    <div className="w-6 h-6 rounded-full bg-cyan-50 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-cyan-600"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div>
                                                </div>
                                            </button>
                                            <button onClick={() => runWeb2Challenge(2)} className="w-full text-left p-4 bg-white border-2 border-zinc-100 rounded-2xl hover:border-cyan-400 group transition-all">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[12px] font-black group-hover:text-cyan-700 uppercase tracking-tighter">02. Execute Call</span>
                                                    <div className="w-6 h-6 rounded-full bg-cyan-50 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-cyan-600"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                                                </div>
                                            </button>
                                            <button onClick={() => runWeb2Challenge(3)} className="w-full text-left p-4 bg-white border-2 border-zinc-100 rounded-2xl hover:border-cyan-400 group transition-all">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[12px] font-black group-hover:text-cyan-700 uppercase tracking-tighter">03. Audit Receipt</span>
                                                    <div className="w-6 h-6 rounded-full bg-cyan-700 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-white"><path d="M20 6L9 17l-5-5" /></svg></div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 3 && (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-40 animate-in zoom-in duration-500">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4"><path d="M12 2v20M2 12h20" /></svg>
                            <h3 className="text-xl font-black uppercase tracking-widest">Web3 Loop</h3>
                            <p className="text-sm font-medium">Ledger Settlement Integration Coming Soon.</p>
                        </div>
                    )}

                </div>
            </div>

            {/* COLUMN 3: Console & Chat Result (Right - 850px) */}
            <div className={`flex flex-col w-full lg:w-[850px] shrink-0 gap-4 ${PANEL_HEIGHT}`}>

                {/* Simulator Panel (200px fixed) */}
                <div className="w-full h-[220px] shrink-0">
                    <CodeSimulator
                        code={activeCode || "// Ambient Unified Simulator v3.7.0\n// Awaiting protocol trigger from the Mission Controller..."}
                        isActive={isSimulating}
                        onComplete={handleSimulatedComplete}
                    />
                </div>

                {/* Chat / Result Panel (Flexible within height) */}
                <div className="glass-card bg-white/40 p-8 flex flex-col items-center shadow-2xl w-full border-cyan-500/10 rounded-[2.5rem] flex-grow overflow-hidden">
                    <div
                        ref={scrollRef}
                        className="flex flex-col gap-6 overflow-y-auto mb-6 pr-4 scrollbar-hide w-full flex-grow h-0"
                    >
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center opacity-30 scale-90">
                                <div className="text-5xl mb-4 text-cyan-500">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                                </div>
                                <p className="italic text-xl font-extralight tracking-tight text-black">Awaiting protocol session...</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-7 py-4 rounded-[1.8rem] text-[15px] shadow-sm font-medium leading-relaxed ${msg.role === 'user'
                                    ? 'bg-cyan-100/50 text-cyan-900 rounded-tr-none border border-cyan-200/50'
                                    : 'bg-white border border-cyan-500/10 text-black/90 rounded-tl-none shadow-md'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl px-2 shrink-0">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isSimulating ? "Decoding inference..." : "Execute prompt..."}
                            disabled={isSimulating}
                            className="w-full px-10 py-6 bg-cyan-50/50 border-2 border-cyan-100/30 rounded-full text-base focus:outline-none focus:border-cyan-500 transition-all shadow-xl pr-24 font-bold disabled:opacity-50 placeholder:text-cyan-900/10"
                        />
                        <button
                            type="submit"
                            className="absolute right-6 top-3 p-4 bg-cyan-700 text-white rounded-full hover:bg-cyan-800 transition-all disabled:opacity-30 shadow-2xl"
                            disabled={isTyping || isSimulating}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </form>

                    {isVerifying && (
                        <div className="mt-4 flex items-center gap-3 bg-cyan-50/80 px-6 py-2 rounded-full border border-cyan-100/50 shadow-sm animate-bounce-short">
                            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_12px_#00f2ff]" />
                            <span className="text-[11px] uppercase tracking-[0.4em] font-black text-cyan-800">Inference Verified</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
