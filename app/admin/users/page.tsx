"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Crown, User as UserIcon, Lock, Search, Sparkles, AlertCircle, Eye, Wallet, Package, Trophy } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  rank: string;
  role: string;
  rt: string;
  exp: string;
  owned_assets: string[];
  unlocked_titles: string[];
}

export default function UsersAdminPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRank] = useState("All");
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // モーダル用
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [grantAmount, setGrantAmount] = useState<number>(1000);
  const [inspectUser, setInspectUser] = useState<UserData | null>(null);

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
    (filterRole === "All" || u.role === filterRole) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const roleIcon = (role: string) => {
    switch (role) {
      case "mastermind": return <Crown size={14} className="text-purple-500" />;
      case "chief_officer": return <Crown size={14} className="text-rose-500" />;
      case "architect": return <Lock size={14} className="text-emerald-400" />;
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
        alert(`${selectedUser.name} に ${grantAmount} CP を発行しました。`);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateRole = async (userId: string, newRole: string, grantChiefTitle: boolean = false) => {
    try {
      const res = await fetch("/api/admin/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole, grantChiefTitle }),
      });
      if (res.ok) {
        alert("Identity authority updated.");
        setInspectUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Update failed");
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen relative">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-2xl tracking-[0.5em] uppercase mb-2 flex items-center gap-4">
            <Shield className="text-azure-400 opacity-50" size={24} /> Identity Registry
          </h1>
          <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase">Hexa Protocol / ユーザー登録・権限管理</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={14} />
            <input 
              type="text" 
              placeholder="ユーザーを検索..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 p-3 pl-12 text-[10px] tracking-widest uppercase outline-none focus:border-azure-500 transition-all w-full md:w-64"
            />
          </div>
          <div className="flex gap-2">
            {["All", "mastermind", "chief_officer", "architect", "black_member", "member"].map((r) => (
              <button 
                key={r}
                onClick={() => setFilterRank(r)}
                className={`px-4 py-2 border text-[8px] uppercase tracking-widest transition-all ${filterRole === r ? 'border-azure-500 bg-azure-500/10 text-azure-400' : 'border-white/10 opacity-40 hover:opacity-100'}`}
              >
                {r === "All" ? "すべて" : r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="py-32 text-center text-[10px] uppercase tracking-widest opacity-20 animate-pulse">アーカイブにアクセス中...</div>
      ) : (
        <>
          <div className="grid grid-cols-6 p-4 border-b border-white/10 text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2 font-bold">
             <div className="col-span-2">ユーザー</div>
             <div>権限</div>
             <div>保有トークン (RT) / EXP</div>
             <div>アセット / 称号</div>
             <div className="text-right">操作</div>
          </div>

          <div className="space-y-1">
            <AnimatePresence>
              {filteredUsers.map((u) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-6 p-5 bg-white/[0.02] border border-transparent hover:border-white/10 transition-all items-center"
                >
                  <div className="flex flex-col col-span-2">
                    <span className="text-xs tracking-widest uppercase font-bold">{u.name || "Unknown"}</span>
                    <span className="text-[9px] opacity-20 lowercase">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase">
                     {roleIcon(u.role)}
                     <span className={u.role === "chief_officer" ? "text-rose-500 font-bold" : u.role === "architect" ? "text-emerald-400" : ""}>{u.role.replace('_', ' ')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="font-mono text-xs opacity-50 text-azure-400">{parseInt(u.rt).toLocaleString()} <span className="text-[8px] opacity-40">RT</span></div>
                    <div className="font-mono text-[9px] opacity-20">{parseInt(u.exp || '0').toLocaleString()} <span className="text-[7px]">EXP</span></div>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-1.5 opacity-40" title="保有アセット">
                        <Package size={10} />
                        <span className="text-[9px] font-mono">{u.owned_assets?.length || 0}</span>
                     </div>
                     <div className="flex items-center gap-1.5 opacity-40" title="獲得称号">
                        <Trophy size={10} />
                        <span className="text-[9px] font-mono">{u.unlocked_titles?.length || 0}</span>
                     </div>
                  </div>
                  <div className="flex justify-end gap-3">
                     <button onClick={() => setInspectUser(u)} className="p-2 border border-white/5 hover:bg-white/5 transition-all text-white/40 hover:text-white" title="詳細表示">
                        <Eye size={12} />
                     </button>
                     <button onClick={() => setSelectedUser(u)} className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-azure-400 border border-azure-500/20 px-3 py-1.5 hover:bg-azure-500/10 transition-all">
                       <Sparkles size={10} /> RT発行
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Issue CP Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-void/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl">
              <h2 className="text-xl tracking-[0.3em] uppercase mb-8 text-azure-400 font-light flex items-center gap-3">
                <Wallet size={20} /> Relation Token の発行
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[8px] uppercase opacity-40 tracking-widest block mb-2">対象ユーザー: {selectedUser.name}</label>
                  <input type="number" value={grantAmount} onChange={(e) => setGrantAmount(Number(e.target.value))} className="w-full bg-void border border-white/10 p-4 text-azure-400 tracking-widest outline-none focus:border-azure-400 font-mono text-xl" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setSelectedUser(null)} className="flex-1 py-4 border border-white/10 text-[9px] uppercase tracking-widest hover:bg-white/5 transition-colors">キャンセル</button>
                  <button onClick={handleGrantRT} className="flex-1 py-4 bg-azure-600 text-white font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-azure-500 transition-colors shadow-lg">発行を確定</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inspect Identity Modal */}
      <AnimatePresence>
        {inspectUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-void/95 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 p-10 shadow-2xl relative max-h-[80vh] overflow-y-auto custom-scrollbar">
               <button onClick={() => setInspectUser(null)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">✕</button>
               
               <header className="mb-10">
                  <p className="text-[8px] tracking-[0.5em] uppercase text-azure-400 font-bold mb-2">ユーザー詳細検査</p>
                  <h2 className="text-3xl tracking-[0.2em] uppercase font-extralight">{inspectUser.name}</h2>
                  <p className="text-[10px] opacity-40 font-mono mt-1">{inspectUser.id}</p>
               </header>

               <div className="grid grid-cols-2 gap-12">
                  <section className="space-y-6">
                     <h3 className="text-[10px] tracking-[0.3em] uppercase opacity-40 border-b border-white/5 pb-2 flex items-center gap-2"><Trophy size={12}/> 獲得済み称号</h3>
                     <div className="flex flex-wrap gap-2">
                        {inspectUser.unlocked_titles?.length > 0 ? inspectUser.unlocked_titles.map(t => (
                           <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] tracking-widest uppercase text-white/60">{t}</span>
                        )) : <span className="text-[9px] opacity-20 uppercase italic">獲得称号なし</span>}
                     </div>
                  </section>

                  <section className="space-y-6">
                     <h3 className="text-[10px] tracking-[0.3em] uppercase opacity-40 border-b border-white/5 pb-2 flex items-center gap-2"><Package size={12}/> 保有アセット</h3>
                     <div className="flex flex-wrap gap-2">
                        {inspectUser.owned_assets?.length > 0 ? inspectUser.owned_assets.map(a => (
                           <span key={a} className="px-3 py-1 bg-azure-500/5 border border-azure-500/20 text-[9px] tracking-widest uppercase text-azure-400">{a}</span>
                        )) : <span className="text-[9px] opacity-20 uppercase italic">保有アセットなし</span>}
                     </div>
                  </section>
               </div>

               {/* Admin Controls */}
               <div className="mt-12 pt-10 border-t border-white/5 space-y-6">
                  <h3 className="text-[10px] tracking-[0.3em] uppercase opacity-40 flex items-center gap-2"><Crown size={12}/> 特権管理操作</h3>
                  <div className="flex flex-wrap gap-4">
                     {inspectUser.role !== 'mastermind' && (
                        <button 
                           onClick={() => handleUpdateRole(inspectUser.id, 'mastermind', true)}
                           className="px-6 py-3 border border-purple-500/30 text-purple-400 text-[9px] uppercase tracking-widest font-bold hover:bg-purple-500/10 transition-all"
                        >
                           Mastermind に昇格
                        </button>
                     )}
                     {inspectUser.role !== 'chief_officer' && (
                        <button 
                           onClick={() => handleUpdateRole(inspectUser.id, 'chief_officer', true)}
                           className="px-6 py-3 border border-rose-500/30 text-rose-500 text-[9px] uppercase tracking-widest font-bold hover:bg-rose-500/10 transition-all"
                        >
                           Chief Officer に昇格
                        </button>
                     )}
                     {inspectUser.role !== 'architect' && (
                        <button 
                           onClick={() => handleUpdateRole(inspectUser.id, 'architect')}
                           className="px-6 py-3 border border-emerald-500/30 text-emerald-400 text-[9px] uppercase tracking-widest font-bold hover:bg-emerald-500/10 transition-all"
                        >
                           Architect 権限を付与
                        </button>
                     )}
                     {inspectUser.role !== 'black_member' && (
                        <button 
                           onClick={() => handleUpdateRole(inspectUser.id, 'black_member')}
                           className="px-6 py-3 border border-amber-500/30 text-amber-500 text-[9px] uppercase tracking-widest font-bold hover:bg-amber-500/10 transition-all"
                        >
                           Black Member に設定
                        </button>
                     )}
                     {inspectUser.role !== 'member' && (
                        <button 
                           onClick={() => handleUpdateRole(inspectUser.id, 'member')}
                           className="px-6 py-3 border border-white/10 text-white/40 text-[9px] uppercase tracking-widest font-bold hover:bg-white/5 transition-all"
                        >
                           Member に降格
                        </button>
                     )}
                  </div>
               </div>

               <div className="mt-12 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-center bg-white/[0.02] p-6 border border-white/5">
                     <div>
                        <p className="text-[8px] uppercase tracking-[0.4em] opacity-40 mb-1">アカウント作成日</p>
                        <p className="text-[10px] tracking-widest uppercase font-mono">{new Date((inspectUser as any).created_at).toLocaleDateString()}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] uppercase tracking-[0.4em] opacity-40 mb-1">保有トークン / 累計EXP</p>
                        <p className="text-xl tracking-widest font-mono text-azure-400">{parseInt(inspectUser.rt).toLocaleString()} RT</p>
                        <p className="text-[10px] tracking-widest font-mono opacity-20">{parseInt(inspectUser.exp || '0').toLocaleString()} EXP</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
