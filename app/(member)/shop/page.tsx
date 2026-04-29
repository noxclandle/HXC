"use client";

import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ShopPage() {
  const categories = [
    {
      id: "physical-card",
      title: "Physical Cards",
      desc: "NFC搭載・最高級素材の物理名刺",
      icon: <CreditCard size={24} />,
      link: "/shop/card",
      color: "border-moonlight/20",
    },
    {
      id: "premium-assets",
      title: "Digital Assets",
      desc: "背景・称号・共鳴音の解禁",
      icon: <Sparkles size={24} />,
      link: "/inventory",
      color: "border-yellow-500/20",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-20 text-center">
        <h1 className="text-3xl tracking-[0.8em] uppercase font-light mb-4">The Exchange</h1>
        <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase">Equip yourself for the new reality.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <Link key={cat.id} href={cat.link}>
            <motion.div
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
              className={`p-12 border ${cat.color} bg-void/50 backdrop-blur-sm relative overflow-hidden group transition-all`}
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

              {/* Decorative background element */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <ShoppingBag size={120} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
