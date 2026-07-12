export function getBackgroundStyle(background: string | undefined) {
    const bg = background || "Default";
    switch (bg) {
      case "PastelSakura": return "bg-[#fff5f5] bg-[radial-gradient(circle_at_50%_50%,rgba(255,192,203,0.2),transparent_100%)]";
      case "PearlVeil": return "bg-white/5 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(240,249,255,0.1)_50%,rgba(255,255,255,0.1)_100%)]";
      case "SilkSheet": return "bg-slate-900 before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/silk.png')] before:opacity-10";
      case "GraceGradient": return "bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-rose-900/40";
      case "CrystalGlass": return "bg-white/15 border border-white/10";
      case "Carbon": return "bg-[#0A0A0A] bg-[radial-gradient(#222_1px,transparent_1px)] bg-[size:6px_6px]";
      case "BrushedMetal": return "bg-zinc-700 bg-[linear-gradient(105deg,#18181b_0%,#71717a_25%,#27272a_50%,#a1a1aa_75%,#18181b_100%)] opacity-90";
      case "MonochromeGrid": return "bg-[#050505] bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:20px_20px]";
      case "Stardust": return "bg-[#050508] bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:32px_32px] opacity-100";
      case "RoyalGold": return "bg-[#1a1408] bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.2),transparent_80%)]";
      case "Nebula": return "bg-[#050510] bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.3),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.3),transparent_60%)]";
      case "SilkBlur": return "bg-black before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-white/5 before:blur-[60px]";
      case "DigitalFlow": return "bg-[#010101] bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:100%_4px] opacity-100";
      case "PrismFractal": return "bg-[#04010a] bg-[linear-gradient(135deg,rgba(244,63,94,0.15)_0%,rgba(59,130,246,0.15)_50%,rgba(168,85,247,0.15)_100%)] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] before:bg-[size:30px_30px] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent)] animate-pulse";
      case "InkWash": return "bg-[#f5f5f5] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1),transparent)] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]";
      case "SandDune": return "bg-[#d2b48c] bg-[linear-gradient(135deg,#c19a6b_25%,transparent_25%),linear-gradient(225deg,#c19a6b_25%,transparent_25%)] bg-[size:50px_50px]";
      case "DeepOcean": return "bg-[#000033] bg-[radial-gradient(circle_at_center,rgba(0,102,204,0.2),transparent)]";
      case "Paper": return "bg-[#fdfcf0] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]";
      case "NightCity": return "bg-[#050505] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)] after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_90%,rgba(59,130,246,0.1))]";
      case "Slate": return "bg-zinc-800 before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]";
      case "CosmicVoid": return "bg-black before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04)_0%,transparent_80%)] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.01)_0%,transparent_50%)] animate-[pulse_10s_infinite]";
      case "Circuit": return "bg-[#020202] bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent)]";
      case "MorningMist": return "bg-[#e6e6e6] bg-gradient-to-b from-white/20 to-transparent";
      case "RoseQuartzBG": return "bg-[#fff0f5] bg-[radial-gradient(circle_at_50%_50%,rgba(255,182,193,0.3),transparent)]";
      case "GoldenHour": return "bg-gradient-to-tr from-[#1a1408] via-[#2d220d] to-[#120e06] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_30%,rgba(217,119,6,0.15),transparent)] before:opacity-80";
      case "MonochromeCyber": return "bg-[#080808] bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:16px_16px] before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent";
      default: return "bg-black";
    }
}
