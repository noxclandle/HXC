"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronRight, CreditCard, Shield, Star, Crown, Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import UnifiedCardContainer from "@/components/ui/UnifiedCardContainer";
import Link from "next/link";

type TierId = "standard" | "executive" | "apex" | "corporate";

interface Selection {
  tier: TierId;
  variant: string;
}

const TIER_THEMES = {
  standard: {
    glow: "rgba(59, 130, 246, 0.15)",
    border: "border-blue-950/30",
    text: "text-azure-400",
    badge: "STANDARD / 一般"
  },
  executive: {
    glow: "rgba(234, 179, 8, 0.12)",
    border: "border-yellow-950/30",
    text: "text-yellow-500",
    badge: "EXECUTIVE / 特別"
  },
  apex: {
    glow: "rgba(255, 255, 255, 0.15)",
    border: "border-zinc-800",
    text: "text-white",
    badge: "APEX / 究極"
  },
  corporate: {
    glow: "rgba(16, 185, 129, 0.15)",
    border: "border-emerald-950/30",
    text: "text-emerald-400",
    badge: "CORPORATE / 法人"
  }
};

export default function PurchasePage() {
  const [selection, setSelection] = useState<Selection>({ tier: "standard", variant: "Original" });
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetch("/api/stats/public")
      .then(res => res.json())
      .then(data => setUserCount(data.userCount || 0))
      .catch(err => console.error(err));
  }, []);

  const tiers = [
    {
      id: "standard" as TierId,
      name: "Standard",
      price: "¥3,000",
      type: "Original Design",
      desc: "Hexa Relationのフィロソフィーを体現するオリジナルデザイン。マットな質感が、ビジネスにおける誠実さを象徴します。 / Matte design embodying the Hexa Relation philosophy. The matte finish represents professional integrity.",
      options: [{ label: "Original", value: "Original" }],
      features: [
        "Original Design / オリジナルデザイン",
        "Initial 3,000 RT / 初期 3,000 RT 付与",
        "Lifetime Access / システム利用権（永続）"
      ],
    },
    {
      id: "executive" as TierId,
      name: "Executive",
      price: "¥20,000",
      type: "Metallic Series",
      desc: "卓越した存在感を示すメタリック加工。伝統的な価値観と最新技術が融合した、エグゼクティブのための洗練された選択。 / Premium metallic finish showing outstanding presence. A sophisticated blend of traditional values and next-gen tech.",
      options: [
        { label: "Silver", value: "Silver" },
        { label: "Gold", value: "Gold" },
      ],
      features: [
        "Premium Metallic / プレミアム・メタリック素材",
        "Initial 3,000 RT / 初期 3,000 RT 付与",
        "Priority Issuance / 優先発行レーン"
      ],
    },
    {
      id: "apex" as TierId,
      name: "Apex",
      price: "¥1,000,000",
      type: "The Black",
      desc: "究極のステータスを証明する完全特注のブラックカード。全世界10枠限定発行。残された席はあと僅かです。 / Custom-crafted black card representing the ultimate status. Limited to 10 slots worldwide. Very few remain.",
      options: [{ label: "Black", value: "Black" }],
      features: [
        "Bespoke Apex Material / 特注最高級ブラック素材",
        "Limit 10 (8 left) / 全世界限定 10 枠 (残り 8)",
        "Initial 3,000 RT / 初期 3,000 RT 付与",
        "Exclusive Title / 限定称号付与権",
        "Concierge / エグゼクティブ・コンシェルジュ"
      ],
      isSpecial: true,
    },
    {
      id: "corporate" as TierId,
      name: "Corporate",
      price: "¥5,800 / card",
      type: "Bespoke Design",
      desc: "法人用オリジナルデザイン。社章やコーポレートカラーを用いた完全オリジナルデザインカードを作成します。デザイン調整やデータ入力に時間を要するため、日程はおよそ1ヶ月（早くても2〜3週間）お時間を頂戴します。ご要望がございましたら、お問合せからお気軽にご相談ください。 / Original design tailored for corporations. Custom colors and logos. Due to design adjustments and data entry required, setup takes approximately 2-3 weeks to 1 month. For requests or inquiries, please use our contact page.",
      options: [{ label: "Corporate Design", value: "Corporate Design" }],
      features: [
        "Corporate Custom / 法人向けオリジナルデザイン",
        "Min Order: 100 / 最低発注数 100枚から",
        "Bulk Creation / 一括データ作成・同時納品",
        "Initial 3,000 RT / 初期 3,000 RT 付与（各カード）",
      ],
    },
  ];

  const handleSelectTier = (tierId: TierId, defaultVariant: string) => {
    setSelection({ tier: tierId, variant: defaultVariant });
  };

  const handleStartCheckout = () => {
    setShowForm(true);
  };

  const handleFinalCheckout = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields. / 必須項目をすべて入力してください。");
      return;
    }

    setLoading(true);

    try {
      const selectedTierData = tiers.find(t => t.id === selection.tier);
      
      let referrerId = "";
      try {
        referrerId = localStorage.getItem("hxc_referrer_id") || "";
      } catch (e) {
        console.error("Failed to retrieve referrer ID from localStorage:", e);
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedTierData?.name,
          variant: selection.variant,
          price: selectedTierData?.price,
          customerDetails: formData,
          referrerId: referrerId
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate checkout. / 決済セッションの作成に失敗しました。");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during checkout. / 決済処理中にエラーが発生しました。");
      setLoading(false);
    }
  };

  const selectedTierData = tiers.find(t => t.id === selection.tier)!;

  return (
    <div className="min-h-screen bg-black text-[#e0e0e0] font-sans selection:bg-white/10 pt-32 px-6 pb-40 overflow-x-hidden relative">
      {/* Dynamic Resonance Glow Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            background: `radial-gradient(circle 500px at 50% 40%, ${TIER_THEMES[selection.tier].glow}, transparent)`,
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block"
          >
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-8 mx-auto rotate-45">
              <div className="w-3 h-3 bg-white/80 rotate-[-45deg]" />
            </div>
          </motion.div>
          
          {/* Phase Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 mb-6"
          >
            <span className="text-[10px] tracking-[1.5em] uppercase text-azure-400 font-bold ml-[1.5em]">Phase 01: Genesis</span>
            <div className="flex items-center gap-4">
              <div className="w-48 h-[1px] bg-white/10 relative">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${Math.min((userCount / 100) * 100, 100)}%` }} 
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute h-full bg-azure-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
                />
              </div>
              <span className="text-[9px] font-mono tracking-widest text-white/40">{userCount} / 100</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-light tracking-[0.5em] uppercase text-white"
          >
            Card Order / カードの購入
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="h-[1px] w-16 bg-white/20 mx-auto"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] tracking-[0.25em] uppercase text-white/40 max-w-xl mx-auto leading-relaxed font-light pt-4"
          >
            HXCのネットワークへ参加するには、物理カードの発行が必要です。<br />
            Phase 01 発行枠には「初期参加証」として限定称号が付与されます。<br />
            <span className="text-[9px] text-white/25 mt-2 block tracking-[0.2em] font-normal uppercase">
              To join the HXC network, a physical card must be issued. Phase 01 slots include an exclusive &quot;Genesis&quot; title as initial proof.
            </span>
          </motion.p>
        </header>

        {/* Layout Partition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
          
          {/* Left: Card Visual Showcase */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-12 border border-white/5 bg-zinc-950/20 backdrop-blur-md relative rounded-3xl min-h-[480px] lg:sticky lg:top-32 transition-all duration-700">
            {/* Ambient subtle borders */}
            <div className="absolute top-6 left-6 text-[8px] font-mono tracking-[0.25em] text-white/30 uppercase">
              {"// Observation Channel: Active Resonance"}
            </div>
            <div className="absolute bottom-6 right-6 text-[8px] font-mono tracking-[0.25em] text-white/30 uppercase">
              {"// Frequency: "}{selection.tier === "apex" ? "999Hz" : selection.tier === "executive" ? "432Hz" : selection.tier === "corporate" ? "280Hz" : "128Hz"}
            </div>

            {/* Geometry Decor */}
            <div className="absolute top-10 right-10 w-2 h-2 border border-white/10 rounded-full" />
            <div className="absolute bottom-10 left-10 w-4 h-[1px] bg-white/10" />

            <div className="w-full flex justify-center">
              <UnifiedCardContainer orientation="horizontal" showControls={false} previewLabel="">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selection.tier + selection.variant}
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {selection.tier === "standard" ? (
                      <div className="relative w-[350px] h-[220px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] bg-[#0c0c0c]">
                        <Image
                          src="/ogp_card.png"
                          alt="Standard Physical Card Design"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <HexaCardPreview
                        name={selection.tier === "corporate" ? "YOUR NAME" : "HXC MEMBER"}
                        title={tiers.find(t => t.id === selection.tier)?.name || ""}
                        company={selection.tier === "corporate" ? "YOUR COMPANY" : "HEXA RELATION INC."}
                        logoUrl="/logo.png"
                        orientation="horizontal"
                        frame={selection.tier === "apex" ? "BlackCard" : selection.tier === "executive" ? "Platinum" : "Obsidian"}
                        background={selection.tier === "apex" ? "BlackCard" : selection.tier === "executive" ? "BrushedMetal" : "BrandedHex"}
                        effect={selection.tier === "apex" ? "Interference" : selection.tier === "executive" ? "Glitch" : "None"}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </UnifiedCardContainer>
            </div>
          </div>

          {/* Right: Customization & Information */}
          <div className="lg:col-span-5 space-y-10 bg-zinc-950/40 p-8 md:p-12 border border-white/5 rounded-3xl backdrop-blur-sm">
            
            {/* Segment Tabs */}
            <div className="space-y-4">
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 block font-mono">
                Select existence depth / 存在階層の選択
              </span>
              <div className="grid grid-cols-4 gap-2 bg-white/[0.02] p-1 border border-white/5 rounded-lg">
                {tiers.map((t) => {
                  const isSelected = selection.tier === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTier(t.id, t.options[0].value)}
                      className={`py-3 text-[9px] tracking-widest uppercase transition-all duration-300 rounded-md relative ${
                        isSelected 
                          ? "text-black bg-white font-bold" 
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Card Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selection.tier}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Header Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[8px] uppercase tracking-[0.3em] font-mono font-bold px-2.5 py-1 bg-white/5 border border-white/10 text-white`}>
                      {TIER_THEMES[selection.tier].badge}
                    </span>
                    <span className="text-[9px] tracking-[0.4em] uppercase text-white/30 font-medium">
                      {selectedTierData.type}
                    </span>
                  </div>
                  <h2 className="text-3xl font-extralight tracking-[0.15em] uppercase text-white">
                    {selectedTierData.name}
                  </h2>
                </div>

                {/* Description */}
                <div className="space-y-4 text-xs font-light text-white/50 leading-relaxed tracking-wider border-l border-white/10 pl-4 py-1">
                  {selectedTierData.desc}
                </div>

                {/* Variant Configuration */}
                {selectedTierData.options.length > 1 && (
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block font-mono">
                      Select Finish Variant / バリアントの選択
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedTierData.options.map((opt) => {
                        const isOptSelected = selection.variant === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setSelection({ ...selection, variant: opt.value })}
                            className={`py-3 px-4 border text-[9px] tracking-[0.2em] uppercase transition-all ${
                              isOptSelected
                                ? "border-white bg-white/5 text-white"
                                : "border-white/5 text-white/40 hover:border-white/20"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* System Access Specs */}
                <div className="space-y-4">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block font-mono">
                    Resonance Specs / 共鳴仕様
                  </span>
                  <ul className="space-y-3">
                    {selectedTierData.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-[10px] tracking-widest text-white/60 font-light leading-relaxed">
                        <div className="w-[3px] h-[3px] bg-azure-500 rounded-full mt-1.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Frame */}
                <div className="pt-8 border-t border-white/5 space-y-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-mono">Resonance Exchange Fee / 構築費用</span>
                    <span className="text-2xl font-light italic tracking-tight text-white">{selectedTierData.price}</span>
                  </div>

                  {selection.tier === "corporate" ? (
                    <Link 
                      href="/contact?subject=Corporate%20Card%20Order%20Inquiry%20/%20法人用オリジナルデザインカードに関するお問い合わせ"
                      className="w-full py-5 bg-white text-black hover:bg-[#d0d0d0] transition-all duration-500 font-bold tracking-[0.5em] text-[10px] uppercase flex items-center justify-center gap-4 group rounded"
                    >
                      Inquire / お問い合わせ
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <button 
                      onClick={handleStartCheckout}
                      disabled={loading}
                      className="w-full py-5 bg-white text-black hover:bg-[#d0d0d0] transition-all duration-500 font-bold tracking-[0.5em] text-[10px] uppercase flex items-center justify-center gap-4 group disabled:opacity-50 rounded"
                    >
                      {loading ? "Establishing... / 接続中..." : "Establish Identity / 存在を確定する"}
                      {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Footnote */}
        <div className="mt-40 text-center space-y-4">
          <p className="text-[9px] leading-relaxed tracking-[0.25em] text-white/30 uppercase max-w-xl mx-auto font-light">
            決済完了後、通常二週間前後での発行となります。<br />
            厳格な審査と検品を経て、貴方の元へ届けられます。<br />
            <span className="text-[8px] text-white/20 mt-2 block tracking-widest leading-relaxed">
              Delivery takes approximately two weeks post-checkout. All cards undergo rigorous inspection prior to secure shipment.
            </span>
          </p>
        </div>

        {/* Activity Ticker */}
        <div className="mt-24 border-t border-white/5 pt-8 flex justify-center overflow-hidden">
          <div className="flex gap-20 animate-infinite-scroll opacity-10 hover:opacity-45 transition-opacity duration-700">
            {[
              `SYSTEM: Phase 01 slots decreasing / ${Math.max(100 - userCount, 0)} remaining`,
              "LOG: New Identity established in Tokyo / 12m ago",
              "LOG: Apex Tier reserved in London / 1h ago",
              "SYSTEM: Relation Token synchronization complete",
              "LOG: New Identity established in Seoul / 45m ago"
            ].map((text, i) => (
              <span key={i} className="text-[8px] tracking-[0.5em] uppercase whitespace-nowrap font-mono text-white">
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 申し込みフォームモーダル (Stripe前段階) */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.97, y: 10 }} animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-zinc-950 border border-white/10 p-10 shadow-2xl relative overflow-hidden rounded-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-azure-500 to-rose-500" />
              
              <header className="mb-10 text-center space-y-2">
                <h2 className="text-xl tracking-[0.4em] uppercase font-light text-white">Identity Input / 情報入力</h2>
                <p className="text-[9px] tracking-widest text-azure-400 font-bold uppercase font-mono">Enter details to bind with physical card</p>
                <p className="text-[9px] text-white/30 pt-4 leading-relaxed font-light">
                  物理カードに刻印される基本的な情報を入力してください。<br/>
                  この後の決済画面でも、再度情報の確認が行われます。<br/>
                  <span className="text-[8px] text-white/20 mt-2 block tracking-wider font-normal uppercase">
                    Please enter the details to be printed on your physical card. Information will be reviewed again before payment.
                  </span>
                </p>
              </header>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-white/40 font-mono">氏名 / Name</label>
                    <input 
                      placeholder="Daisuke Sasaki" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 p-4 text-xs outline-none focus:border-white/40 transition-all text-white placeholder:text-white/25 rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-white/40 font-mono">フリガナ / Reading</label>
                    <input 
                      placeholder="ササキ ダイスケ" value={formData.handle}
                      onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 p-4 text-xs outline-none focus:border-white/40 transition-all text-white placeholder:text-white/25 rounded"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-widest text-white/40 font-mono">電話番号 / Phone</label>
                  <input 
                    placeholder="09012345678" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 p-4 text-xs outline-none focus:border-white/40 transition-all text-white placeholder:text-white/25 rounded"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-widest text-white/40 font-mono">メールアドレス / Email</label>
                  <input 
                    type="email" placeholder="alex@example.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 p-4 text-xs outline-none focus:border-white/40 transition-all text-white placeholder:text-white/25 rounded"
                  />
                </div>

                <div className="pt-8 space-y-4">
                  <button 
                    onClick={handleFinalCheckout}
                    disabled={loading}
                    className="w-full py-5 bg-white text-black font-bold text-[10px] tracking-[0.6em] uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 rounded"
                  >
                    {loading ? <Loader2 className="animate-spin" size={14} /> : null}
                    {loading ? "Redirecting... / 接続中..." : "Go to Payment / 決済へ進む"}
                  </button>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="w-full py-4 border border-white/10 text-[8px] tracking-[0.4em] uppercase text-white/30 hover:text-white transition-all rounded"
                  >
                    Cancel / キャンセル
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
