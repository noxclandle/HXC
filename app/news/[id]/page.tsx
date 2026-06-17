"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Newspaper, ArrowLeft, Loader2, Calendar, Tag, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!params.id) return;
      try {
        const res = await fetch(`/api/news/public/${params.id}`);
        if (res.ok) {
           setItem(await res.json());
        } else {
           router.push("/news");
        }
      } catch (e) { 
        console.error(e); 
        router.push("/news");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
         <Loader2 size={32} className="animate-spin text-azure-400 opacity-20" />
      </div>
    );
  }

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
           <div className="text-sm md:text-base leading-loose tracking-[0.05em] text-white/70 whitespace-pre-wrap font-light">
              {item.content}
           </div>
        </section>

        <footer className="pt-12 border-t border-white/5 flex justify-between items-center opacity-40">
           <p className="text-[8px] tracking-[0.4em] uppercase font-mono italic">Source: Hexa Relation Internal Intel</p>
           <button 
             onClick={() => {
               if (navigator.share) {
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
