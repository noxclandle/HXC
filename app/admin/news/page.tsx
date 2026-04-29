"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Plus, Save, Trash2, ArrowLeft, Send, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

export default function NewsAdminPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setIsSaving] = useState(false);
  
  const [form, setForm] = useState({ title: "", content: "", type: "update" });

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/admin/news/list");
      if (res.ok) setNews(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/news/publish", {
        method: "POST",
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ title: "", content: "", type: "update" });
        fetchNews();
      }
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement permanently?")) return;
    try {
      await fetch(`/api/admin/news/delete`, {
        method: "POST",
        body: JSON.stringify({ id })
      });
      fetchNews();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-6xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16">
        <Link href="/admin" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> 管理ハブへ戻る
        </Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 flex items-center gap-4">
          <Activity className="text-azure-400" size={24} /> News Management
        </h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase font-bold">配信センター / お知らせ管理</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Create Form */}
        <div className="lg:col-span-5">
           <form onSubmit={handlePublish} className="p-8 border border-white/10 bg-white/[0.02] space-y-6 sticky top-12">
              <h2 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white flex items-center gap-2">
                 <Plus size={14}/> 新規お知らせ作成
              </h2>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-[8px] uppercase opacity-40 tracking-widest block mb-2">タイトル</label>
                    <input 
                      type="text" value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-3 text-[11px] tracking-widest outline-none focus:border-azure-500 transition-all text-white"
                      placeholder="アップデートのお知らせ"
                    />
                 </div>
                 <div>
                    <label className="text-[8px] uppercase opacity-40 tracking-widest block mb-2">種別</label>
                    <select 
                      value={form.type}
                      onChange={(e) => setForm({...form, type: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-3 text-[10px] tracking-widest outline-none focus:border-azure-500 transition-all text-white"
                    >
                       <option value="update">プロトコル・アップデート</option>
                       <option value="event">ネットワーク・イベント</option>
                       <option value="maintenance">システムメンテナンス</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[8px] uppercase opacity-40 tracking-widest block mb-2">本文内容</label>
                    <textarea 
                      value={form.content}
                      onChange={(e) => setForm({...form, content: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 text-[11px] tracking-widest outline-none focus:border-azure-500 transition-all h-48 resize-none text-white font-sans"
                      placeholder="詳細を記載してください..."
                    />
                 </div>
              </div>

              <button 
                type="submit" disabled={saving}
                className="w-full py-4 bg-azure-600 hover:bg-azure-500 text-white font-bold text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all"
              >
                 {saving ? "配信中..." : <><Send size={12}/> お知らせを公開する</>}
              </button>
           </form>
        </div>

        {/* History List */}
        <div className="lg:col-span-7 space-y-4">
           <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-bold mb-6">Archive / 配信履歴</h2>
           
           {loading ? (
             <div className="py-24 text-center text-[10px] opacity-10 uppercase tracking-[0.5em]">アーカイブを同期中...</div>
           ) : (
             <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="p-6 bg-white/[0.01] border border-white/[0.05] hover:border-white/20 transition-all">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <span className={`text-[7px] px-2 py-0.5 border uppercase tracking-widest font-bold ${item.type === 'update' ? 'border-azure-500/30 text-azure-400' : item.type === 'maintenance' ? 'border-rose-500/30 text-rose-400' : 'border-emerald-500/30 text-emerald-400'}`}>
                              {item.type}
                           </span>
                           <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">{item.title}</h3>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="text-white/20 hover:text-rose-500 transition-colors">
                           <Trash2 size={12} />
                        </button>
                     </div>
                     <p className="text-[10px] tracking-widest opacity-40 line-clamp-2 leading-relaxed mb-4 font-sans">
                        {item.content}
                     </p>
                     <div className="flex items-center gap-2 text-[8px] opacity-20 uppercase tracking-widest font-bold">
                        <Clock size={10} /> {new Date(item.created_at).toLocaleString()}
                     </div>
                  </div>
                ))}
                {news.length === 0 && (
                   <div className="py-24 text-center border border-dashed border-white/5 opacity-20 text-[10px] uppercase tracking-[0.5em]">公開されたお知らせはありません。</div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
