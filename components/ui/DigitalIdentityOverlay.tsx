"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, X, Share2, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface DigitalCardProps {
  user: {
    name: string;
    handle: string;
    role: string;
    slug: string;
    equipped?: {
      background?: string;
      effect?: string;
      frame?: string;
      fontFamily?: string;
    }
  };
}

/**
 * 自分の情報をQRで差し出す「デジタル名刺」コンポーネント
 */
export default function DigitalIdentityOverlay({ user }: DigitalCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProfileUrl(`${window.location.origin}/p/${user.slug}`);
    }
  }, [user.slug]);

  // Styling logic mirrored from HexaCardPreview
  const bg = user.equipped?.background || "Default";
  const effect = user.equipped?.effect || "None";
  const frame = user.equipped?.frame || "Obsidian";
  
  let bgClass = "bg-[#050505]";
  if (bg === "Carbon") bgClass = "bg-[#0A0A0A] bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] bg-[size:4px_4px]";
  if (bg === "MonochromeGrid") bgClass = "bg-[#050505] bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px]";
  if (bg === "BrushedMetal") bgClass = "bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#111]";
  if (bg === "SilkBlur") bgClass = "bg-black before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:blur-[60px] before:opacity-50 before:pointer-events-none";
  if (bg === "Nebula") bgClass = "bg-[#050505] bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(30,58,138,0.15),transparent_40%)]";
  if (bg === "CrimsonVelvet") bgClass = "bg-[#1a0505] bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] before:mix-blend-overlay before:pointer-events-none";
  if (bg === "IceGlass") bgClass = "bg-[#0a0f15] before:absolute before:inset-0 before:backdrop-blur-[20px] before:bg-white/[0.02] before:border before:border-white/10 before:pointer-events-none";
  if (bg === "Stardust") bgClass = "bg-[#050508] bg-[radial-gradient(white_0.5px,transparent_0.5px)] bg-[size:20px_20px] opacity-90";
  if (bg === "RoyalGold") bgClass = "bg-[#0f0a05] bg-[radial-gradient(circle_at_50%_50%,rgba(180,139,94,0.15),transparent_70%)] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPgo8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjYmI5OTVlIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] before:pointer-events-none";
  if (bg === "MidnightMist") bgClass = "bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] before:absolute before:inset-0 before:bg-white/[0.02] before:blur-xl before:pointer-events-none";
  if (bg === "DigitalFlow") bgClass = "bg-[#020202] bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100%_4px]";
  if (bg === "PrismFractal") bgClass = "bg-[#050505] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-rose-500/5 before:via-azure-500/5 before:to-emerald-500/5 before:pointer-events-none";

  let frameClass = "border-moonlight/20";
  if (frame === "Gold") frameClass = "border-bronze-400/40";
  if (frame === "Dynamic") frameClass = "border-azure-500/40";
  if (frame === "Platinum") frameClass = "border-[3px] border-slate-500 ring-1 ring-white/20 ring-inset";
  if (frame === "ImperialGold") frameClass = "border-[4px] border-amber-500/80 ring-2 ring-amber-300/30 ring-inset";

  return (
    <>
      {/* 呼び出しボタン（ダッシュボード等に配置） */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-6 py-3 border border-moonlight/10 bg-gothic-dark/40 hover:bg-white/5 transition-all group"
      >
        <QrCode size={18} className="opacity-40 group-hover:opacity-100 group-hover:text-emerald-400 transition-all" />
        <span className="text-[10px] tracking-[0.4em] uppercase opacity-60 group-hover:opacity-100">Digital Identity</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-void/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm relative"
            >
              {/* 装飾的な外枠 */}
              <div className="absolute -inset-4 border border-moonlight/5 pointer-events-none" />
              <div className="absolute -inset-1 border border-moonlight/10 pointer-events-none" />

              <div className={`p-8 shadow-[0_0_100px_rgba(0,0,0,1)] text-center relative overflow-hidden border ${bgClass} ${frameClass}`}>
                
                {/* Effects Layer */}
                {effect === "Aethereal" && (
                  <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwaDF2MUgwem0yIDyaDF2MUgyeiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjUiLz4KPC9zdmc+')] animate-[shimmer_5s_linear_infinite]" />
                )}
                {effect === "Glitch" && (
                  <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-pulse opacity-70" />
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_50%)] bg-[size:100%_2px] opacity-40 pointer-events-none" />
                     <div className="absolute inset-x-0 h-[1px] bg-white/30 animate-[scan_3s_linear_infinite]" />
                  </div>
                )}
                {effect === "Interference" && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 border-[2px] border-white/20 rounded-full scale-0 opacity-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <div className="absolute inset-0 border-[1px] border-white/10 rounded-full scale-0 opacity-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/[0.03] to-transparent animate-pulse" />
                  </div>
                )}
                {effect === "Petals" && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                     {[...Array(4)].map((_, i) => (
                       <div key={i} className={`absolute w-1 h-1 bg-white/40 rounded-full animate-float-${i+1}`} style={{ left: `${Math.random() * 100}%`, animationDuration: `${3 + Math.random() * 4}s`, animationDelay: `${Math.random() * 2}s` }} />
                     ))}
                  </div>
                )}

                {/* 背景ロゴ透かし */}
                <div className="absolute -right-12 -bottom-12 opacity-[0.03] rotate-12 pointer-events-none">
                   <ShieldCheck size={300} strokeWidth={0.5} />
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-moonlight/20 hover:text-moonlight transition-colors relative z-10"
                >
                  <X size={20} />
                </button>

                <header className="mb-12 space-y-2 relative z-10">
                  <h3 className="text-xl tracking-[0.3em] uppercase font-light">{user.name}</h3>
                  {user.role && <p className="text-[10px] tracking-[0.5em] opacity-40 uppercase">{user.role}</p>}
                </header>

                {/* QRコード本体 */}
                <div className="bg-white p-6 inline-block mb-12 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative z-10">
                  <QRCodeSVG 
                    value={profileUrl} 
                    size={200} 
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: "/logo.png",
                      x: undefined,
                      y: undefined,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />
                </div>

                <div className="space-y-6">
                  <p className="text-[8px] tracking-[0.3em] opacity-30 uppercase leading-relaxed">
                    相手の標準カメラで読み取らせることで、<br />
                    あなたの聖域（プロフィール）へ招待します。
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => navigator.clipboard.writeText(profileUrl)}
                      className="flex items-center gap-2 px-6 py-2 border border-moonlight/10 text-[8px] uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                      <Share2 size={12} />
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
