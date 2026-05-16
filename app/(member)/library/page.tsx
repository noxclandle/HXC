"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Mail, Phone, MapPin, Calendar, ArrowLeft, Filter, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";

interface Contact {
  id: string;
  name: string;
  handle_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
}

export default function LibraryPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/contacts/list")
      .then(res => res.json())
      .then(data => {
        setContacts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.handle_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-void text-moonlight pt-24 pb-24 px-4 md:px-8">
      <header className="max-w-6xl mx-auto mb-12">
        <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> Back to Home
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl tracking-[0.3em] md:tracking-[0.5em] uppercase font-extralight text-white mb-2">Contacts</h1>
            <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold">名刺帳・ライブラリ</p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-azure-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Identity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 p-4 pl-12 text-[11px] tracking-widest focus:border-azure-500/40 outline-none transition-all uppercase"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-white/5 border-t-white/40 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[10px] tracking-[1em] uppercase opacity-20 ml-[1em]">Synchronizing Archive</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 border border-dashed border-white/5 text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase opacity-20 italic">No identities found in this coordinate.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 bg-white/[0.01] border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-[12px] opacity-40 group-hover:text-azure-400 group-hover:border-azure-500/40 transition-all uppercase">
                      {c.name[0]}
                    </div>
                    <button className="opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      {c.handle_name && <p className="text-[8px] tracking-widest text-azure-400 font-bold uppercase mb-1">{c.handle_name}</p>}
                      <h3 className="text-[14px] tracking-[0.2em] uppercase text-white font-light group-hover:tracking-[0.3em] transition-all">{c.name}</h3>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-white/5">
                      {c.email && (
                        <div className="flex items-center gap-3 opacity-30 group-hover:opacity-60 transition-opacity">
                          <Mail size={12} />
                          <span className="text-[9px] tracking-widest truncate">{c.email}</span>
                        </div>
                      )}
                      {c.phone && (
                        <div className="flex items-center gap-3 opacity-30 group-hover:opacity-60 transition-opacity">
                          <Phone size={12} />
                          <span className="text-[9px] tracking-widest">{c.phone}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-[8px] tracking-widest opacity-20 uppercase font-mono mt-4 flex items-center gap-2">
                      <Calendar size={10} /> {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
