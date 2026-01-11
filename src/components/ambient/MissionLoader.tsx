export default function MissionLoader() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch justify-center h-full">
            {/* INSTRUCTIONS LOADER */}
            <div className="flex flex-col w-full lg:w-[450px] shrink-0 h-[820px]">
                <div className="glass-card bg-white/90 p-8 rounded-[2.5rem] shadow-xl border-cyan-500/10 h-full flex flex-col">
                    <div className="animate-pulse flex flex-col gap-4">
                        <div className="h-3 w-24 bg-cyan-900/5 rounded"></div>
                        <div className="h-8 w-48 bg-cyan-900/5 rounded"></div>
                    </div>

                    <div className="mt-8 space-y-6 flex-grow animate-pulse">
                        <div className="h-40 bg-zinc-100/50 rounded-2xl border border-zinc-200/50"></div>
                        <div className="h-24 bg-zinc-100/50 rounded-2xl border border-zinc-200/50"></div>
                        <div className="h-24 bg-zinc-100/50 rounded-2xl border border-zinc-200/50"></div>
                    </div>
                </div>
            </div>

            {/* INTERACTION LOADER */}
            <div className="flex flex-col w-full lg:w-[850px] shrink-0 h-[820px] gap-4">
                {/* Top Panel (Simulator/Code) */}
                <div className="w-full h-[220px] shrink-0 bg-[#0d1117] rounded-2xl border border-white/5 shadow-2xl opacity-50"></div>

                {/* Main Chat/Interaction Panel */}
                <div className="glass-card bg-white/40 p-8 flex flex-col items-center shadow-2xl w-full border-cyan-500/10 rounded-[2.5rem] flex-grow">
                    <div className="w-full flex-grow flex flex-col justify-end pb-8 gap-4 animate-pulse">
                        <div className="self-start w-2/3 h-16 bg-white/50 rounded-[1.8rem] rounded-tl-none"></div>
                        <div className="self-end w-2/3 h-16 bg-cyan-100/30 rounded-[1.8rem] rounded-tr-none"></div>
                    </div>
                    <div className="w-full h-16 bg-cyan-50/30 rounded-full border border-cyan-100/20"></div>
                </div>
            </div>
        </div>
    );
}
