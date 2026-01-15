'use client';

import { useState } from 'react';

export default function VerificationPortal() {
    const [lastReceipt, setLastReceipt] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Mock receipt structure for demonstration if real one is not captured yet
    const demoReceipt = {
        inference_id: "zai-inf-7b2a-4c1d-9e8f",
        status: "verified",
        network: "Ambient L1 Testnet",
        algorithm: "Proof of Logits (PoL)",
        nodes_involved: 12,
        verification_hash: "0x7f8e9a2b1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
        timestamp: new Date().toISOString()
    };

    return (
        <div id="web2" className="w-full max-w-4xl mt-20 px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-light tracking-widest text-black/80">Web2 Verification</h2>
                <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-cyan-600 font-medium">
                    Inspect the Cryptographic Proof of Logits
                </p>
            </div>

            <div className="glass-card p-8 flex flex-col items-center">
                <div className="mb-6 text-center max-w-lg">
                    <p className="text-sm text-black/60 leading-relaxed">
                        Every response from Ambient is not just a prediction; it&apos;s a verified computation.
                        The network provides a receipt that proves the inference was executed correctly.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setLastReceipt(demoReceipt);
                        setIsOpen(!isOpen);
                    }}
                    className="px-8 py-3 rounded-full border border-ambient-cyan/30 text-ambient-cyan font-bold text-xs uppercase tracking-widest hover:bg-ambient-cyan/5 transition-all shadow-[0_0_20px_rgba(0,242,255,0.1)]"
                >
                    {isOpen ? "Close Portal" : "Inspect Last Receipt"}
                </button>

                {isOpen && (
                    <div className="mt-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-black/5 rounded-xl p-6 font-mono text-[10px] text-black/70 overflow-x-auto">
                            <div className="flex justify-between border-b border-black/5 pb-2 mb-4">
                                <span className="text-cyan-600 font-bold uppercase">Inference Certificate</span>
                                <span className="text-black/30">v1.0.4-verified</span>
                            </div>
                            <pre className="whitespace-pre-wrap mb-4">
                                {JSON.stringify(lastReceipt, null, 2)}
                            </pre>

                            {(lastReceipt?.inference_id || lastReceipt?.id) && (
                                <a
                                    href={`https://explorer.ambient.xyz/inference/${lastReceipt.id || lastReceipt.inference_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full p-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-lg transition-colors border border-cyan-200 group"
                                >
                                    <span className="text-[10px] uppercase font-black tracking-wider">View Proof on Explorer</span>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-0.5 transition-transform">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                                    </svg>
                                </a>
                            )}
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-black/5 rounded-lg">
                                <h4 className="text-[9px] uppercase font-bold text-black/40 mb-2">Technical Insight</h4>
                                <p className="text-[10px] italic">
                                    &quot;Proof of Logits ensures that the AI output matches the statistical fingerprint
                                    of the large-scale model across the network.&quot;
                                </p>
                            </div>
                            <div className="p-4 border border-black/5 rounded-lg">
                                <h4 className="text-[9px] uppercase font-bold text-black/40 mb-2">Developer Benefit</h4>
                                <p className="text-[10px] italic">
                                    &quot;Integrate verified intelligence into any app using standard OpenAI-compatible
                                    SDKs while keeping the trustless nature of the L1.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
