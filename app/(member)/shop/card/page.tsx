"use client";

import { motion } from "framer-motion";
import { ChevronLeft, CreditCard, Shield, Zap, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CardShopPage() {
  const [selected, setSelected] = useState("obsidian");

  const cards = [
    {
      id: "obsidian",
      name: "Obsidian Edition",
      price: "0 RT",
      desc: "漆黒の火山岩を彷彿とさせる標準モデル。誠実さと神秘性を両立したビジネスの正装。",
      features: ["NFC NTAG215 内蔵", "高耐傷性マット加工", "QRコード刻印対応"],
      color: "from-zinc-800 to-black",
      borderColor: "border-zinc-700",
    },
    {
      id: "gold",
      name: "Heritage Gold",
      price: "5,000 RT",
      desc: "伝統と格式を重んじる黄金の輝き。相手に深い信頼と成功の記憶を刻み込みます。",
      features: ["24K相当ゴールド仕上げ", "エッチング刻印", "限定デジタル称号付与"],
      color: "from-amber-600/20 to-amber-900/40",
      borderColor: "border-amber-500/50",
    },
    {
      id: "platinum",
      name: "Platinum Elite",
      price: "8,000 RT",
      desc: "洗練されたプロフェッショナルのための白金。静かな存在感が、卓越した能力を証明します。",
      features: ["プラチナ・マットシルバー仕上げ", "三層プレミアム構造", "先行機能アクセス権"],
      color: "from-slate-400/20 to-slate-700/40",
      borderColor: "border-slate-400/50",
    },
  ];

  const activeCard = cards.find(c => c.id === selected) || cards[0];

  return (
    <div className="max-w-6xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity mb-12">
        <ChevronLeft size={14} /> Back to Exchange
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Preview Section */}
        <div className="space-y-8">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`aspect-[1.58/1] w-full rounded-xl border-2 ${activeCard.borderColor} bg-gradient-to-br ${activeCard.color} shadow-2xl relative overflow-hidden flex flex-col justify-between p-8`}
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <div className="w-4 h-4 bg-white/80 rounded-sm rotate-45" />
              </div>
              <span className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold italic">Hexa Relation</span>
            </div>
            
            <div className="space-y-2">
              <div className="h-[1px] w-full bg-white/10" />
              <div className="flex justify-between items-end">
                 <div className="space-y-1">
                   <div className="w-32 h-2 bg-white/20" />
                   <div className="w-20 h-1 bg-white/10" />
                 </div>
                 <Zap size={20} className="opacity-20" />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => setSelected(card.id)}
                className={`p-4 border transition-all text-center space-y-2 ${selected === card.id ? card.borderColor + " bg-white/5" : "border-white/5 opacity-40 hover:opacity-100"}`}
              >
                <div className={`w-full h-1 bg-gradient-to-r ${card.color}`} />
                <span className="text-[8px] uppercase tracking-widest block">{card.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-12">
          <header>
            <h1 className="text-3xl tracking-[0.5em] uppercase font-light mb-4">{activeCard.name}</h1>
            <p className="text-sm tracking-widest text-moonlight/60 leading-relaxed font-light italic">
              &quot;{activeCard.desc}&quot;
            </p>
          </header>

          <div className="space-y-6">
            <h3 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
              <Shield size={14} /> Spec & Features
            </h3>
            <ul className="space-y-4">
              {activeCard.features.map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-[11px] tracking-widest opacity-80">
                  <div className="w-1 h-1 bg-moonlight rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-12 border-t border-white/5 flex items-center justify-between">
            <div className="space-y-1">
               <span className="text-[9px] tracking-[0.4em] uppercase opacity-30 block">Acquisition Cost</span>
               <span className="text-3xl font-extralight italic">{activeCard.price}</span>
            </div>
            <button className="px-12 py-4 bg-moonlight text-void text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-colors">
              Request Ritual
            </button>
          </div>

          <p className="text-[8px] tracking-[0.3em] opacity-20 uppercase leading-relaxed">
            * 物理カードの発行には「Mastermind」または「Chief Officer」による承認儀式が必要です。<br />
            * 発行後、お手元に届くまで約2週間ほどの浄化期間を要します。
          </p>
        </div>
      </div>
    </div>
  );
}
