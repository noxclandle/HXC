"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Send, Activity } from "lucide-react";
import { useToast } from "@/components/ui/ResonanceToast";

export default function AdminNewsPage() {
  const { showToast } = useToast();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", type: "update" });

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/admin/news/list");
      if (res.ok) setNews(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    setIsPublishing(true);
    try {
      const res = await fetch("/api/admin/news/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showToast("Broadcast transmitted / 配信を完了しました", "success");
        setFormData({ title: "", content: "", type: "update" });
        fetchNews();
      } else {
        showToast("Transmission failed / 配信に失敗しました", "error");
      }
    } catch (err) { console.error(err); }
    finally { setIsPublishing(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? / 本当に削除しますか？")) return;
    try {
      const res = await fetch("/api/admin/news/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast("Record purged / 削除しました", "info");
        fetchNews();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-6xl mx-auto p-12">
      <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl tracking-[0.4em] uppercase font-light mb-2 flex items-center gap-4">
             <Activity size={24} className="text-azure-400" />
             System Broadcast
          </h1>
          <p className="text-[10px] tracking-[0.2em] opacity-40 uppercase font-bold">全ユーザー向けお知らせ配信</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Form */}
         <div className="lg:col-span-5 space-y-6">
            <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold border-b border-white/5 pb-2">New Transmission / 新規作成</h2>
            <form onSubmit={handlePublish} className="space-y-6 p-8 border border-white/5 bg-white/[0.02]">
               <div className="space-y-2">
                 <label className="text-[9px] tracking-[0.3em] uppercase opacity-60">Classification / 種別</label>
                 <select 
                   value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                   className="w-full bg-black/50 border border-white/10 p-3 text-xs uppercase tracking-widest outline-none focus:border-azure-500 transition-all"
                 >
                   <option value="update">System Update (アップデート)</option>
                   <option value="event">Event (イベント)</option>
                   <option value="alert">Alert (重要なお知らせ)</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] tracking-[0.3em] uppercase opacity-60">Header / タイトル</label>
                 <input 
                   type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                   className="w-full bg-black/50 border border-white/10 p-3 text-sm outline-none focus:border-azure-500 transition-all placeholder:opacity-20"
                   placeholder="Enter transmission header..."
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] tracking-[0.3em] uppercase opacity-60">Payload / 本文</label>
                 <textarea 
                   required rows={8} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
                   className="w-full bg-black/50 border border-white/10 p-3 text-sm outline-none focus:border-azure-500 transition-all resize-none placeholder:opacity-20"
                   placeholder="Enter transmission payload..."
                 />
               </div>
               <button 
                 type="submit" disabled={isPublishing}
                 className="w-full py-4 bg-azure-600/20 text-azure-400 border border-azure-500/50 hover:bg-azure-500 hover:text-white transition-all text-[10px] tracking-[0.5em] uppercase font-bold flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 <Send size={14} />
                 {isPublishing ? "Transmitting..." : "Broadcast / 配信"}
               </button>
            </form>
         </div>

         {/* Log */}
         <div className="lg:col-span-7 space-y-6">
            <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold border-b border-white/5 pb-2">Transmission Log / 配信履歴</h2>
            {loading ? (
               <div className="py-12 text-center text-[10px] opacity-20 tracking-[1em] uppercase animate-pulse">Loading Archives...</div>
            ) : news.length === 0 ? (
               <div className="py-12 text-center text-[10px] opacity-20 tracking-[1em] uppercase">No Transmissions Found</div>
            ) : (
               <div className="space-y-4">
                 {news.map(item => (
                   <div key={item.id} className="p-6 border border-white/5 bg-white/[0.01] hover:border-white/20 transition-all group flex justify-between items-start">
                     <div className="space-y-2 pr-8">
                       <div className="flex items-center gap-4 mb-2">
                         <span className={`text-[8px] tracking-[0.2em] uppercase font-bold px-2 py-0.5 border ${
                           item.type === 'alert' ? 'border-rose-500 text-rose-400 bg-rose-500/10' : 
                           item.type === 'event' ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 
                           'border-azure-500 text-azure-400 bg-azure-500/10'
                         }`}>
                           {item.type}
                         </span>
                         <span className="text-[10px] tracking-widest opacity-40 font-mono">
                           {new Date(item.created_at).toLocaleDateString()}
                         </span>
                       </div>
                       <h3 className="text-sm font-bold tracking-widest">{item.title}</h3>
                       <p className="text-xs opacity-60 whitespace-pre-wrap leading-relaxed">{item.content}</p>
                     </div>
                     <button onClick={() => handleDelete(item.id)} className="p-2 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all text-white/20" title="Delete">
                       <Trash2 size={14} />
                     </button>
                   </div>
                 ))}
               </div>
            )}
         </div>
      </div>
    </div>
  );
}