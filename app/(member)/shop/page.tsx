"use client";

import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Sparkles, ShieldCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ShopPage() {
  const categories = [
    {
      id: "physical-card",
      title: "Physical Cards / 物理カード",
      desc: "Premium physical business cards with NFC / NFC搭載・最高級素材 of 物理名刺",
      icon: <CreditCard size={24} />,
      link: "/shop/card",
      color: "border-moonlight/20",
    },
    {
      id: "premium-assets",
      title: "Digital Assets / デジタルアセット",
      desc: "Unlock backgrounds, titles, and resonance sounds / 背景・称号・共鳴音の解禁",
      icon: <Sparkles size={24} />,
      link: "/inventory",
      color: "border-yellow-500/20",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-20 text-center relative">
        <Link href="/inventory" className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity">
           <ChevronLeft size={12} /> Back to Items / アイテム一覧へ
        </Link>
        <h1 className="text-3xl tracking-[0.8em] uppercase font-light mb-4">The Exchange / 交換所</h1>
        <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase">Equip yourself for the new reality / 新たな現実に備えよ</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <Link key={cat.id} href={cat.link} className="block group">
            <div
              className={`p-12 border ${cat.color} bg-void/90 relative overflow-hidden transition-all duration-300 group-hover:bg-white/[0.03] group-hover:scale-[1.02]`}
            >
              <div className="relative z-10 space-y-6">
                <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                  {cat.icon}
                </div>
                <div>
                  <h2 className="text-xl tracking-[0.4em] uppercase mb-2">{cat.title}</h2>
                  <p className="text-[11px] tracking-widest opacity-40">{cat.desc}</p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase opacity-20 group-hover:opacity-100 transition-all">
                  Access Portal <ShieldCheck size={12} />
                </div>
              </div>

              {/* Corporate Seal background element */}
              <div className="absolute right-0 top-0 h-full w-48 pointer-events-none overflow-hidden opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                 <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-64 h-64 border border-azure-500/20 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 border border-bronze-500/20 rounded-full flex items-center justify-center">
                       <div className="w-32 h-32 border border-azure-400/20 rotate-45 flex items-center justify-center">
                          <div className="w-20 h-20 border border-bronze-400/20 flex items-center justify-center -rotate-45">
                             <span className="text-[7px] tracking-[0.8em] text-azure-500 font-black uppercase">HXC</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
