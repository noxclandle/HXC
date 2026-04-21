"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Crown, User as UserIcon, Lock, Search, Sparkles, AlertCircle } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  rank: string;
  role: string;
  rt: string;
}

export default function UsersAdminPage() {
  const [search, setSearch] = useState("");
  const [filterRank, setFilterRank] = useState("All");
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // RT付与モーダル用
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [grantAmount, setGrantAmount] = useState<number>(1000);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/user/list");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    (filterRank === "All" || u.rank === filterRank) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const rankIcon = (rank: string) => {
    switch (rank) {
      case "Architect": return <Lock size={14} className="text-emerald-400" />;
      case "Sentinel": return <Shield size={14} className="opacity-60" />;
      case "Black Tier": return <Crown size={14} className="text-amber-400 opacity-80" />;
      default: return <UserIcon size={14} className="opacity-20" />;
    }
  };

  const handleGrantRT = async () => {
    if (!selectedUser || !grantAmount) return;
    
    try {
      const res = await fetch("/api/admin/user/grant-rt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, amount: grantAmount }),
      });
      
      if (res.ok) {
        alert(`${selectedUser.name} に ${grantAmount} RT を授与しました。`);
        setSelectedUser(null);
        fetchUsers(); // 更新
      } else {
        alert("RTの授与に失敗しました。");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen relative">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-2xl tracking-[0.5em] uppercase mb-2 flex items-center gap-4">
            <Lock className="text-emerald-400 opacity-50" size={24} /> Soul Hierarchy
          </h1>
          <p className="text-[10px] tracking-widest text-emerald-400 opacity-40 uppercase">Registry of the Inhabitants / Chief Officer Override</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={14} />
            <input 
              type="text" 
              placeholder="Search identity..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gothic-dark/30 border border-emerald-500/20 p-3 pl-12 text-[10px] tracking-widest uppercase outline-none focus:border-emerald-500 transition-all w-full md:w-64"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Architect", "Black Tier", "Initiate"].map((r) => (
              <button 
                key={r}
                onClick={() => setFilterRank(r)}
                className={`px-4 py-2 border text-[8px] uppercase tracking-widest transition-all ${filterRank === r ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-moonlight/10 opacity-40 hover:opacity-100'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="py-32 text-center text-[10px] uppercase tracking-widest opacity-20 animate-pulse">Loading Archives...</div>
      ) : (
        <>
          <div className="grid grid-cols-5 p-4 border-b border-emerald-500/20 text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2 font-bold">
             <div>Identity</div>
             <div>Rank / Classification</div>
             <div>Stored RT</div>
             <div>Privilege</div>
             <div className="text-right">Action</div>
          </div>

          <div className="space-y-1">
            <AnimatePresence>
              {filteredUsers.map((u) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-5 p-5 bg-emerald-500/5 border border-transparent hover:border-emerald-500/20 transition-all items-center"
                >
                  <div className="flex flex-col">
                    <span className="text-xs tracking-widest uppercase font-bold">{u.name || "Unknown"}</span>
                    <span className="text-[9px] opacity-20 lowercase">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase">
                     {rankIcon(u.rank)}
                     <span className={u.rank === "Architect" ? "text-emerald-400 font-bold" : u.rank === "Black Tier" ? "text-amber-400" : ""}>{u.rank}</span>
                  </div>
                  <div className="font-mono text-xs opacity-50 text-emerald-400">{parseInt(u.rt).toLocaleString()} <span className="text-[8px] opacity-40">RT</span></div>
                  <div className="text-[9px] uppercase tracking-widest opacity-40">{u.role}</div>
                  <div className="flex justify-end gap-4">
                     <button 
                       onClick={() => setSelectedUser(u)} 
                       className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-emerald-400 border border-emerald-500/20 px-3 py-1.5 hover:bg-emerald-500/10 transition-all"
                     >
                       <Sparkles size={10} /> Grant RT
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Grant RT Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-void/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-gothic-dark border border-emerald-500/30 p-8 shadow-[0_0_50px_rgba(52,211,153,0.1)] relative"
            >
              <h2 className="text-xl tracking-[0.3em] uppercase mb-2 text-emerald-400 font-light flex items-center gap-3">
                <Crown size={20} /> Grant Resonance
              </h2>
              <p className="text-[9px] tracking-widest opacity-40 uppercase mb-8 leading-relaxed">
                対象: <strong className="text-white opacity-100">{selectedUser.name}</strong><br />
                チーフオフィサーの権限により、対象の魂にエネルギーを直接付与します。
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-[8px] uppercase opacity-40 tracking-widest block mb-2">Amount to Grant</label>
                  <input 
                    type="number" 
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(Number(e.target.value))}
                    className="w-full bg-void border border-emerald-500/30 p-4 text-emerald-400 tracking-widest outline-none focus:border-emerald-400 font-mono text-xl"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setSelectedUser(null)} className="flex-1 py-4 border border-moonlight/10 text-[9px] uppercase tracking-widest hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={handleGrantRT} className="flex-1 py-4 bg-emerald-500 text-void font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-400 transition-colors shadow-lg">Confirm Grant</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
