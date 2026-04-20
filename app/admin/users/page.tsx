"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Crown, User as UserIcon, Lock, Search, Filter } from "lucide-react";

export default function UsersAdminPage() {
  const [search, setSearch] = useState("");
  const [filterRank, setFilterRank] = useState("All");

  const [users] = useState([
    { name: "Nox", email: "str1yf5x@gmail.com", rank: "Architect", role: "chief_officer", rt: "1,000,000" },
    { name: "Sera", email: "sera@black.net", rank: "Black Tier", role: "member", rt: "24,000" },
    { name: "Kenta", email: "kenta@test.com", rank: "Initiate", role: "member", rt: "1,200" },
    { name: "Admin_A", email: "a@hxc.sys", rank: "Sentinel", role: "architect", rt: "50,000" },
  ]);

  const filteredUsers = users.filter(u => 
    (filterRank === "All" || u.rank === filterRank) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const rankIcon = (rank: string) => {
    switch (rank) {
      case "Architect": return <Lock size={14} className="text-white" />;
      case "Sentinel": return <Shield size={14} className="opacity-60" />;
      case "Black Tier": return <Crown size={14} className="text-amber-400 opacity-80" />;
      default: return <UserIcon size={14} className="opacity-20" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-2xl tracking-[0.5em] uppercase mb-2">Soul Hierarchy</h1>
          <p className="text-[10px] tracking-widest text-gothic-silver opacity-40 uppercase">Registry of the Inhabitants</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={14} />
            <input 
              type="text" 
              placeholder="Search identity..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gothic-dark/30 border border-moonlight/10 p-3 pl-12 text-[10px] tracking-widest uppercase outline-none focus:border-moonlight transition-all w-full md:w-64"
            />
          </div>
          {/* Filter Chips */}
          <div className="flex gap-2">
            {["All", "Architect", "Black Tier", "Initiate"].map((r) => (
              <button 
                key={r}
                onClick={() => setFilterRank(r)}
                className={`px-4 py-2 border text-[8px] uppercase tracking-widest transition-all ${filterRank === r ? 'border-moonlight bg-white/5' : 'border-moonlight/10 opacity-40 hover:opacity-100'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-5 p-4 border-b border-moonlight/10 text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2">
         <div>Identity</div>
         <div>Rank / Classification</div>
         <div>Stored RT</div>
         <div>Privilege</div>
         <div className="text-right">Action</div>
      </div>

      <div className="space-y-1">
        <AnimatePresence>
          {filteredUsers.map((u, i) => (
            <motion.div
              key={u.email}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-5 p-5 bg-gothic-dark/10 border border-transparent hover:border-moonlight/5 transition-all items-center"
            >
              <div className="flex flex-col">
                <span className="text-xs tracking-widest uppercase font-bold">{u.name}</span>
                <span className="text-[9px] opacity-20 lowercase">{u.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase">
                 {rankIcon(u.rank)}
                 <span className={u.rank === "Architect" ? "title-mythic" : u.rank === "Black Tier" ? "title-epic" : ""}>{u.rank}</span>
              </div>
              <div className="font-mono text-xs opacity-50">{u.rt}</div>
              <div className="text-[9px] uppercase tracking-widest opacity-40">{u.role}</div>
              <div className="text-right">
                 <button onClick={() => window.location.href = `/admin/override?user=${u.email}`} className="text-[8px] uppercase tracking-widest underline underline-offset-4 opacity-40 hover:opacity-100 transition-opacity">Override</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
