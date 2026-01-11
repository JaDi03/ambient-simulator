'use client';

import { useState } from 'react';
import M2_ApiSimulator from './M2_ApiSimulator';

export default function Web2ApiMission() {
    const [copied, setCopied] = useState(false);
    const PANEL_HEIGHT = "h-[820px]";

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch justify-center h-full">
            {/* INSTRUCTIONS */}
            <div className={`flex flex-col w-full lg:w-[450px] shrink-0 ${PANEL_HEIGHT}`}>
                <div className="glass-card bg-white/90 p-8 rounded-[2.5rem] shadow-xl border-cyan-500/10 overflow-y-auto h-full scrollbar-hide">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-[10px] uppercase tracking-[0.4em] font-black text-cyan-600 mb-3 text-left">Developer Mission</div>
                        <h2 className="text-3xl font-extralight mb-2 leading-tight tracking-tight text-left uppercase">Web2 Dev Loop:</h2>
                        <h3 className="text-xl font-black text-black/40 mb-6 tracking-tighter uppercase italic leading-none text-left">Micro-Challenge #1</h3>

                        <div className="space-y-6 text-left">
                            <div className="bg-white border-2 border-cyan-100 rounded-[2rem] p-6 shadow-sm">
                                <h4 className="text-[13px] font-black text-black uppercase tracking-tight mb-3">Step 0: Get API Key</h4>
                                <p className="text-[12px] text-black/60 font-medium mb-3">
                                    Sign in to the Ambient Dashboard and generate your API Key.
                                </p>
                                <a href="https://app.ambient.xyz/keys" target="_blank" className="flex items-center justify-center gap-2 w-full p-3 bg-black text-white rounded-xl hover:bg-zinc-800 transition-all text-[11px] font-black uppercase tracking-widest">
                                    Get Key at app.ambient.xyz
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
                                </a>
                            </div>

                            <div className="bg-white border-2 border-cyan-100 rounded-[2rem] p-6 shadow-sm">
                                <h4 className="text-[13px] font-black text-black uppercase tracking-tight mb-3">Step 1: Generate IV (Optional)</h4>
                                <p className="text-[12px] text-black/60 font-medium mb-3">
                                    For encryption, generate a 12-byte hex IV using CMD:
                                </p>
                                <div className="relative group/code">
                                    <div className="bg-zinc-900 rounded-xl p-3 font-mono text-[10px] text-cyan-400 break-all pr-10">
                                        {`powershell -Command "$bytes = New-Object Byte[] 12; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); -join ($bytes | ForEach-Object { $_.ToString('x2') })"`}
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`powershell -Command "$bytes = New-Object Byte[] 12; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); -join ($bytes | ForEach-Object { $_.ToString('x2') })"`);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all opacity-40 group-hover/code:opacity-100"
                                    >
                                        {copied ? (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-[2rem] p-6">
                                <h4 className="text-[13px] font-black text-cyan-800 uppercase tracking-tight mb-2">Step 2: Use the Simulator →</h4>
                                <p className="text-[11px] text-cyan-700 font-bold">
                                    Enter your API Key in the simulator on the right, configure the request, and click Execute to get your merkle_root proof.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTERACTION */}
            <div className={`flex flex-col w-full lg:w-[850px] shrink-0 gap-4 ${PANEL_HEIGHT}`}>
                <div className="glass-card bg-white/95 shadow-2xl w-full border-cyan-500/10 rounded-[2.5rem] h-full overflow-hidden">
                    <M2_ApiSimulator />
                </div>
            </div>
        </div>
    );
}
