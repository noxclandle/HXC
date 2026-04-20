"use client";

import { motion } from "framer-motion";
import { BookOpen, Star, Shield, Zap, Award } from "lucide-react";

export default function TitleCompendiumPage() {
  const compendium = [
    { name: "Initiate", rarity: "common", color: "text-moonlight", condition: "アカウント作成時に自動付与。" },
    { name: "Messenger", rarity: "rare", color: "title-rare", condition: "5人以上のユーザーと名刺交換を行う。" },
    { name: "Void Voyager", rarity: "elite", color: "title-elite", condition: "10人以上のユーザーと名刺交換を行う。" },
    { name: "Headhunter", rarity: "epic", color: "title-epic", condition: "社長・代表クラスの役職を持つ者5人と名刺交換を行う。" },
    { name: "Blood Covenant", rarity: "legend", color: "title-legend", condition: "重役20人以上との共鳴、かつ他の称号を5つ以上保有。" },
    { name: "Chief Officer", rarity: "mythic", color: "title-mythic", condition: "システムの創設者のみが保有する唯一無二の座。" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 border-b border-moonlight/10 pb-8">
        <h1 className="text-xl tracking-[0.6em] uppercase flex items-center gap-4">
          <BookOpen className="text-moonlight opacity-40" size={20} />
          Grand Compendium
        </h1>
        <p className="text-[9px] tracking-widest opacity-40 uppercase mt-2">The Hidden Laws of Soul Progression</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {compendium.map((title, i) => (
          <motion.div
            key={title.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 border border-moonlight/5 bg-gothic-dark/10 group hover:border-moonlight/20 transition-all relative"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`text-sm tracking-[0.3em] uppercase font-bold ${title.color}`}>
                {title.name}
              </div>
              <span className="text-[8px] uppercase tracking-widest opacity-20">{title.rarity}</span>
            </div>
            
            <textarea 
              defaultValue={title.condition}
              className="w-full bg-transparent border-none p-0 text-[10px] tracking-widest opacity-60 leading-relaxed focus:ring-0 focus:opacity-100 transition-opacity resize-none h-20 outline-none"
            />
            
            <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-40 transition-opacity">
               <button className="text-[7px] uppercase tracking-[0.3em] hover:text-white">Save Changes</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
