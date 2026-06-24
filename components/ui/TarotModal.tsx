"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { TarotCard, getRandomCard } from "@/lib/tarot";

interface TarotModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "daily" | "oracle";
  onSuccess?: (addedRt: number) => void;
}

// Minimal geometric SVGs for each tarot card matching the design system
const CardArtwork = ({ id }: { id: number }) => {
  switch (id) {
    case 0: // THE VOID
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-white/30 fill-none">
          <circle cx="50" cy="50" r="25" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="5" strokeWidth="0.5" />
        </svg>
      );
    case 1: // THE RESONANCE
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-azure-400/60 fill-none">
          <path d="M30,50 Q40,35 50,50 T70,50 Q60,65 50,50 T30,50" strokeWidth="1" />
          <circle cx="50" cy="50" r="12" strokeWidth="0.5" strokeDasharray="1 2" />
        </svg>
      );
    case 2: // THE SECRECY
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-purple-400/50 fill-none">
          <circle cx="50" cy="50" r="24" strokeWidth="1" />
          <path d="M50,26 A24,24 0 0,0 50,74 A16,16 0 0,1 50,26" fill="currentColor" className="text-purple-400/10" />
        </svg>
      );
    case 3: // THE ARCHITECT
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-bronze-400/60 fill-none">
          <polygon points="50,20 78,70 22,70" strokeWidth="1" />
          <circle cx="50" cy="53" r="12" strokeWidth="0.7" />
        </svg>
      );
    case 4: // THE CHIEF OFFICER
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-white/40 fill-none">
          <rect x="26" y="26" width="48" height="48" strokeWidth="1" />
          <line x1="50" y1="15" x2="50" y2="85" strokeWidth="0.5" />
          <line x1="15" y1="50" x2="85" y2="50" strokeWidth="0.5" />
        </svg>
      );
    case 5: // THE MASTERMIND
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-yellow-500/40 fill-none">
          <polygon points="50,15 63,40 90,40 68,57 77,85 50,68 23,85 32,57 10,40 37,40" strokeWidth="1" />
          <circle cx="50" cy="50" r="8" strokeWidth="0.5" />
        </svg>
      );
    case 6: // THE HARMONY
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-rose-400/50 fill-none">
          <circle cx="42" cy="50" r="18" strokeWidth="1" />
          <circle cx="58" cy="50" r="18" strokeWidth="1" />
          <line x1="50" y1="30" x2="50" y2="70" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
      );
    case 10: // THE CYCLE
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-white/40 fill-none">
          <circle cx="50" cy="50" r="26" strokeWidth="1" />
          <circle cx="50" cy="50" r="14" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="6" strokeWidth="0.5" />
          <line x1="50" y1="10" x2="50" y2="90" strokeWidth="0.5" strokeDasharray="1 3" />
          <line x1="10" y1="50" x2="90" y2="50" strokeWidth="0.5" strokeDasharray="1 3" />
        </svg>
      );
    case 13: // THE ERADICATION
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-red-400/50 fill-none">
          <polygon points="25,25 75,25 50,50" strokeWidth="1" />
          <polygon points="25,75 75,75 50,50" strokeWidth="1" />
          <line x1="25" y1="25" x2="75" y2="75" strokeWidth="0.5" />
          <line x1="75" y1="25" x2="25" y2="75" strokeWidth="0.5" />
        </svg>
      );
    case 15: // THE DETECTOR
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-purple-400/50 fill-none">
          <rect x="32" y="32" width="36" height="36" strokeWidth="1" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="12" strokeWidth="0.5" />
        </svg>
      );
    case 18: // THE SHADOW
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-white/30 fill-none">
          <circle cx="50" cy="50" r="26" strokeWidth="1" />
          <path d="M50,24 A26,26 0 0,1 76,50 A26,26 0 0,1 50,76 Z" fill="currentColor" className="text-white/5" />
        </svg>
      );
    case 21: // THE IDENTITY
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-emerald-400/50 fill-none">
          <circle cx="50" cy="50" r="30" strokeWidth="1" />
          <rect x="29" y="29" width="42" height="42" strokeWidth="0.5" />
          <polygon points="50,20 80,50 50,80 20,50" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current text-white/30 fill-none">
          <circle cx="50" cy="50" r="20" strokeWidth="1" />
        </svg>
      );
  }
};

const CardBackpattern = () => (
  <svg viewBox="0 0 100 150" className="w-full h-full stroke-current text-azure-500/25 fill-none p-3">
    <rect x="4" y="4" width="92" height="142" rx="6" strokeWidth="0.5" strokeDasharray="3 3" />
    <circle cx="50" cy="75" r="24" strokeWidth="0.5" />
    <circle cx="50" cy="75" r="28" strokeWidth="0.5" strokeDasharray="1 2" />
    <line x1="50" y1="12" x2="50" y2="138" strokeWidth="0.5" />
    <line x1="12" y1="75" x2="88" y2="75" strokeWidth="0.5" />
    <polygon points="50,47 68,75 50,103 32,75" strokeWidth="0.5" />
    <circle cx="50" cy="25" r="2" fill="currentColor" className="text-azure-500/30" />
    <circle cx="50" cy="125" r="2" fill="currentColor" className="text-azure-500/30" />
  </svg>
);

