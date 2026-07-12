export function getFrameStyle(frame: string | undefined) {
    switch (frame) {
      case "Silver": return "border-[2px] border-zinc-400 shadow-xl ring-1 ring-white/10";
      case "Gold": return "border-[3px] border-amber-600 shadow-2xl ring-1 ring-amber-300/10";
      case "RoseGold": return "border-[3px] border-rose-300 shadow-[0_0_30px_rgba(244,114,182,0.3)] ring-1 ring-rose-200/40";
      case "PearlWhite": return "border-[2px] border-slate-100 shadow-[0_0_20px_rgba(255,255,255,0.5)] ring-1 ring-white/60";
      case "Moonlight": return "border-[2px] border-indigo-200/50 shadow-[0_0_25px_rgba(199,210,254,0.3)] ring-1 ring-indigo-100/20";
      case "Grace": return "border-[4px] border-white/20 shadow-lg ring-1 ring-white/10 after:absolute after:inset-0 after:border after:border-white/5 after:m-1";
      case "Silk": return "border-[2px] border-slate-200/30 shadow-md ring-1 ring-white/5";
      case "Dynamic": return "border-[3px] border-azure-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]";
      case "Sakura": return "border-[2px] border-rose-400 shadow-xl ring-1 ring-rose-200/10";
      case "Emerald": return "border-[2px] border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]";
      case "Platinum": return "border-[4px] border-slate-300 shadow-2xl ring-1 ring-white/20";
      case "Crimson": return "border-[3px] border-rose-700 shadow-[0_0_30px_rgba(190,18,60,0.5)]";
      case "Obsidian": return "border-[2px] border-white/10 shadow-2xl ring-1 ring-white/5";
      case "Neon": return "border-[2px] border-azure-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] ring-1 ring-azure-300/30";
      case "Gothic": return "border-[3px] border-stone-800 shadow-2xl ring-1 ring-red-900/20";
      case "Void": return "border-[5px] border-black shadow-[0_0_50px_rgba(0,0,0,0.95),0_0_30px_rgba(168,85,247,0.3),inset_0_0_20px_rgba(0,0,0,0.9)] ring-1 ring-zinc-800/60";
      case "ImperialGold": return "border-[5px] border-transparent shadow-[0_0_40px_rgba(251,191,36,0.45),inset_0_0_15px_rgba(251,191,36,0.3)] bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 ring-2 ring-yellow-400/30";
      case "Glass": return "border-[2px] border-white/20 shadow-xl";
      case "Titanium": return "border-[3px] border-slate-500 shadow-lg";
      case "Marble": return "border-[4px] border-slate-200 shadow-2xl ring-1 ring-black/5";
      case "PrismLine": return "border-[2px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]";
      case "CarbonFiber": return "border-[2px] border-zinc-700 shadow-lg";
      case "Linen": return "border-[1px] border-stone-300 shadow-sm";
      case "Opal": return "border-[3px] border-transparent shadow-[0_0_35px_rgba(255,255,255,0.7),0_0_20px_rgba(168,85,247,0.4)] ring-1 ring-white/60 bg-gradient-to-tr from-rose-200 via-azure-200 to-emerald-100";
      case "Iron": return "border-[3px] border-zinc-600 shadow-inner";
      case "Copper": return "border-[2px] border-orange-800 shadow-xl";
      case "Velvet": return "border-[5px] border-rose-900 shadow-2xl";
      case "NebulaSteel": return "border-[3px] border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]";
      case "GildedRose": return "border-[4px] border-rose-300 shadow-[0_0_25px_rgba(244,114,182,0.3)] ring-1 ring-amber-400/20";
      default: return "border-white/10";
    }
}
