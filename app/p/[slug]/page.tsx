"use client";

import { useEffect, useState, useMemo } from "react";
import ProfileClientUI from "@/components/profile/ProfileClientUI";
import { motion, AnimatePresence } from "framer-motion";
import GeometricAngel from "@/components/ui/GeometricAngel";

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
            Syncing Identity
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
export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/profile/${params.slug}`)
      .then((res) => res.json())
      .then((d) => {
        if (mounted) {
          setData(d);
          // データ取得後、少し間を置いて演出を開始
          setTimeout(() => {
            setLoading(false);
            // アンヴェイル演出（2秒程度）の後にUIを完全表示
            setTimeout(() => setShowUI(true), 2500);
          }, 800);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [params.slug]);

  return (
    <main className="min-h-screen bg-void relative overflow-hidden">
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
            Identity Dissolved
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
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <GeometricAngel level={5} mood="excited" size={240} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="mt-8 text-center"
                >
                  <p className="text-[10px] tracking-[0.6em] uppercase text-white/60 font-light">
                    Resonance Established
                  </p>
                  <p className="text-[12px] tracking-[0.4em] uppercase text-white mt-2 font-bold">
                    {data.name}
                  </p>
                </motion.div>

                {/* スキャンライン演出 */}
                <motion.div 
                  initial={{ top: "0%", opacity: 0 }}
                  animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[1px] bg-white/40 shadow-[0_0_20px_rgba(255,255,255,0.5)] pointer-events-none"
                />
              </motion.div>
            )}

            {/* 本体のUI */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ 
                opacity: showUI ? 1 : 0, 
                filter: showUI ? "blur(0px)" : "blur(10px)" 
              }}
              transition={{ duration: 1.5 }}
            >
              <ProfileClientUI data={data} isOwner={false} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
