"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CreditCard, Shield, Star, Crown, Check, ArrowRight } from "lucide-react";

type TierId = "standard" | "custom" | "executive" | "apex";

interface Selection {
  tier: TierId | null;
  variant: string | null;
}

export default function PurchasePage() {
  const [selection, setSelection] = useState<Selection>({ tier: null, variant: null });

  const tiers = [
    {
      id: "standard" as TierId,
      name: "Classic",
      price: "¥5,000",
      type: "Obsidian Edition",
      desc: "HXCのフィロソフィーを体現する標準モデル。漆黒のマットフィニッシュが、ビジネスにおける誠実さを象徴します。",
      options: [{ label: "Original Black", value: "black" }],
      features: ["オリジナルエッチング加工", "初期 3,000 RT 付与", "システム利用権（永続）"],
      bgColor: "bg-zinc-950",
      accentColor: "border-zinc-800",
      glow: "group-hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]",
    },
    {
      id: "custom" as TierId,
      name: "Pastel",
      price: "¥10,000",
      type: "Aura Series",
      desc: "個性を引き立てるニュアンスカラー。洗練された色彩が、第一印象に柔らかな品格を添えます。",
      options: [
        { label: "Pastel Pink", value: "pink" },
        { label: "Pastel Blue", value: "blue" },
        { label: "Original", value: "original" },
      ],
      features: ["特注カラー・フィニッシュ", "初期 3,000 RT 付与", "カラーバリエーション選択可"],
      bgColor: "bg-zinc-950",
      accentColor: "border-zinc-800",
      glow: "group-hover:shadow-[0_0_40px_rgba(236,72,153,0.05)]",
    },
    {
      id: "executive" as TierId,
      name: "Executive",
      price: "¥30,000",
      type: "Metallic Series",
      desc: "卓越した存在感を示すメタリック加工。伝統的な価値観と最新技術が融合した、エグゼクティブのための選択。",
      options: [
        { label: "Metallic Silver", value: "silver" },
        { label: "Metallic Gold", value: "gold" },
      ],
      features: ["プレミアム・メタリック素材", "初期 3,000 RT 付与", "優先発行レーン"],
      bgColor: "bg-zinc-950",
      accentColor: "border-zinc-800",
      glow: "group-hover:shadow-[0_0_40px_rgba(234,179,8,0.07)]",
    },
    {
      id: "apex" as TierId,
      name: "Apex",
      price: "¥1,000,000",
      type: "The Black / Limited",
      desc: "究極のステータスを具現化した特注仕様。一握りのリーダーのみに許される、システムの全権を司るブラック。",
      options: [{ label: "Deep Black", value: "deep_black" }],
      features: ["特注最高級ブラック素材", "初期 3,000 RT 付与", "限定称号付与権", "エグゼクティブ・コンシェルジュ"],
      bgColor: "bg-zinc-950",
      accentColor: "border-zinc-700",
      glow: "group-hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]",
      isSpecial: true,
    },
  ];

  const handleSelectTier = (tierId: TierId, defaultVariant: string) => {
    setSelection({ tier: tierId, variant: defaultVariant });
  };

  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!selection.tier) return;
    setLoading(true);

    try {
      const selectedTierData = tiers.find(t => t.id === selection.tier);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedTierData?.name,
          variant: selection.variant,
          price: selectedTierData?.price,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate checkout.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during checkout.");
      setLoading(false);
    }
  };

  const selectedTierData = tiers.find(t => t.id === selection.tier);

  return (
    <div className="min-h-screen bg-black text-[#e0e0e0] font-sans selection:bg-white/10 pt-32 px-6 pb-40">
      {/* Background elements for Gothic feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-zinc-800/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block"
          >
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-10 mx-auto rotate-45">
              <div className="w-4 h-4 bg-white/80 rotate-[-45deg]" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-light tracking-[0.5em] uppercase text-white"
          >
            Issuance of Identity
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="h-[1px] w-24 bg-white/20 mx-auto"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[11px] tracking-[0.3em] uppercase text-white/40 max-w-lg mx-auto leading-relaxed"
          >
            HXCのネットワークへ参加するには、物理カードの発行が必要です。
            全モデルにアカウント登録権と初期 Relation Token が付与されます。
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, index) => {
            const isSelected = selection.tier === tier.id;
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleSelectTier(tier.id, tier.options[0].value)}
                className={`group relative p-10 border transition-all duration-700 cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected 
                    ? "border-white/60 bg-zinc-900/40" 
                    : "border-white/5 bg-zinc-950/40 hover:border-white/20"
                } ${tier.glow}`}
              >
                {/* Minimal Selected Indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute top-6 right-6"
                    >
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-12">
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-[0.4em] uppercase text-white/30 font-medium block">
                      {tier.type}
                    </span>
                    <h3 className="text-2xl font-extralight tracking-[0.2em] uppercase text-white group-hover:tracking-[0.25em] transition-all">
                      {tier.name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="text-3xl font-extralight italic tracking-tighter text-white">
                      {tier.price}
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed tracking-wider font-light line-clamp-3">
                      {tier.desc}
                    </p>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    {isSelected && tier.options.length > 1 && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">Select Variant</span>
                        <div className="space-y-2">
                          {tier.options.map((opt) => (
                            <div
                              key={opt.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelection({ ...selection, variant: opt.value });
                              }}
                              className={`flex items-center justify-between p-3 border text-[10px] tracking-[0.2em] transition-all ${
                                selection.variant === opt.value
                                  ? "border-white/40 bg-white/5 text-white"
                                  : "border-white/5 text-white/40 hover:border-white/20"
                              }`}
                            >
                              {opt.label}
                              {selection.variant === opt.value && <div className="w-1 h-1 bg-white" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-[10px] tracking-widest text-white/60 font-light">
                          <div className="w-[3px] h-[3px] bg-white/20 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Action Bar */}
        <AnimatePresence>
          {selection.tier && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-zinc-950/80 backdrop-blur-2xl border border-white/10 p-8 z-50 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="text-center md:text-left space-y-1">
                <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 block">Confirm Selection</span>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-extralight tracking-[0.2em] text-white uppercase">
                    {selectedTierData?.name} Edition
                  </span>
                  <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
                  <span className="text-lg font-light text-white/60 italic">{selectedTierData?.price}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full md:w-auto px-10 py-4 bg-white text-black hover:bg-[#d0d0d0] transition-all duration-500 font-bold tracking-[0.3em] text-[10px] uppercase flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-wait"
              >
                {loading ? "Processing..." : "Purchase Issuance"}
                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <footer className="mt-40 pb-20 border-t border-white/[0.03] pt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left opacity-40 hover:opacity-80 transition-opacity duration-1000">
            <div className="space-y-4">
              <h4 className="text-[10px] tracking-[0.4em] uppercase text-white font-bold">Delivery</h4>
              <p className="text-[9px] tracking-[0.2em] leading-relaxed">
                決済完了後、厳格な検品を経て発行されます。<br />
                通常、お手元に届くまで二週間前後の猶予を頂戴しております。
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] tracking-[0.4em] uppercase text-white font-bold">Inquiry</h4>
              <p className="text-[9px] tracking-[0.2em] leading-relaxed">
                製品仕様、または法人導入に関するご相談は、<br />
                <a href="/report" className="underline underline-offset-4 hover:text-white transition-colors">サポートデスク</a>にて承ります。
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] tracking-[0.4em] uppercase text-white font-bold">Legal</h4>
              <nav className="flex flex-col gap-2 text-[9px] tracking-[0.2em]">
                <a href="#" className="hover:text-white transition-colors">特定商取引法に基づく表記</a>
                <a href="#" className="hover:text-white transition-colors">利用規約</a>
                <a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a>
              </nav>
            </div>
          </div>

          <div className="mt-24 text-center">
            <p className="text-[8px] tracking-[0.5em] text-white/10 uppercase leading-loose">
              HXC © 2026. THE HIGHEST STANDARD OF BUSINESS NETWORKING.<br />
              ALL RIGHTS RESERVED. NO UNAUTHORIZED REPRODUCTION.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}