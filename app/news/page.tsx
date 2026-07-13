"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Newspaper, ArrowLeft, Loader2, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/logger";

export default function PublicNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news/public");
        if (res.ok) setNews(await res.json());
      } catch (e) { logger.error("Failed to fetch news", { error: e }); }
      finally { setLoading(false); }
    };
    fetchNews();
  }, []);

  return (
    <main className="min-h-screen bg-void text-moonlight pt-32 px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <Link href="/" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft size={12} /> Back to Entry
          </Link>
          <h1 className="text-3xl tracking-[0.5em] uppercase font-extralight mb-4 flex items-center gap-4">
            <Newspaper className="text-azure-400" size={28} /> Intel & News
          </h1>
          <p className="text-xs tracking-widest text-azure-400 opacity-40 uppercase">System Updates / Announcements</p>
        </header>

        {loading ? (
          <div className="py-32 flex flex-col items-center gap-6 opacity-20">
             <Loader2 size={32} className="animate-spin" />
             <p className="text-[10px] tracking-[1em] uppercase">Accessing Archives...</p>
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-6">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Link href={`/news/${item.id}`} className="block p-8 bg-white/[0.01] border border-white/5 hover:border-white/20 hover:bg-white/[0.03] transition-all relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/20 group-hover:bg-azure-500/60 transition-all" />
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-4">
                         <div className="flex items-center gap-4">
                            <span className="text-[8px] tracking-[0.3em] font-bold uppercase text-azure-400 bg-azure-500/10 px-2 py-0.5 border border-azure-500/20">
                               {item.type || "Intel"}
                            </span>
                            <div className="flex items-center gap-2 opacity-20 text-[8px] font-mono uppercase tracking-widest">
                               <Calendar size={10} /> {new Date(item.created_at).toLocaleDateString()}
                            </div>
                         </div>
                         <h2 className="text-lg tracking-widest uppercase font-light group-hover:text-white transition-colors">{item.title}</h2>
                      </div>
                      <ChevronRight size={16} className="opacity-10 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-azure-400" />
                   </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border border-dashed border-white/5 opacity-30">
             <p className="text-[10px] tracking-[0.5em] uppercase">No logs found in the current era.</p>
          </div>
        )}
      </div>
    </main>
  );
}
