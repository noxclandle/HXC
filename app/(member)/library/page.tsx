"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Lock, Search, LayoutGrid, Network } from "lucide-react";
import Link from "next/link";
import ConstellationView from "@/components/ui/ConstellationView";

export default function LibraryPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "hierarchy">("list");

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch("/api/contacts/list");
        if (!res.ok) throw new Error("Offline");
        const data = await res.json();
        setContacts(data.map((c: any) => ({ ...c, x: c.coord_x, y: c.coord_y })));
      } catch (err) {
        setContacts([
          { id: 1, name: "Sample CEO", handle: "PREZ", role: "CEO", coord: "VOID-01", x: 30, y: 30, notes: "Hexa Corp", ai_tags: ["High-Value"] },
          { id: 2, name: "Alpha Engineer", handle: "TECH", role: "CTO", coord: "VOID-02", x: 70, y: 60, notes: "Hexa Corp", ai_tags: ["Technical"] },
        ]);
      } finally { setLoading(false); }
    }
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const companies = Array.from(new Set(filteredContacts.map(c => c.notes || "Independent")));

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="animate-pulse text-[10px] tracking-[0.6em] uppercase opacity-20">Accessing Archive...</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pt-24 px-4 lg:px-6 pb-24">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl tracking-[0.4em] uppercase mb-2 text-white">Identity Index</h1>
          <p className="text-[10px] tracking-widest opacity-40 uppercase italic">名刺索引・保存されたネットワーク</p>
        </div>
        <Link href="/scan" className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-4 border border-white/10 hover:border-white/30 transition-all text-[10px] uppercase tracking-widest bg-white/5 text-white">
          <Plus size={14} /> Scan New Card
        </Link>
      </header>

      {/* View Mode & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="flex gap-8 border-b border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
           <button onClick={() => setViewMode("list")} className={`pb-4 flex items-center gap-2 text-[9px] uppercase tracking-widest transition-all whitespace-nowrap ${viewMode === 'list' ? 'text-white border-b border-white' : 'opacity-20'}`}>
             <LayoutGrid size={12}/> Index List
           </button>
           <button onClick={() => setViewMode("hierarchy")} className={`pb-4 flex items-center gap-2 text-[9px] uppercase tracking-widest transition-all whitespace-nowrap ${viewMode === 'hierarchy' ? 'text-white border-b border-white' : 'opacity-20'}`}>
             <Network size={12}/> Organization
           </button>
        </div>
        <div className="relative group w-full md:w-64">
           <Search className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20" size={12} />
           <input type="text" placeholder="SEARCH ARCHIVE..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-b border-white/10 py-2 pl-6 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-all placeholder:opacity-20 text-white" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "hierarchy" ? (
          <motion.div key="hierarchy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-16">
            {companies.map(company => (
              <div key={company} className="space-y-6">
                <h3 className="text-[10px] tracking-[0.5em] uppercase opacity-30 border-l-2 border-moonlight/20 pl-6 font-bold">{company}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                  {filteredContacts.filter(c => (c.notes || "Independent") === company).map(c => (
                    <div key={c.id} onClick={() => setSelectedContact(c)} className="p-6 bg-gothic-dark/20 border border-moonlight/5 hover:border-moonlight/20 transition-all cursor-pointer flex justify-between items-center group">
                       <span className="text-xs tracking-widest uppercase group-hover:text-white transition-colors">{c.name}</span>
                       <span className="text-[8px] opacity-40 uppercase tracking-tighter">{c.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContacts.map((c, i) => (
              <div key={c.id} onClick={() => setSelectedContact(c)} className="p-6 border border-moonlight/5 bg-gothic-dark/20 hover:border-moonlight/20 transition-all group cursor-pointer flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 border border-moonlight/10 flex items-center justify-center text-[11px] group-hover:border-moonlight/30 transition-all relative overflow-hidden bg-void">
                    {c.photo ? <img src={c.photo} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100" /> : <span className="opacity-20">{c.handle}</span>}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm tracking-[0.2em] uppercase">{c.name}</h3>
                      {c.ai_tags?.includes("High-Value") && <span className="text-[6px] px-2 py-0.5 bg-amber-500/20 text-amber-500/80 border border-amber-500/10 uppercase tracking-widest font-bold">High-Value</span>}
                    </div>
                    <p className="text-[9px] opacity-40 uppercase tracking-[0.1em]">{c.role} • {c.coord}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-void/90 backdrop-blur-xl flex items-center justify-center p-8">
            <div className="w-full max-w-lg bg-gothic-dark border border-moonlight/10 p-12 relative shadow-2xl">
               <button onClick={() => setSelectedContact(null)} className="absolute top-6 right-8 opacity-20 hover:opacity-100 transition-opacity"><X size={20} /></button>
               <header className="mb-12">
                 <p className="text-[8px] tracking-[0.4em] uppercase opacity-40 mb-2">{selectedContact.coord}</p>
                 <h2 className="text-2xl tracking-[0.2em] uppercase">{selectedContact.name}</h2>
                 <p className="text-[10px] tracking-widest opacity-40 uppercase">{selectedContact.role}</p>
               </header>
               <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest opacity-20 flex items-center gap-2"><Lock size={12}/> Private Notes</label>
                    <textarea defaultValue={selectedContact.notes} className="w-full bg-void/50 border border-moonlight/5 p-4 text-[11px] tracking-widest leading-relaxed focus:border-moonlight/30 outline-none h-32 resize-none uppercase" />
                  </div>
                  <button className="w-full py-4 bg-moonlight text-void text-[10px] font-bold uppercase tracking-[0.4em]">Etch into Archive</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
