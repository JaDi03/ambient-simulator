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

export default function UserLoopMission() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [activeCode, setActiveCode] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

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
        <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch justify-center h-full">
            {/* INSTRUCTIONS */}
            <div className={`flex flex-col w-full lg:w-[450px] shrink-0 ${PANEL_HEIGHT}`}>
                <div className="glass-card bg-white/90 p-8 rounded-[2.5rem] shadow-xl border-cyan-500/10 overflow-y-auto h-full scrollbar-hide">
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
                                    Or execute localized stress tests:
                                </p>

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
                </div>
            </div>

            {/* INTERACTION */}
            <div className={`flex flex-col w-full lg:w-[850px] shrink-0 gap-4 ${PANEL_HEIGHT}`}>
                <div className="w-full h-[220px] shrink-0">
                    <CodeSimulator
                        code={activeCode || "// Ambient Unified Simulator v3.7.0\\n// Awaiting protocol trigger from the Mission Controller..."}
                        isActive={isSimulating}
                        onComplete={handleSimulatedComplete}
                    />
                </div>

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

                    {!isVerifying && !isSimulating && (
                        <p className="mt-3 text-[11px] text-cyan-800/60 font-medium animate-in fade-in slide-in-from-top-1">
                            Press <span className="font-black text-cyan-700">Enter</span> to execute or type your own prompt.
                        </p>
                    )}

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
