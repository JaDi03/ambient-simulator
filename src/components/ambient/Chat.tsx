'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

const UserLoopMission = dynamic(() => import('@/components/missions/mission1/UserLoopMission'), { ssr: false });
const Web2ApiMission = dynamic(() => import('@/components/missions/mission2/Web2ApiMission'), { ssr: false });
const Web3OnChainMission = dynamic(() => import('@/components/missions/mission3/Web3OnChainMission'), { ssr: false });

export default function Chat() {
    const [activeTab, setActiveTab] = useState(1);
    const PANEL_HEIGHT = "h-[820px]";

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch justify-center max-h-[92vh]">

            {/* COLUMN 1: Global Navigation (Always Visible) */}
            <div className={`flex flex-col w-full lg:w-[450px] shrink-0 gap-6 ${PANEL_HEIGHT}`}>
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

                <div className="glass-card bg-white/95 p-8 rounded-[2.5rem] shadow-xl border-cyan-500/10 flex-grow overflow-hidden">
                    <div className="text-[10px] uppercase tracking-[0.4em] font-black text-cyan-600 mb-6 text-left">Navigation Hub</div>
                    <div className="flex flex-col gap-4">
                        {[
                            { id: 1, title: 'Loop 1', tag: 'User Loop' },
                            { id: 2, title: 'Loop 2', tag: 'Web2 Dev' },
                            { id: 3, title: 'Loop 3', tag: 'Web3 Dev' }
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

            {/* COLUMN 2 & 3: Mission Modules (Rendered dynamically) */}
            <div className="contents">
                {activeTab === 1 && <UserLoopMission />}
                {activeTab === 2 && <Web2ApiMission />}
                {activeTab === 3 && <Web3OnChainMission />}
            </div>
        </div>
    );
}
