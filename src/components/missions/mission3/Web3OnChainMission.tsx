'use client';

import M3_OnChainSimulator from './M3_OnChainSimulator';
import M3_OnChainCode from './M3_OnChainCode';

export default function Web3OnChainMission() {
    const PANEL_HEIGHT = "h-[820px]";

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch justify-center h-full">
            {/* INSTRUCTIONS */}
            <div className={`flex flex-col w-full lg:w-[450px] shrink-0 ${PANEL_HEIGHT}`}>
                <div className="glass-card bg-white/90 p-8 rounded-[2.5rem] shadow-xl border-cyan-500/10 overflow-y-auto h-full scrollbar-hide">
                    <div className="flex flex-col h-full space-y-6">
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-black uppercase tracking-widest text-black mb-2">
                                Web3 Dev Loop
                            </h2>
                            <p className="text-sm font-medium text-black/60 leading-relaxed">
                                Experiment #1: Deploy a smart contract that calls Ambient on-chain.
                            </p>
                        </div>

                        {/* Step 0: Prerequisites */}
                        <div className="glass-card bg-white/60 p-6 rounded-[2rem] border border-cyan-500/10 animate-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-sm font-black uppercase tracking-widest text-cyan-700 mb-3">
                                Step 0: Prerequisites
                            </h3>
                            <div className="space-y-3 text-sm font-medium text-black/70">
                                <div className="flex items-start gap-3">
                                    <span className="text-cyan-600 font-black">•</span>
                                    <div>
                                        <p className="font-bold text-black">Rust & Solana CLI</p>
                                        <code className="text-xs bg-cyan-50 px-2 py-1 rounded">curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh</code>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-cyan-600 font-black">•</span>
                                    <div>
                                        <p className="font-bold text-black">Anchor Framework</p>
                                        <code className="text-xs bg-cyan-50 px-2 py-1 rounded">cargo install --git https://github.com/coral-xyz/anchor avm</code>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-cyan-600 font-black">•</span>
                                    <div>
                                        <p className="font-bold text-black">AMB Tokens (Testnet)</p>
                                        <a href="https://app.ambient.xyz/drops" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline text-xs">
                                            Get free tokens from faucet →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 1: Configure Network */}
                        <div className="glass-card bg-white/60 p-6 rounded-[2rem] border border-cyan-500/10 animate-in slide-in-from-bottom-4 duration-500 delay-100">
                            <h3 className="text-sm font-black uppercase tracking-widest text-cyan-700 mb-3">
                                Step 1: Configure Ambient Testnet
                            </h3>
                            <div className="bg-zinc-900 rounded-xl p-4 overflow-x-auto">
                                <pre className="text-xs text-cyan-400 font-mono">
                                    {`# Point Solana CLI to Ambient Testnet
solana config set --url https://rpc.ambient.xyz

# Verify configuration
solana config get`}
                                </pre>
                            </div>
                        </div>

                        {/* Step 2: Wallet Setup (Pending) */}
                        <div className="glass-card bg-yellow-50/80 p-6 rounded-[2rem] border border-yellow-300 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                            <h3 className="text-sm font-black uppercase tracking-widest text-yellow-700 mb-3">
                                ⚠️ Step 2: Wallet Setup (Pending)
                            </h3>
                            <p className="text-sm font-medium text-yellow-800 leading-relaxed mb-3">
                                We're confirming with Ambient team how to export the wallet from the app.
                                For now, create a new wallet and transfer tokens:
                            </p>
                            <div className="bg-zinc-900 rounded-xl p-4 overflow-x-auto">
                                <pre className="text-xs text-cyan-400 font-mono">
                                    {`# Create new wallet
solana-keygen new --outfile ~/.config/solana/id.json

# Get your address
solana address

# Transfer AMB from app.ambient.xyz to this address`}
                                </pre>
                            </div>
                        </div>

                        {/* Step 3: View Code */}
                        <div className="glass-card bg-white/60 p-6 rounded-[2rem] border border-cyan-500/10 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                            <h3 className="text-sm font-black uppercase tracking-widest text-cyan-700 mb-3">
                                Step 3: Review Smart Contract Code →
                            </h3>
                            <p className="text-sm font-medium text-black/70 leading-relaxed">
                                Check the right panel to see the complete Rust smart contract, TypeScript tests, and configuration files.
                                The code implements the 3-stage Ambient integration workflow.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTERACTION */}
            <div className={`flex flex-col w-full lg:w-[850px] shrink-0 gap-4 ${PANEL_HEIGHT}`}>
                <div className="glass-card bg-white/95 shadow-2xl w-full border-cyan-500/10 rounded-[2.5rem] h-full overflow-hidden">
                    <M3_OnChainCode />
                </div>
            </div>
        </div>
    );
}
