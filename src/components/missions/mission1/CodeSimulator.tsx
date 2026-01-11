'use client';

import { useState, useEffect } from 'react';

interface CodeSimulatorProps {
    code: string;
    language?: string;
    isActive: boolean;
    onComplete?: () => void;
}

export default function CodeSimulator({ code, language = 'javascript', isActive, onComplete }: CodeSimulatorProps) {
    const [displayedCode, setDisplayedCode] = useState('');
    const [index, setIndex] = useState(0);

    // Reset when code changes
    useEffect(() => {
        setDisplayedCode('');
        setIndex(0);
    }, [code]);

    useEffect(() => {
        if (!isActive) return;

        if (index < code.length) {
            const timeout = setTimeout(() => {
                setDisplayedCode((prev) => prev + code[index]);
                setIndex((prev) => prev + 1);
            }, 10); // Un poco más rápido para mejor flujo
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [code, index, isActive, onComplete]);

    return (
        <div className="w-full h-full bg-[#0d1117] rounded-2xl border border-white/5 overflow-hidden shadow-2xl flex flex-col font-mono">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[10px] text-white/30 uppercase tracking-widest ml-2 italic">Ambient Stream - {language}</span>
            </div>
            <div className="p-6 text-sm overflow-y-auto flex-1 scrollbar-hide">
                <pre className="text-cyan-400/90 leading-relaxed whitespace-pre-wrap">
                    {displayedCode}
                    {isActive && <span className="w-2 h-4 bg-cyan-400 inline-block animate-pulse ml-1" />}
                </pre>
            </div>
        </div>
    );
}