export default function TarotModal({ isOpen, onClose, mode, onSuccess }: TarotModalProps) {
  const [step, setStep] = useState<"ready" | "select" | "revealing" | "result">("ready");
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [isUpright, setIsUpright] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addedRt, setAddedRt] = useState<number | null>(null);

  const startReading = () => {
    setStep("select");
    setSelectedCardIdx(null);
    setDrawnCard(null);
    setErrorMsg(null);
    setAddedRt(null);
  };

  const handleCardSelect = async (idx: number) => {
    if (isLoading || step !== "select") return;
    setSelectedCardIdx(idx);
    setIsLoading(true);
    setErrorMsg(null);

    // 1. Draw card on client
    const { card, isUpright: uprightStatus } = getRandomCard();

    if (mode === "daily") {
      try {
        // 2. Call API to claim daily resonance
        const res = await fetch("/api/user/daily-resonance", { method: "POST" });
        const data = await res.json();

        if (res.ok) {
          setDrawnCard(card);
          setIsUpright(uprightStatus);
          setAddedRt(data.added_rt || 100);
          setStep("revealing");
          
          // Delay to complete flip animation before showing full results text
          setTimeout(() => {
            setStep("result");
            if (onSuccess) onSuccess(data.added_rt || 100);
          }, 800);
        } else {
          setErrorMsg(data.error === "Already resonated today." 
            ? "本日の共鳴は既に完了しています。" 
            : data.error || "境界との同期に失敗しました。"
          );
          setIsLoading(false);
        }
      } catch (err) {
        setErrorMsg("通信エラーが発生しました。境界が不安定です。");
        setIsLoading(false);
      }
    } else {
      // Free one oracle reading, no API call
      setDrawnCard(card);
      setIsUpright(uprightStatus);
      setStep("revealing");
      
      setTimeout(() => {
        setStep("result");
      }, 800);
      setIsLoading(false);
    }
  };

  const getRomanNumeral = (id: number) => {
    const numerals: { [key: number]: string } = {
      0: "0 / O",
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
      5: "V",
      6: "VI",
      10: "X",
      13: "XIII",
      15: "XV",
      18: "XVIII",
      21: "XXI"
    };
    return numerals[id] || `${id}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step !== "revealing" && !isLoading ? onClose : undefined}
        className="absolute inset-0 bg-void/95 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-gothic-dark border border-white/10 p-6 md:p-8 shadow-2xl overflow-hidden rounded-2xl flex flex-col items-center text-center animate-fade-in"
      >
        {/* Sleek top accent line */}
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-azure-500/40 to-transparent" />

        {/* Close Button */}
        {step !== "revealing" && !isLoading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}

        <header className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={12} className="text-azure-400 animate-pulse" />
            <span className="text-[9px] tracking-[0.3em] font-bold uppercase text-azure-400">
              {mode === "daily" ? "Daily Resonance / デイリー共鳴" : "One Oracle / 境界からの神託"}
            </span>
          </div>
          <h2 className="text-lg md:text-xl tracking-[0.2em] font-light text-white uppercase">
            {mode === "daily" ? "Revelation from Void / 境界の啓示" : "One Oracle / ワンオラクル"}
          </h2>
        </header>

        {/* Error State */}
        {errorMsg && (
          <div className="my-4 p-4 border border-rose-500/20 bg-rose-500/[0.03] text-rose-400 text-xs rounded-xl flex items-center gap-3 max-w-sm">
            <AlertCircle size={16} className="shrink-0" />
            <p className="text-left font-sans leading-relaxed tracking-wider">{errorMsg}</p>
          </div>
        )}

        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[340px]">
          {step === "ready" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-sm"
            >
              <p className="text-xs leading-relaxed tracking-widest text-white/60 font-sans">
                {mode === "daily"
                  ? "Retrieve today's alignment data. Select one of the three face-down cards to complete resonance and claim RT. / 本日分の同調データを境界から取得します。3枚の裏伏せられたカードから1枚を選択し、共鳴（RTの受け取り）を完了してください。"
                  : "Keep calm and connect your awareness to the Void. The oracle you need will be shown through a single card. / 静寂を保ち、意識を境界へと接続してください。今の貴方に必要な神託が、1枚のカードを通じて示されます。"}
              </p>
              <button
                onClick={startReading}
                className="px-8 py-3 bg-azure-500/10 hover:bg-azure-500/20 text-azure-400 border border-azure-500/30 text-[10px] tracking-[0.4em] uppercase font-bold rounded-full transition-all hover:scale-105"
              >
                {mode === "daily" ? "Receive Revelation / 啓示を受け取る" : "Start Oracle / 占いを開始する"}
              </button>
            </motion.div>
          )}

          {(step === "select" || step === "revealing") && (
            <div className="space-y-6 w-full">
              <p className="text-[10px] tracking-widest text-white/40 uppercase mb-4">
                {isLoading ? "Synchronizing... / 境界と同期中" : "Choose 1 Card / 1枚のカードを選択してください"}
              </p>

              <div className="flex justify-center gap-4 md:gap-6 py-2">
                {[0, 1, 2].map((idx) => {
                  const isSelected = selectedCardIdx === idx;
                  const isAnySelected = selectedCardIdx !== null;
                  
                  return (
                    <motion.div
                      key={idx}
                      onClick={() => handleCardSelect(idx)}
                      animate={{
                        scale: isSelected ? 1.05 : isAnySelected ? 0.9 : 1,
                        opacity: isSelected ? 1 : isAnySelected ? 0.3 : 1,
                        y: isSelected ? -10 : 0
                      }}
                      className={`relative w-24 h-36 md:w-28 md:h-44 [perspective:1000px] cursor-pointer ${
                        isLoading ? "pointer-events-none" : ""
                      }`}
                    >
                      <motion.div
                        className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-700"
                        animate={{
                          rotateY: isSelected && step === "revealing" ? 180 : 0
                        }}
                        style={{ willChange: "transform" }}
                      >
                        {/* CARD BACK */}
                        <div className="absolute inset-0 bg-[#070707] border border-white/10 rounded-xl flex items-center justify-center [backface-visibility:hidden] -webkit-backface-visibility:hidden shadow-lg hover:border-azure-500/40 transition-colors">
                          <CardBackpattern />
                        </div>

                        {/* CARD FRONT */}
                        <div className="absolute inset-0 bg-[#0a0a0a] border border-azure-500/40 rounded-xl flex flex-col justify-between p-3 [backface-visibility:hidden] -webkit-backface-visibility:hidden [transform:rotateY(180deg)] shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                          <div className="text-[9px] tracking-widest font-mono text-white/20 text-left">
                            {drawnCard ? getRomanNumeral(drawnCard.id) : ""}
                          </div>
                          
                          <div className="flex justify-center my-auto">
                            {drawnCard && <CardArtwork id={drawnCard.id} />}
                          </div>

                          <div className="space-y-1">
                            <div className="text-[7.5px] font-bold tracking-[0.2em] uppercase text-white truncate">
                              {drawnCard?.name}
                            </div>
                            <div className="text-[6.5px] tracking-widest text-azure-400 font-bold uppercase">
                              {isUpright ? "ALIGN" : "REVERSE"}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {step === "result" && drawnCard && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-sm w-full animate-fade-in"
            >
              {/* Main Card View */}
              <div className="flex flex-col items-center">
                <div 
                  className={`w-28 h-44 bg-[#0a0a0a] border border-azure-500/40 rounded-xl flex flex-col justify-between p-3 shadow-[0_0_25px_rgba(59,130,246,0.2)] mb-4 ${
                    !isUpright ? "rotate-180" : ""
                  }`}
                >
                  <div className="text-[9px] tracking-widest font-mono text-white/20 text-left">
                    {getRomanNumeral(drawnCard.id)}
                  </div>
                  <div className="flex justify-center my-auto">
                    <CardArtwork id={drawnCard.id} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[7.5px] font-bold tracking-[0.2em] uppercase text-white truncate">
                      {drawnCard.name}
                    </div>
                    <div className="text-[6.5px] tracking-widest text-azure-400 font-bold uppercase">
                      {isUpright ? "ALIGNMENT" : "REVERSAL"}
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-light tracking-[0.2em] text-white">
                  {drawnCard.jpName} <span className="opacity-40">({isUpright ? "Upright / 正位置" : "Reversed / 逆位置"})</span>
                </h3>
                <p className="text-[8px] tracking-[0.3em] uppercase text-azure-400 font-bold mt-1">
                  {isUpright ? drawnCard.upright.meaning : drawnCard.reversed.meaning}
                </p>
              </div>

              {/* Message */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <p className="text-[10px] md:text-xs leading-relaxed tracking-widest text-white/70 font-sans whitespace-pre-wrap">
                  {isUpright ? drawnCard.upright.oracle : drawnCard.reversed.oracle}
                </p>
              </div>

              {/* Daily Claim Reward Message */}
              {mode === "daily" && addedRt !== null && (
                <div className="py-2 px-4 border border-azure-500/20 bg-azure-500/[0.04] text-azure-300 rounded-full inline-flex items-center gap-2 text-[9px] tracking-[0.2em] font-bold uppercase mx-auto">
                  <Sparkles size={11} className="animate-spin-slow" />
                  Resonance Confirmed / +{addedRt} RT Received
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 pt-2">
                {mode === "oracle" && (
                  <button
                    onClick={startReading}
                    className="px-6 py-2 border border-white/10 hover:border-white/30 text-[9px] tracking-[0.3em] uppercase text-white/60 hover:text-white rounded-full transition-colors"
                  >
                    Draw Again / 再び引く
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 bg-white text-void hover:bg-white/90 text-[9px] tracking-[0.3em] font-bold uppercase rounded-full transition-colors"
                >
                  Close / 境界を閉じる
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
