export default function MissionLoader() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch justify-center h-full animate-pulse">
            {/* INSTRUCTIONS LOADER */}
            <div className="flex flex-col w-full lg:w-[450px] shrink-0 h-[820px]">
                <div className="glass-card bg-white/40 p-8 rounded-[2.5rem] shadow-xl border-cyan-500/10 h-full">
                    <div className="h-4 w-24 bg-cyan-900/10 rounded mb-6"></div>
                    <div className="h-10 w-48 bg-cyan-900/10 rounded mb-8"></div>
                    <div className="space-y-6">
                        <div className="h-32 bg-white/50 rounded-2xl"></div>
                        <div className="h-20 bg-white/50 rounded-2xl"></div>
                    </div>
                </div>
            </div>

            {/* INTERACTION LOADER */}
            <div className="flex flex-col w-full lg:w-[850px] shrink-0 h-[820px] gap-4">
                <div className="glass-card bg-white/40 shadow-2xl w-full border-cyan-500/10 rounded-[2.5rem] h-full"></div>
            </div>
        </div>
    );
}
