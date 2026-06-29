"use client";

import { useEffect, useState, useMemo } from "react";
import ProfileClientUI from "@/components/profile/ProfileClientUI";
import { motion, AnimatePresence } from "framer-motion";
import GeometricAngel from "@/components/ui/GeometricAngel";
import { useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

/**
 * 高級感のあるロード画面（スケルトン）
 * インタラクティブな光の粒子が、データ受信までの「期待感」を醸成する
 */
function ProfileSkeleton() {
  const [points, setPoints] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const y = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const newPoint = { x, y, id: Date.now() };
      setPoints((prev) => [...prev.slice(-20), newPoint]);
    };
    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("touchmove", handleInteraction);
    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <AnimatePresence>
        {points.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute w-2 h-2 bg-white/20 rounded-full blur-xl pointer-events-none"
            style={{ left: p.x, top: p.y }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="flex flex-col items-center gap-12"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border border-white/5 rounded-full flex items-center justify-center"
          >
            <div className="w-full h-full border-t border-white/20 rounded-full absolute" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-4 h-4 bg-white/10 rounded-full blur-md"
            />
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-[10px] tracking-[1em] uppercase text-white/30 font-extralight ml-[1em]">
            Connecting...
          </p>
          <div className="flex justify-center gap-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -4, 0], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                className="w-[1px] h-8 bg-white"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * 公開プロフィールページ
 * データ受信後の「アンヴェイル（開示）」演出を管理
 */
export default function PublicProfileClient({ slug, initialData }: { slug: string, initialData?: any }) {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [isOpened, setIsOpened] = useState(false);
  const [showUI, setShowUI] = useState(false);

  const isOwner = useMemo(() => {
    if (typeof window !== "undefined" && window.location.search.includes("preview=visitor")) {
      return false;
    }
    return !!(session?.user?.id && data?.id && session.user.id === data.id);
  }, [session, data]);

  useEffect(() => {
    if (data) return; // Skip client-side fetch if server already provided data
    let mounted = true;
    fetch(`/api/profile/${slug}`)
      .then((res) => res.ok ? res.json() : null)
      .then((d) => {
        if (mounted) {
          if (!d || d.error) {
            setData(null);
          } else {
            setData(d);
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate([20, 30, 20]);
            }
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setData(null);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [slug, data]);

  // ビジターがプロフィールを閲覧した際、紹介者IDとしてlocalStorageに保存（購入時のトラッキング用）
  useEffect(() => {
    if (data?.id) {
      try {
        localStorage.setItem("hxc_referrer_id", data.id);
        console.log(`[Referral] Saved referrer ID: ${data.id}`);
      } catch (e) {
        console.error("Failed to save referrer ID to localStorage:", e);
      }
    }
  }, [data]);

  const handleOpen = () => {
    setIsOpened(true);
    // アンヴェイル演出（1.2秒）の後にUIを表示
    setTimeout(() => setShowUI(true), 1200);
  };

  return (
    <main className="min-h-screen bg-void relative overflow-hidden">
      {/* Owner View / Guest Preview Toggle Banner */}
      {isOwner && (
        <div className="bg-azure-950/80 border-b border-azure-500/20 text-center py-2.5 relative z-[9999] text-[10px] tracking-[0.15em] text-azure-400 backdrop-blur-sm flex justify-center items-center gap-2">
          <span>👑 あなたはオーナーとしてこのページを閲覧しています。</span>
          <a href="?preview=visitor" className="underline hover:text-white font-bold ml-1">
            ゲストとしての見え方を確認する
          </a>
        </div>
      )}
      {session?.user?.id === data?.id && typeof window !== "undefined" && window.location.search.includes("preview=visitor") && (
        <div className="bg-zinc-950/90 border-b border-white/10 text-center py-2.5 relative z-[9999] text-[10px] tracking-[0.15em] text-white/70 backdrop-blur-sm flex justify-center items-center gap-2">
          <span>👀 ゲストプレビュー表示中。</span>
          <a href="?" className="underline text-azure-400 hover:text-azure-300 font-bold ml-1">
            オーナー表示に戻す
          </a>
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 1 }}>
            <ProfileSkeleton />
          </motion.div>
        ) : !data ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center text-[10px] tracking-[0.5em] uppercase text-white/40"
          >
            Profile Not Found
          </motion.div>
        ) : !isOpened ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_70%)] cursor-pointer"
            onClick={handleOpen}
          >
            {/* Brand Top Link on Envelope Screen */}
            <div className="fixed top-6 left-6 md:top-8 md:left-8 z-[60] flex items-center gap-2.5">
              <Link 
                href="/" 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase font-bold text-white/60 hover:text-white hover:border-white/20 transition-all bg-void/60 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                ← Hexa Card
              </Link>
              <Link 
                href="/login" 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase font-bold text-azure-400/80 hover:text-azure-400 hover:border-azure-500/30 transition-all bg-void/60 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                Login
              </Link>
            </div>

            <motion.div
              animate={{ 
                y: [0, -6, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex flex-col items-center"
            >
              {/* Aura Background - Neon Azure Pulse */}
              <motion.div 
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-60px] bg-azure-500/10 blur-[80px] rounded-full pointer-events-none"
              />
              
              {/* The "Envelope" / Core with glowing border & brackets */}
              <div className="relative z-10 w-48 h-48 border border-azure-500/30 bg-azure-950/10 backdrop-blur-sm shadow-[0_0_50px_rgba(59,130,246,0.15)] flex items-center justify-center transition-all duration-500 hover:border-azure-400 group rounded-xl">
                {/* Tech corners */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-azure-400/40 rounded-tl" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-azure-400/40 rounded-tr" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-azure-400/40 rounded-bl" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-azure-400/40 rounded-br" />
                
                <div className="absolute inset-2 border border-white/5 rounded-lg" />
                
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6], scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <GeometricAngel level={20} mood="stable" size={110} />
                </motion.div>
              </div>

              {/* Tapping Guideline Section with high visibility */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-12 text-center space-y-4"
              >
                <div className="space-y-1">
                  <p className="text-[12px] tracking-[0.6em] uppercase font-bold text-azure-400 animate-pulse pl-[0.6em]">
                    TAP TO UNVEIL
                  </p>
                  <p className="text-[10px] tracking-[0.4em] uppercase text-white/80 font-medium pl-[0.4em]">
                    タップして開封する
                  </p>
                </div>
                
                <p className="text-[8px] tracking-[0.2em] uppercase text-white/30">
                  Identity Transmission Received
                </p>

                {/* Animated double chevron down */}
                <div className="flex justify-center pt-2">
                  <motion.div
                    animate={{ y: [0, 6, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-azure-400 flex flex-col items-center"
                  >
                    <ChevronDown size={18} />
                    <ChevronDown size={14} className="-mt-2.5 opacity-60" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <div key="content" className="relative">
            {/* アンヴェイル演出レイヤー */}
            {!showUI && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 10, opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeIn" }}
                >
                  <GeometricAngel level={50} mood="excited" size={240} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mt-8 text-center"
                >
                  <p className="text-[10px] tracking-[0.6em] uppercase text-white/60 font-light">
                    Unveiling
                  </p>
                  <p className="text-[12px] tracking-[0.4em] uppercase text-white mt-2 font-bold">
                    {data.name}
                  </p>
                </motion.div>

                {/* スキャンライン演出 */}
                <motion.div 
                  initial={{ top: "0%", opacity: 0 }}
                  animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[1px] bg-white/40 shadow-[0_0_20px_rgba(255,255,255,0.5)] pointer-events-none"
                />
              </motion.div>
            )}

            {/* 本体のUI */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
              animate={{ 
                opacity: showUI ? 1 : 0, 
                filter: showUI ? "blur(0px)" : "blur(20px)",
                scale: showUI ? 1 : 0.95
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <ProfileClientUI data={data} isOwner={isOwner} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
