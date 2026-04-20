"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Filter, ZoomIn, Activity, Download } from "lucide-react";

export default function ResonanceGraphPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [timeStep, setTimeStep] = useState(100);
  const [scale, setScale] = useState(1);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    async function loadGraphData() {
      try {
        const res = await fetch("/api/admin/graph/data");
        const data = await res.json();
        const initialNodes = data.nodes.map((n: any) => ({
          ...n,
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 400,
          vx: 0, vy: 0,
          connections: data.links.filter((l: any) => l.source === n.id).map((l: any) => l.target),
          tags: n.tags || []
        }));
        setNodes(initialNodes);
      } catch (err) {
        console.warn("Graph data failed, using fallback.");
        setNodes([
          { id: "Nox", connections: ["Sera", "Kenta"], rank: "Architect", photo: "/logo.png", x: 0, y: 0, vx: 0, vy: 0, tags: ["Technical"] },
          { id: "Sera", connections: ["Nox"], rank: "Black Tier", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", x: 100, y: 100, vx: 0, vy: 0, tags: ["High-Value"] },
          { id: "Kenta", connections: ["Nox"], rank: "Initiate", photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80", x: -100, y: 100, vx: 0, vy: 0, tags: ["Technical", "Sales"] },
        ]);
      }
    }
    loadGraphData();

    const interval = setInterval(() => {
      setNodes(prev => {
        const next = prev.map(n => ({ ...n }));
        for (let i = 0; i < next.length; i++) {
          const n1 = next[i];
          n1.vx -= n1.x * 0.01;
          n1.vy -= n1.y * 0.01;
          for (let j = i + 1; j < next.length; j++) {
            const n2 = next[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 1200 / (dist * dist);
            n1.vx -= (dx / dist) * force;
            n1.vy -= (dy / dist) * force;
            n2.vx += (dx / dist) * force;
            n2.vy += (dy / dist) * force;
            if (n1.connections.includes(n2.id) || n2.connections.includes(n1.id)) {
              const pull = dist * 0.02;
              n1.vx += (dx / dist) * pull;
              n1.vy += (dy / dist) * pull;
              n2.vx -= (dx / dist) * pull;
              n2.vy -= (dy / dist) * pull;
            }
            // 4. 組織内階層（ピラミッド構造）の引力
            const sharedTags = n1.tags.filter((t: string) => n2.tags.includes(t));
            if (sharedTags.length > 0) {
              const clusterPull = dist * 0.015;
              n1.vx += (dx / dist) * clusterPull;
              n1.vy += (dy / dist) * clusterPull;
              n2.vx -= (dx / dist) * clusterPull;
              n2.vy -= (dy / dist) * clusterPull;

              // 役職ランクによる上下の引き（ツリー化）
              const getRankY = (rank: string) => {
                if (/社長|代表|CEO|Founder/i.test(rank)) return -150;
                if (/役員|Director|VP/i.test(rank)) return -50;
                if (/部長|Manager/i.test(rank)) return 50;
                return 150;
              };
              const targetY1 = getRankY(n1.rank || "");
              const targetY2 = getRankY(n2.rank || "");
              n1.vy += (targetY1 - n1.y) * 0.02;
              n2.vy += (targetY2 - n2.y) * 0.02;
            }
          }
          n1.vx *= 0.9;
          n1.vy *= 0.9;
          n1.x += n1.vx;
          n1.y += n1.vy;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const filteredNodes = nodes.filter(n => !filterTag || n.tags.includes(filterTag));

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 border-b border-moonlight/10 pb-8 flex flex-col gap-8">
        <div className="flex justify-between items-end w-full">
          <div>
            <h1 className="text-xl tracking-[0.6em] uppercase flex items-center gap-4">
              <Share2 className="text-moonlight animate-pulse" size={20} />
              Visual Network
            </h1>
            <p className="text-[10px] tracking-widest opacity-40 uppercase mt-2">人脈ネットワークの可視化：会社や役職の繋がりを俯瞰します</p>
          </div>
          <div className="flex items-center gap-12">
             <button onClick={() => alert("Generating high-res map...")} className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity"><Download size={14} /> Export Map</button>
             <div className="flex flex-col items-end gap-2">
               <span className="text-[8px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2"><ZoomIn size={10}/> Magnification</span>
               <input type="range" min="0.5" max="3" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-32 accent-moonlight h-1 bg-moonlight/10 appearance-none cursor-pointer" />
             </div>
             <div className="flex flex-col items-end gap-2">
               <span className="text-[8px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2"><Activity size={10}/> History</span>
               <input type="range" min="0" max="100" value={timeStep} onChange={(e) => setTimeStep(parseInt(e.target.value))} className="w-32 accent-moonlight h-1 bg-moonlight/10 appearance-none cursor-pointer" />
             </div>
          </div>
        </div>
        <div className="flex gap-6 items-center">
           <span className="text-[8px] uppercase tracking-[0.4em] opacity-30 flex items-center gap-2"><Filter size={10}/> Essence Filter:</span>
           <div className="flex gap-2">
             {["Technical", "High-Value", "Sales"].map(tag => (
               <button key={tag} onClick={() => setFilterTag(filterTag === tag ? null : tag)} className={`px-4 py-1.5 border text-[8px] uppercase tracking-widest transition-all ${filterTag === tag ? 'border-moonlight bg-white/5' : 'border-moonlight/5 opacity-40 hover:opacity-100'}`}>{tag}</button>
             ))}
           </div>
        </div>
      </header>

      <div className="relative h-[600px] border border-moonlight/5 bg-gothic-dark/5 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          <g transform={`translate(${typeof window !== 'undefined' ? 600 : 0}, 300) scale(${scale * (focusedId ? 1.5 : 1)})`}>
            {filteredNodes.map((n1) => 
              n1.connections.map((targetId: string) => {
                const n2 = nodes.find(n => n.id === targetId);
                if (!n2) return null;
                const lineColor = n1.tags.includes("High-Value") ? "rgba(255, 215, 0, 0.2)" : "rgba(224, 224, 224, 0.1)";
                return (
                  <motion.line key={`${n1.id}-${targetId}`} animate={{ x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y }} transition={{ duration: 0.03, ease: "linear" }} stroke={lineColor} strokeWidth={n1.tags.includes("High-Value") ? "1" : "0.5"} />
                );
              })
            )}
          </g>
        </svg>

        <motion.div drag dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }} animate={{ scale: scale * (focusedId ? 1.5 : 1) }} transition={{ duration: 1, ease: "circOut" }} className="relative" style={{ opacity: timeStep / 100 }}>
           <motion.div animate={{ opacity: focusedId ? 0.2 : 1 }} className="w-24 h-24 border border-moonlight flex items-center justify-center relative z-10 bg-void">
             <div className="absolute -inset-8 bg-moonlight/5 blur-2xl animate-pulse rounded-full" />
             <span className="text-[10px] tracking-widest uppercase font-bold">Chief</span>
           </motion.div>
           
           <motion.div animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

           {/* Cluster Labels */}
           {["Technical", "High-Value", "Sales"].map((tag) => {
             const clusterNodes = nodes.filter(n => n.tags.includes(tag));
             if (clusterNodes.length < 2) return null;
             const avgX = clusterNodes.reduce((acc, n) => acc + n.x, 0) / clusterNodes.length;
             const avgY = clusterNodes.reduce((acc, n) => acc + n.y, 0) / clusterNodes.length;
             return (
               <motion.div key={`label-${tag}`} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity }} className="absolute pointer-events-none border-l border-moonlight/20 pl-4" style={{ top: avgY - 80, left: avgX }}>
                 <span className="text-[10px] tracking-[0.6em] uppercase text-moonlight font-bold">{tag} Sector</span>
               </motion.div>
             );
           })}

           {filteredNodes.map((node) => {
             const isFocused = focusedId === node.id;
             return (
               <motion.div key={node.id} animate={{ scale: isFocused ? 1.2 : 1, opacity: focusedId && !isFocused ? 0.1 : 1 }} className="absolute cursor-pointer group" style={{ top: node.y, left: node.x, transform: 'translate(-50%, -50%)' }} onClick={() => setFocusedId(isFocused ? null : node.id)}>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-16 h-16 border border-moonlight/20 overflow-hidden flex flex-col items-center justify-center bg-gothic-dark group-hover:border-moonlight transition-all shadow-xl relative">
                     <img src={node.photo} alt={node.id} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute inset-0 bg-void/40 group-hover:opacity-0 transition-opacity" />
                     <span className="relative z-10 text-[6px] opacity-80 mb-1 drop-shadow-md">{node.rank}</span>
                     <span className="relative z-10 text-[8px] uppercase tracking-tighter drop-shadow-md font-bold">{node.id}</span>
                   </div>
                   <div className="w-px h-12 bg-gradient-to-t from-moonlight/20 to-transparent group-hover:from-moonlight/60 transition-all" />
                </div>
               </motion.div>
             );
           })}
        </motion.div>
      </div>
    </div>
  );
}
