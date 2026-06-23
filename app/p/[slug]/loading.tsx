import { Hexagon } from "lucide-react";

export default function ProfileLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-void text-moonlight select-none font-sans">
      <div className="max-w-md w-full flex flex-col items-center justify-center space-y-8 py-12">
        
        {/* Animated Hexagon Outer Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border border-azure-500/20 rounded-full animate-ping pointer-events-none" />
          <div className="w-12 h-12 border border-azure-500/30 bg-azure-500/5 flex items-center justify-center rotate-45">
            <Hexagon size={20} className="text-azure-400 -rotate-45 animate-pulse" />
          </div>
        </div>

        {/* Minimal Occult Texts */}
        <div className="text-center space-y-2">
          <h3 className="text-[10px] tracking-[0.5em] font-bold text-white uppercase opacity-85 animate-pulse">
            Synchronizing Resonance
          </h3>
          <p className="text-[8px] tracking-[0.4em] uppercase text-white/30 font-light">
            境界を観測しています...
          </p>
        </div>
      </div>
    </main>
  );
}
