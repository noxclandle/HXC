"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ResonanceToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-8 left-1/2 z-[10000] min-w-[300px]"
          >
            <div className={`px-6 py-4 bg-void/90 backdrop-blur-xl border flex items-center gap-4 shadow-2xl ${
              toast.type === "success" ? "border-emerald-500/50" : 
              toast.type === "error" ? "border-rose-500/50" : "border-moonlight/30"
            }`}>
              {toast.type === "success" && <CheckCircle2 className="text-emerald-400" size={18} />}
              {toast.type === "error" && <AlertCircle className="text-rose-400" size={18} />}
              {toast.type === "info" && <Info className="text-blue-400" size={18} />}
              
              <div className="flex flex-col">
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">{toast.message.split(" / ")[0]}</p>
                {toast.message.includes(" / ") && (
                  <p className="text-[7px] tracking-[0.1em] opacity-40 uppercase">{toast.message.split(" / ")[1]}</p>
                )}
              </div>
              
              {/* Bottom accent line */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-[1px] ${
                  toast.type === "success" ? "bg-emerald-400" : 
                  toast.type === "error" ? "bg-rose-400" : "bg-moonlight"
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ResonanceToastProvider");
  return context;
}
