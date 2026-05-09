"use client";

import { getPublicProfile } from "@/lib/user";
import ProfileClientUI from "@/components/profile/ProfileClientUI";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 注意: generateMetadata は Server Component でのみ動作するため、
// クライアントコンポーネント化したこのファイルからは分離するか、
// メタデータ専用のレイアウトを検討する必要があります。
// ここではビルドを通すため、一旦クライアント側で完結させます。

function ProfileSkeleton() {
  const [points, setPoints] = useState<{x: number, y: number, id: number}[]>([]);

  const handleInteraction = (e: any) => {
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newPoint = { x, y, id: Date.now() };
    setPoints(prev => [...prev.slice(-15), newPoint]);
  };

  return (
    <div 
      className="min-h-screen bg-void flex flex-col items-center justify-center p-6 overflow-hidden relative"
      onMouseMove={handleInteraction}
      onTouchMove={handleInteraction}
    >
       <AnimatePresence>
          {points.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0.5, scale: 0 }}
              animate={{ opacity: 0, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute w-4 h-4 bg-azure-500/20 rounded-full blur-xl pointer-events-none"
              style={{ left: p.x - 8, top: p.y - 8 }}
            />
          ))}
       </AnimatePresence>

       <motion.div 
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
         className="w-full max-w-md aspect-[1.58/1] border border-white/5 bg-white/[0.01] rounded-sm relative overflow-hidden flex items-center justify-center"
       >
          <motion.div 
            animate={{ x: ["-100%", "200%"] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" 
          />
          <div className="w-12 h-12 border border-white/5 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-white/10 rounded-full animate-pulse" />
          </div>
       </motion.div>

       <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex gap-2">
             {[...Array(3)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  className="w-1.5 h-1.5 bg-azure-400/40 rounded-full blur-[1px]"
                />
             ))}
          </div>
          <div className="text-center space-y-2">
            <p className="text-[10px] tracking-[0.8em] uppercase text-white/20 font-bold ml-[0.8em]">
               Synchronizing Identity
            </p>
            <p className="text-[7px] tracking-[0.3em] uppercase text-azure-400/40 font-bold">
               境界を透過中... 画面をなぞって同調してください
            </p>
          </div>
       </div>
    </div>
  );
}

// 簡易化のためレイアウト側でデータを流し込む構成に変更
export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch(`/api/profile/${params.slug}`).then(res => res.json()).then(d => {
      setData(data);
      setLoading(false);
    });
  });

  if (loading) return <ProfileSkeleton />;
  if (!data) return <div className="min-h-screen bg-void flex items-center justify-center text-white">Identity Dissolved</div>;

  return <ProfileClientUI data={data} isOwner={false} />;
}
