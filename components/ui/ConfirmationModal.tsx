"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cost: number;
}

/**
 * 高級感と「重み」を感じさせるトリプル・コンファメーション・モーダル
 */
export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, description, cost }: ConfirmationModalProps) {
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    if (!isOpen) setStep(1);
  }, [isOpen]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onConfirm();
      onClose();
    }
  };

  const getStepText = () => {
    switch (step) {
      case 1: return "意志を確認 (Verify Intent)";
      case 2: return "購入を確定 (Confirm Purchase)";
      case 3: return "取引を完了 (Authorize Finality)";
      default: return "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-void/90 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="max-w-md w-full bg-void border border-white/10 p-8 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-azure-500/40 to-transparent" />
            
            <button onClick={onClose} className="absolute top-4 right-4 opacity-20 hover:opacity-100 transition-opacity">
              <X size={18} />
            </button>

            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full border border-azure-500/20 flex items-center justify-center relative">
                   <Zap size={24} className="text-azure-400 animate-pulse" />
                   <div className={`absolute inset-[-4px] border-t-2 border-azure-500 rounded-full transition-transform duration-700`} style={{ rotate: `${(step/3)*360}deg` }} />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-[12px] tracking-[0.4em] uppercase font-bold text-white">{title}</h2>
                <p className="text-[10px] tracking-widest text-white/40 uppercase leading-relaxed">{description}</p>
              </div>

              <div className="py-4 border-y border-white/5">
                <p className="text-[8px] tracking-[0.3em] uppercase opacity-30 mb-1">Required Resource</p>
                <p className="text-xl tracking-[0.2em] text-azure-400 font-light">{cost.toLocaleString()} <span className="text-xs opacity-40">RT</span></p>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button 
                  onClick={handleNext}
                  className="w-full py-4 bg-white text-void text-[10px] font-bold tracking-[0.6em] uppercase hover:bg-azure-50 transition-all shadow-xl"
                >
                  {getStepText()}
                </button>
                <div className="flex justify-center gap-2">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className={`w-12 h-[1px] transition-all duration-500 ${i <= step ? 'bg-azure-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} />
                   ))}
                </div>
              </div>

              <p className="text-[7px] tracking-[0.2em] opacity-20 uppercase">
                Step {step} of 3: Authorized by Hexa Protocol
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
