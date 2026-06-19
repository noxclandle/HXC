"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Link from "next/link";

export default function NewsDetailClient({ item }: { item: any }) {
  if (!item) return null;

  return (
    <main className="min-h-screen bg-void text-moonlight pt-32 px-6 pb-24">
      <article className="max-w-3xl mx-auto">
        <header className="mb-16">
          <Link href="/news" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft size={12} /> Back to Archives
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
             <span className="text-[8px] tracking-[0.4em] uppercase font-bold text-azure-400 bg-azure-500/10 px-2 py-1 border border-azure-500/20">
                {item.type || "Intel"}
             </span>
             <div className="flex items-center gap-2 opacity-20 text-[8px] font-mono uppercase tracking-widest">
                <Calendar size={10} /> {new Date(item.created_at).toLocaleDateString()}
             </div>
          </div>

          <h1 className="text-3xl md:text-4xl tracking-widest uppercase font-light leading-relaxed text-white">
            {item.title}
          </h1>
          <div className="w-16 h-px bg-azure-500/30 mt-8" />
        </header>

        <section className="prose prose-invert max-w-none mb-24">
           <div className="text-sm md:text-base leading-loose tracking-[0.05em] text-white/70 whitespace-pre-wrap font-light font-sans">
              {item.content}
           </div>
        </section>

        <footer className="pt-12 border-t border-white/5 flex justify-between items-center opacity-40">
           <p className="text-[8px] tracking-[0.4em] uppercase font-mono italic">Source: Hexa Relation Internal Intel</p>
           <button 
             onClick={() => {
               if (typeof window !== "undefined" && navigator.share) {
                 navigator.share({ title: item.title, url: window.location.href });
               }
             }}
             className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] hover:text-white transition-colors"
           >
              Share Signal <Share2 size={10} />
           </button>
        </footer>
      </article>
    </main>
  );
}
