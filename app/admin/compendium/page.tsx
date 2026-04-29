"use client";

import { motion } from "framer-motion";
import { BookOpen, Star, Shield, Zap, Award, Target, Users } from "lucide-react";

export default function TitleCompendiumPage() {
  const compendium = [
    { name: "ASSOCIATE", rarity: "common", condition: "初期付与。同盟の一員である証。" },
    { name: "Collector", rarity: "rare", condition: "10人以上のユーザーと接続を記録。" },
    { name: "Messenger", rarity: "rare", condition: "20人以上のユーザーと接続を記録。" },
    { name: "Void Voyager", rarity: "epic", condition: "50人以上のユーザーと接続を記録。" },
    { name: "Strategist", rarity: "epic", condition: "100人以上のユーザーと接続を記録。広範な影響力の証。" },
    { name: "Headhunter", rarity: "epic", condition: "経営層（社長・代表等）5人以上との接続。" },
    { name: "The Sovereign", rarity: "legendary", condition: "経営層30人以上との接続。支配的なネットワークの構築。" },
    { name: "Tech Lead", rarity: "rare", condition: "開発・技術職10人以上との接続。" },
    { name: "Gilded Soul", rarity: "legendary", condition: "50,000 CP以上を保有する資産家。" },
    { name: "Mastermind", rarity: "mythic", condition: "なにもかも作り替える力。" },
    { name: "Chief Officer", rarity: "mythic", condition: "システムの全権を掌握せし創設者。解放条件なし。" },
  ];

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
          Protocol Compendium
        </h1>
        <p className="text-[9px] tracking-widest opacity-40 uppercase mt-2">Active Titles and Achievement Conditions</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {compendium.map((title, i) => (
          <motion.div
            key={title.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 border border-white/5 bg-white/[0.02] group hover:border-azure-500/30 transition-all relative overflow-hidden"
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
    </div>
  );
}
