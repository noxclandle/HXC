"use client";

import { motion } from "framer-motion";
import { Shield, Zap, RefreshCw, Layers, Database, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutLP() {
  const features = [
    {
      title: "Instant Sync / 0秒の接続",
      desc: "LINE, Instagram, HP。あらゆる接続先を一瞬で相手のスマホへインストール。検索の手間をゼロにします。",
      icon: <Zap className="text-azure-400" size={24} />
    },
    {
      title: "Eternal Freshness / 鮮度の維持",
      desc: "あなたが進化すれば、名刺も進化する。クラウド管理により、既に渡した名刺の中身も常に最新に保たれます。",
      icon: <RefreshCw className="text-emerald-400" size={24} />
    },
    {
      title: "Resonance Experience / 五感の刺激",
      desc: "洗練された接続音、光、アニメーション。単なるデータ交換を、忘れられない「体験」へと昇華させます。",
      icon: <Layers className="text-rose-400" size={24} />
    },
    {
      title: "Observation Log / 観測と記憶",
      desc: "もらった側がその場でメモを残せる機能を搭載。相手の記憶の中に、あなたの存在を深く刻み込みます。",
      icon: <Database className="text-amber-400" size={24} />
    },
    {
      title: "Stealth Layer / 秘密結社の特権",
      desc: "パスワードを知る者だけに明かされる秘匿情報。HXC会員であること自体が、次世代のステータスとなります。",
      icon: <Shield className="text-white" size={24} />
    }
  ];

  return (
    <main className="min-h-screen bg-void text-moonlight pt-32 pb-40 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[10px] tracking-[1em] uppercase text-azure-400 font-bold mb-6 block">Beyond the Business Card</span>
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.3em] uppercase mb-8">
              Identity <br className="md:hidden" /> Resonance
            </h1>
            <p className="text-[12px] tracking-[0.2em] text-white/40 max-w-2xl mx-auto leading-loose uppercase">
              紙の名刺を渡す時代は終わった。<br />
              これは、あなたの存在（アイデンティティ）を<br className="md:hidden" />同期するための「共鳴」である。
            </p>
          </motion.div>
        </header>

        {/* 5 Powers Section */}
        <section className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar px-6 -mx-6 md:mx-0 md:grid md:grid-cols-2 md:gap-12 md:mb-40 md:overflow-visible md:px-0 md:pb-0 mb-20">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group snap-center shrink-0 w-[85vw] md:w-auto"
            >
              <div className="mb-6">{f.icon}</div>
              <h3 className="text-lg tracking-[0.2em] uppercase font-light mb-4 group-hover:text-azure-400 transition-colors">{f.title}</h3>
              <p className="text-[11px] tracking-widest text-white/40 leading-relaxed uppercase">{f.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="text-center border-t border-white/5 pt-32">
          <h2 className="text-2xl tracking-[0.4em] uppercase font-light mb-12">Join the Genesis</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link 
              href="/purchase" 
              className="px-16 py-6 bg-white text-void font-bold tracking-[0.5em] uppercase text-[10px] hover:bg-azure-50 transition-all flex items-center gap-4"
            >
              Order Card / 購入 <ArrowRight size={14} />
            </Link>
            <Link 
              href="/" 
              className="text-[10px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors"
            >
              Back to Gateway / 戻る
            </Link>
          </div>
        </section>

        {/* Footer Concept */}
        <footer className="mt-40 text-center opacity-10">
           <p className="text-[8px] tracking-[1em] uppercase">Private Network / Identity Synchronization System</p>
        </footer>
      </div>
    </main>
  );
}
