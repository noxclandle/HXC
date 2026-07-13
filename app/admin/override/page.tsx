"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, RotateCcw, Key, Zap, TrendingUp, Search } from "lucide-react";
import { logger } from "@/lib/logger";

interface UserSummary {
  id: string;
  name: string;
  handle_name?: string | null;
  email: string;
  rank: string;
  role: string;
  rt: string;
  unlocked_titles: string[];
}

export default function MasterOverridePage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [search, setSearch] = useState("");
  const [targetUser, setTargetUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/user/list");
      if (res.ok) setUsers(await res.json());
    } catch (error) {
      logger.error("Failed to fetch users for override page", { error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = search.trim()
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.handle_name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleBestowTitle = async () => {
    const input = document.getElementById("newTitleInput") as HTMLInputElement;
    const title = input?.value.trim();
    if (!targetUser || !title) return;
    try {
      const res = await fetch("/api/admin/user/grant-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUser.id, title }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.alreadyHad ? `${targetUser.name} は既に「${title}」を保有しています。` : `「${title}」を ${targetUser.name} に付与しました。`);
        input.value = "";
        fetchUsers();
      } else {
        setStatus(data.error || "称号の付与に失敗しました。");
      }
    } catch (error) {
      logger.error("Failed to bestow title", { error });
      setStatus("通信エラーが発生しました。");
    }
  };

  const handleBestowRT = async () => {
    const input = document.getElementById("rtAmountInput") as HTMLInputElement;
    const amount = Number(input?.value);
    if (!targetUser || !Number.isFinite(amount) || amount === 0) return;
    try {
      const res = await fetch("/api/admin/user/grant-rt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUser.id, amount }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(`${targetUser.name} に ${amount} RT を授与しました。新残高: ${Number(data.balance).toLocaleString()} RT`);
        input.value = "";
        fetchUsers();
      } else {
        setStatus(data.error || "RT授与に失敗しました。");
      }
    } catch (error) {
      logger.error("Failed to bestow RT", { error });
      setStatus("通信エラーが発生しました。");
    }
  };

  const handleMassGrace = async (target: string) => {
    const messageInput = document.getElementById("massMessage") as HTMLTextAreaElement;
    const amountInput = document.getElementById("massRtAmount") as HTMLInputElement;
    const amount = Number(amountInput?.value);
    if (!Number.isFinite(amount) || amount === 0) return;
    if (!confirm(`本当に ${target} 全員に ${amount} RT の恩寵を授けますか？この操作は取り消せません。`)) return;
    try {
      const res = await fetch("/api/admin/user/mass-grant-rt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rank: target === "All" ? undefined : target,
          amount,
          message: messageInput?.value || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(`${data.count} 名に恩寵を授けました。`);
        if (messageInput) messageInput.value = "";
        amountInput.value = "";
        fetchUsers();
      } else {
        setStatus(data.error || "一斉恩寵に失敗しました。");
      }
    } catch (error) {
      logger.error("Failed mass bestowal", { error });
      setStatus("通信エラーが発生しました。");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-12 bg-void min-h-screen text-moonlight">
      <header className="mb-12 border-b border-moonlight/10 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <Key className="text-moonlight animate-pulse" size={24} />
          <h1 className="text-xl tracking-[0.6em] uppercase font-bold">Chief Officer Override</h1>
        </div>
        <p className="text-[10px] tracking-widest opacity-40 uppercase">Caution: Direct modification of the ledger.</p>
        {status && (
          <p className="mt-4 text-[10px] tracking-widest text-azure-400 uppercase border border-azure-500/20 bg-azure-500/5 p-3">{status}</p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40">Target Soul</h2>

            {targetUser ? (
              <div className="p-6 border border-moonlight/20 bg-gothic-dark/20 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm tracking-widest uppercase font-bold">{targetUser.name}</p>
                    <p className="text-[9px] opacity-40 lowercase">{targetUser.email}</p>
                  </div>
                  <button
                    onClick={() => { setTargetUser(null); setSearch(""); }}
                    className="text-[8px] uppercase tracking-widest px-3 py-1.5 border border-moonlight/10 hover:bg-white/5 transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw size={10} /> Reset
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px] uppercase tracking-widest pt-2 border-t border-moonlight/10">
                  <div><span className="opacity-30 block">Rank</span>{targetUser.rank}</div>
                  <div><span className="opacity-30 block">Role</span>{targetUser.role}</div>
                  <div><span className="opacity-30 block">RT</span>{Number(targetUser.rt).toLocaleString()}</div>
                </div>
                {targetUser.unlocked_titles?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {targetUser.unlocked_titles.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-white/5 border border-white/10 text-[7px] tracking-widest uppercase opacity-60">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={14} />
                  <input
                    type="text"
                    placeholder="氏名・メールアドレスで検索..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gothic-dark/50 border border-moonlight/10 p-3 pl-11 text-xs tracking-widest focus:border-moonlight outline-none transition-all"
                  />
                </div>
                {loading ? (
                  <p className="text-[9px] uppercase tracking-widest opacity-20 animate-pulse">アーカイブにアクセス中...</p>
                ) : search.trim() && (
                  <div className="border border-moonlight/10 max-h-72 overflow-y-auto">
                    {filtered.length > 0 ? filtered.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => { setTargetUser(u); setStatus(null); }}
                        className="w-full text-left p-3 border-b border-moonlight/5 last:border-0 hover:bg-white/5 transition-all"
                      >
                        <p className="text-xs tracking-widest uppercase">{u.name}</p>
                        <p className="text-[9px] opacity-30 lowercase">{u.email}</p>
                      </button>
                    )) : (
                      <p className="p-4 text-[9px] uppercase tracking-widest opacity-20">該当する魂は見つかりません。</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-8">
          <div className="p-8 border border-moonlight/10 bg-gothic-dark/10">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <Zap size={14} className="text-moonlight" /> Bestow Title
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="ENTER TITLE"
                id="newTitleInput"
                disabled={!targetUser}
                className="flex-1 bg-void border border-moonlight/10 p-2 text-[10px] tracking-widest uppercase focus:border-moonlight outline-none disabled:opacity-30"
              />
              <button
                onClick={handleBestowTitle}
                disabled={!targetUser}
                className="px-4 py-2 border border-moonlight/30 text-[8px] uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-20 disabled:pointer-events-none"
              >
                Bestow
              </button>
            </div>
            <p className="text-[7px] opacity-20 uppercase tracking-[0.2em]">
              {targetUser ? "Title will be directly etched into the user's soul record." : "Select a target soul first."}
            </p>
          </div>

          <div className="p-8 border border-moonlight/10 bg-gothic-dark/10">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <TrendingUp size={14} className="text-moonlight" /> Bestow Master Grace (RT)
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                placeholder="AMOUNT"
                id="rtAmountInput"
                disabled={!targetUser}
                className="flex-1 bg-void border border-moonlight/10 p-2 text-[10px] tracking-widest focus:border-moonlight outline-none font-mono disabled:opacity-30"
              />
              <button
                onClick={handleBestowRT}
                disabled={!targetUser}
                className="px-6 py-2 bg-moonlight text-void text-[8px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(224,224,224,0.3)] disabled:opacity-20 disabled:pointer-events-none disabled:shadow-none"
              >
                Bestow Grace
              </button>
            </div>
            <p className="text-[7px] opacity-20 uppercase tracking-[0.2em]">
              {targetUser ? "The target soul will receive a shower of moonlit dust." : "Select a target soul first."}
            </p>
          </div>

          <div className="p-8 border border-moonlight/10 bg-gothic-dark/10">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <Zap size={14} className="text-moonlight" /> Mass Grace (Global Bestowal)
            </h2>
            <div className="space-y-4">
              <textarea
                placeholder="MESSAGE TO ALL SOULS (OPTIONAL)"
                id="massMessage"
                rows={2}
                className="w-full bg-void border border-moonlight/10 p-3 text-[10px] tracking-widest outline-none focus:border-moonlight transition-all uppercase resize-none mb-2"
              />
              <input
                type="number"
                placeholder="AMOUNT PER SOUL"
                id="massRtAmount"
                className="w-full bg-void border border-moonlight/10 p-3 text-[10px] tracking-widest focus:border-moonlight outline-none font-mono mb-4"
              />

              <div className="p-4 border border-rose-500/20 bg-rose-500/5 mb-4">
                <p className="text-[7px] text-rose-500 uppercase tracking-[0.2em] leading-relaxed">
                  CAUTION: この操作は対象者全員の記録を永続的に書き換えます。取り消しは不可能です。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {["Member", "Fixer", "Mastermind", "All"].map((target) => (
                  <button
                    key={target}
                    onClick={() => handleMassGrace(target)}
                    className="py-3 border border-moonlight/10 text-[8px] uppercase tracking-widest hover:bg-rose-500/10 hover:border-rose-500/40 transition-all"
                  >
                    Execute: {target}
                  </button>
                ))}
              </div>
              <p className="text-[7px] opacity-20 uppercase tracking-[0.2em]">
                &quot;All&quot; grants to every standard Member (excludes admin/manager roles).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-rose-500/60 text-[8px] uppercase tracking-widest">
            <ShieldAlert size={12} /> Every action above executes immediately and is logged to the audit trail.
          </div>

          <div className="text-[9px] leading-relaxed opacity-20 tracking-widest uppercase italic text-center">
            &quot;Everything is in the hands of the Chief Officer. The Void conforms to your will.&quot;
          </div>
        </section>
      </div>
    </div>
  );
}
