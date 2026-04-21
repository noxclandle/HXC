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

              <div className="bg-gothic-dark border border-moonlight/20 p-8 shadow-[0_0_100px_rgba(0,0,0,1)] text-center relative overflow-hidden">
                {/* 背景ロゴ透かし */}
                <div className="absolute -right-12 -bottom-12 opacity-[0.03] rotate-12">
                   <ShieldCheck size={300} strokeWidth={0.5} />
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-moonlight/20 hover:text-moonlight transition-colors"
                >
                  <X size={20} />
                </button>

                <header className="mb-12 space-y-2">
                  <h3 className="text-xl tracking-[0.3em] uppercase font-light">{user.name}</h3>
                  <p className="text-[9px] tracking-[0.5em] opacity-30 uppercase">{user.role}</p>
                </header>

                {/* QRコード本体 */}
                <div className="bg-white p-6 inline-block mb-12 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
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
