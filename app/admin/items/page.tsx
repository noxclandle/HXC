"use client";

import { motion } from "framer-motion";
import { BookOpen, Target, Users, ShieldAlert } from "lucide-react";
import { AUTO_GRANT_TITLE_CONDITIONS } from "@/lib/game/titles";

const SPECIAL_TITLES = [
  { name: "ASSOCIATE", rarity: "common", condition: "初期付与。同盟の一員である証。" },
  { name: "Mastermind", rarity: "mythic", condition: "管理者による手動付与のみ（自動解放条件なし）。" },
  { name: "Chief Officer", rarity: "mythic", condition: "システムの全権を掌握せし創設者。手動付与のみ。" },
  { name: "APEX", rarity: "mythic", condition: "Apexティア（限定物理カード）購入で自動付与。" },
];

export default function TitleListPage() {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "mythic": return "text-rose-500 border-rose-500/20 bg-rose-500/5";
      case "legendary": return "text-orange-500 border-orange-500/20 bg-orange-500/5";
      case "epic": return "text-purple-400 border-purple-500/20 bg-purple-500/5";
      case "rare": return "text-azure-400 border-azure-400/20 bg-azure-400/5";
      default: return "text-white/40 border-white/10 bg-white/5";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 border-b border-white/5 pb-8">
        <h1 className="text-xl tracking-[0.6em] uppercase flex items-center gap-4">
          <BookOpen className="text-azure-400" size={20} />
          Title Compendium
        </h1>
        <p className="text-[9px] tracking-widest opacity-40 uppercase mt-2">
          称号図鑑（参照専用） — 実際の自動付与条件は lib/game/titles.ts の設定を直接反映
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 flex items-center gap-2">
          <Target size={14} /> Auto-Granted Titles / 自動付与称号
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUTO_GRANT_TITLE_CONDITIONS.map((title, i) => (
            <motion.div
              key={title.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 border border-white/5 bg-white/[0.02] group hover:border-azure-500/30 transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs tracking-[0.3em] uppercase font-bold text-white">
                  {title.title}
                </div>
                <span className={`text-[7px] px-2 py-0.5 border uppercase tracking-widest font-bold ${getRarityColor(title.rarity)}`}>
                  {title.rarity}
                </span>
              </div>

              <p className="text-[10px] tracking-widest opacity-60 leading-relaxed min-h-[40px]">
                {title.description}
              </p>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <Target size={10} />
                  <span className="text-[7px] uppercase tracking-widest">Auto-Grant</span>
                </div>
                <Users size={10} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 flex items-center gap-2">
          <ShieldAlert size={14} /> Special Titles / 特殊称号（手動・購入付与）
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPECIAL_TITLES.map((title) => (
            <div
              key={title.name}
              className="p-6 border border-white/5 bg-white/[0.02] relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs tracking-[0.3em] uppercase font-bold text-white">
                  {title.name}
                </div>
                <span className={`text-[7px] px-2 py-0.5 border uppercase tracking-widest font-bold ${getRarityColor(title.rarity)}`}>
                  {title.rarity}
                </span>
              </div>
              <p className="text-[10px] tracking-widest opacity-60 leading-relaxed min-h-[40px]">
                {title.condition}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
