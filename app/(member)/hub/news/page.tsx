"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, ArrowLeft, BookOpen, Newspaper } from "lucide-react";
import Link from "next/link";

export default function HubNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        if (res.ok) setNews(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchNews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-16">
        <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
        </Link>
        <h1 className="text-5xl tracking-[0.5em] uppercase font-extralight text-white">Broadcast</h1>
        <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-white">プロトコル更新・お知らせ</p>
      </header>

      {loading ? (
        <div className="py-24 text-center text-[10px] opacity-10 uppercase tracking-[1em]">Receiving Data...</div>
      ) : (
        <div className="space-y-8">
           {news.map((item, i) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="p-10 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all relative overflow-hidden group"
             >
                <div className={`absolute top-0 left-0 w-1 h-full ${item.type === 'update' ? 'bg-azure-500/40' : item.type === 'maintenance' ? 'bg-rose-500/40' : 'bg-emerald-500/40'}`} />
                
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                      <span className={`text-[7px] px-2 py-0.5 border uppercase tracking-widest font-bold ${item.type === 'update' ? 'border-azure-500/30 text-azure-400' : item.type === 'maintenance' ? 'border-rose-500/30 text-rose-400' : 'border-emerald-500/30 text-emerald-400'}`}>
                         {item.type}
                      </span>
                      <h3 className="text-lg tracking-widest uppercase font-light text-white">{item.title}</h3>
                   </div>
                   <div className="flex items-center gap-2 text-[8px] opacity-20 uppercase tracking-widest font-bold">
                      <Clock size={10} /> {new Date(item.created_at).toLocaleDateString()}
                   </div>
                </div>

                <p className="text-[12px] tracking-widest opacity-60 leading-relaxed font-sans whitespace-pre-wrap">
                   {item.content}
                </p>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-end opacity-10 group-hover:opacity-100 transition-opacity">
                   <Newspaper size={14} className="text-white" />
                </div>
             </motion.div>
           ))}

           {news.length === 0 && (
              <div className="py-32 text-center border border-dashed border-white/5 opacity-20 text-[10px] uppercase tracking-[0.5em]">
                 No broadcasts recorded in current cycle.
              </div>
           )}
        </div>
      )}
    </div>
  );
}
