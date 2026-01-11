import Chat from "@/components/ambient/Chat";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-black font-sans selection:bg-cyan-100 overflow-x-hidden">
      {/* Visual Effect: Ambient Nebula */}
      <div className="ambient-nebula" />

      {/* Navigation (Transparent - Only Logo) */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-10 py-8 pointer-events-none">
        <div className="text-2xl font-black tracking-tighter pointer-events-auto">Ambient</div>
      </nav>

      <main className="relative z-10 flex min-h-screen items-center justify-center py-10">
        {/* The Simulator / Chat Container - Extended for Triple Modeling area */}
        <div className="w-full max-w-[1850px] px-8">
          <Chat />
        </div>
      </main>

      {/* Ambient Status Bar */}
      <div className="fixed bottom-0 w-full px-10 py-6 border-t border-black/5 bg-white/50 backdrop-blur-md flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f2ff]" />
          <span className="text-[10px] uppercase tracking-widest font-black opacity-40">L1 Node: Active</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest font-black opacity-40">Ambient Testnet Environment v1.02</span>
      </div>
    </div>
  );
}
