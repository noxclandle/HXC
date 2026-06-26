"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Check, Upload, RotateCcw, FileText, Link as LinkIcon, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/ConnectionToast";
import BackgroundGenerator from "@/components/hub/BackgroundGenerator";

export default function DocumentManager() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [links, setLinks] = useState<{title: string, url: string}[]>([]);
  const [userSlug, setUserSlug] = useState("");
  const [equippedZoomBg, setEquippedZoomBg] = useState("ZoomBgDefault");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/user/status", { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setLinks(data.portfolio_links || []);
          setUserSlug(data.slug || "");
          setEquippedZoomBg(data.equipped?.zoom_bg || "ZoomBgDefault");
        }
      } catch (e) { 
        console.error(e); 
      } finally { 
        setIsLoaded(true); 
      }
    };
    if (session) fetchInitialData();
  }, [session]);

  const addLink = () => setLinks(prev => [...prev, { title: "", url: "" }]);
  const removeLink = (index: number) => setLinks(prev => prev.filter((_, i) => i !== index));
  const updateLink = (index: number, field: "title" | "url", value: string) => {
    setLinks(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: value };
      return newList;
    });
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolio_links: links
        })
      });

      if (res.ok) {
        setSaveStatus("saved");
        showToast("Documents updated successfully / 資料を更新しました", "success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        throw new Error("Save failed");
      }
    } catch (e) {
      setSaveStatus("error");
      showToast("Failed to save changes / 保存に失敗しました", "error");
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-void flex items-center justify-center"><Loader2 className="animate-spin text-azure-400" /></div>;

  return (
    <div className="max-w-7xl mx-auto pt-32 px-6 pb-24 text-moonlight min-h-screen">
      <header className="mb-16">
        <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> Back to Atelier
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-8">
           <div>
              <h1 className="text-3xl tracking-[0.4em] uppercase font-light text-white mb-2">Presentation Suite</h1>
              <p className="text-[10px] tracking-[0.2em] text-azure-400 uppercase font-bold">オンライン商談用背景生成 ＆ 配布資料管理</p>
           </div>
           
           <button 
             onClick={handleSave}
             disabled={saveStatus === "saving"}
             className="px-8 py-4 bg-white text-void font-bold text-[9px] tracking-[0.4em] uppercase flex items-center gap-3 hover:bg-azure-50 transition-all disabled:opacity-50"
           >
             {saveStatus === "saving" ? <><Loader2 size={12} className="animate-spin" /> Saving...</> : saveStatus === "saved" ? <><Check size={12} /> Saved</> : <><Save size={12} /> Save Changes</>}
           </button>
        </div>
      </header>

      {/* Info Notification - Combined Nico-Ichi purpose */}
      <div className="mb-12 p-6 bg-azure-500/5 border border-azure-500/20 flex gap-4 items-start">
         <Info size={16} className="text-azure-400 shrink-0 mt-1" />
         <p className="text-[10px] tracking-widest leading-relaxed text-white/60 uppercase">
           ファイルを登録しておけば、名刺やバーチャル背景のQRコードをスキャンした相手に、プロフィールと同時にこれらの資料が自動で一発配布されます。商談用背景のダウンロードと配布資料の編集がこの一画面で完結します。
           <span className="block mt-2 text-white/40 text-[9px]">
             * Note: Changes saved here are reflected instantly when clients scan either your physical card or zoom background. / 変更は即座に反映されます。
           </span>
         </p>
      </div>

      {/* Two Column Integrated Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Shared Links list (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-white/5 bg-white/[0.01] p-6 space-y-6 rounded-lg">
            <div className="mb-4">
              <h3 className="text-xs tracking-[0.4em] uppercase font-bold text-emerald-400">Configure Shared Documents / 配布資料設定</h3>
              <p className="text-[7px] tracking-[0.2em] text-white/30 uppercase mt-1">Upload & Link Materials</p>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                 {links.map((link, index) => (
                   <motion.div 
                     key={index} 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                     className="p-6 bg-white/[0.02] border border-white/5 space-y-6 relative group rounded"
                   >
                      <button 
                        type="button" 
                        onClick={() => removeLink(index)}
                        className="absolute top-4 right-4 p-2 text-white/20 hover:text-rose-500 transition-colors"
                      >
                        <RotateCcw size={14} className="rotate-45" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                         <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[7px] tracking-[0.3em] uppercase opacity-40 font-bold">
                              <FileText size={10} /> Title / 資料名
                            </label>
                            <input 
                              type="text" value={link.title} 
                              onChange={(e) => updateLink(index, "title", e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none text-white rounded-sm" 
                              placeholder="e.g. Company Brochure / 会社案内" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[7px] tracking-[0.3em] uppercase opacity-40 font-bold">
                               <LinkIcon size={10} /> URL (PDF or Web)
                            </label>
                            <input 
                              type="text" value={link.url} 
                              onChange={(e) => updateLink(index, "url", e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none text-white rounded-sm" 
                              placeholder="https://..." 
                            />
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </AnimatePresence>
              
              <button 
                type="button" 
                onClick={addLink}
                className="w-full py-6 border border-dashed border-white/10 text-[9px] tracking-[0.4em] uppercase text-white/30 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-3 rounded"
              >
                <Upload size={14} /> Add New Link / 資料を追加
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Virtual Background Generator widget (lg:col-span-5) */}
        <div className="lg:col-span-5">
           {userSlug && (
             <BackgroundGenerator userSlug={userSlug} equippedZoomBg={equippedZoomBg} />
           )}
        </div>
      </div>
    </div>
  );
}
