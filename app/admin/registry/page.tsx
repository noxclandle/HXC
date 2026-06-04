"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, 
  Package, 
  Search, 
  Check, 
  Copy, 
  ExternalLink, 
  Shield, 
  Truck, 
  Clock, 
  ArrowRight,
  Plus,
  Zap,
  User as UserIcon,
  RefreshCcw,
  Trash2
} from "lucide-react";
import Link from "next/link";

interface Card {
  uid: string;
  serial: string;
  status: string;
  user: string;
  role?: string;
  rank?: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  tier: string;
  variant: string | null;
  status: string;
  shipping_address: any;
  created_at: string;
  card_uid?: string | null;
}

const generateRandomSerial = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 12; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
};

export default function RegistryPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState({ uid: "", serial: "" });
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cardRes, orderRes, sessionRes] = await Promise.all([
        fetch("/api/admin/card/list"),
        fetch("/api/admin/order/list"),
        fetch("/api/auth/session")
      ]);
      
      if (cardRes.ok) setCards(await cardRes.json());
      if (orderRes.ok) setOrders(await orderRes.json());
      if (sessionRes.ok) {
        const session = await sessionRes.json();
        setCurrentUserRole(session?.user?.role || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateRandomSerial = (existingCards: Card[]) => {
    const prefix = "HXRL";
    const year = "2026";
    let version = 0;
    const usedSerials = new Set(existingCards.map(c => c.serial));

    while (version < 100) {
      const vStr = version.toString().padStart(2, '0');
      const base = `${prefix}${vStr}${year}`;
      const countInVersion = existingCards.filter(c => c.serial.startsWith(base)).length;

      if (countInVersion < 100000) {
        let attempts = 0;
        while (attempts < 1000) {
          const randomSuffix = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
          const candidate = `${base}${randomSuffix}`;
          if (!usedSerials.has(candidate)) return candidate;
          attempts++;
        }
      }
      version++;
    }
    return "OVERFLOW";
  };

  const createSlot = async () => {
    const normalizedUid = newCard.uid.replace(/[:\s]/g, "").toUpperCase();
    if (!normalizedUid || normalizedUid.length < 8 || !newCard.serial) {
      alert("Invalid UID or Serial.");
      return;
    }

    try {
      const res = await fetch("/api/admin/card/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: normalizedUid, serial: newCard.serial })
      });
      if (res.ok) {
        fetchData();
        setNewCard({ uid: "", serial: "" });
      } else {
        const data = await res.json();
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const assignCardToOrder = async (orderId: string, cardUid: string) => {
    try {
      const res = await fetch("/api/admin/order/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "shipped", card_uid: cardUid })
      });
      if (res.ok) {
        alert("Card assigned and order marked as shipped.");
        setSelectedOrder(null);
        fetchData();
      } else {
        alert("Assignment failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unlinkCard = async (uid: string) => {
    if (!confirm("実行しますか？ このカードは『未発行』状態に戻り、シリアル番号もリセットされます。既存のユーザーとの紐付けは完全に解除されます。")) return;
    
    try {
      const res = await fetch("/api/admin/card/unlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid })
      });
      if (res.ok) {
        alert("カードの紐付けを解除し、初期化しました。");
        fetchData();
      } else {
        alert("紐付け解除に失敗しました。");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const voidCard = async (uid: string) => {
    if (!confirm("【警告】永久無効化を実行しますか？ このカードは二度と使用できなくなります。この操作は取り消せません。")) return;
    
    try {
      const res = await fetch("/api/admin/card/void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid })
      });
      if (res.ok) {
        alert("カードを永久無効化しました。");
        fetchData();
      } else {
        alert("無効化処理に失敗しました。");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCard = async (uid: string) => {
    // 三重確認プロセス (Sovereign Tier)
    const step1 = confirm("【抹消：段階1】台帳からこのカードデータを『完全消去』しますか？");
    if (!step1) return;
    
    const step2 = confirm("【抹消：段階2】この操作は不可逆です。データベースから物理的に削除されます。本当に実行しますか？");
    if (!step2) return;
    
    const step3 = confirm("【最終確認】このカードの存在をこの世界から完全に消し去ります。よろしいですか？");
    if (!step3) return;

    try {
      const res = await fetch("/api/admin/card/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid })
      });
      if (res.ok) {
        alert("台帳からデータを完全に抹消しました。");
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "抹消に失敗しました。権限が不足している可能性があります。");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyUrl = (uid: string, serial: string) => {
    const cleanUid = uid.replace(/[:\s]/g, "").toUpperCase();
    const url = `${window.location.origin}/api/card/${cleanUid}?s=${serial}`;
    navigator.clipboard.writeText(url);
    alert("プロビジョニングURLをクリップボードにコピーしました。");
  };

  const unissuedCards = cards.filter(c => c.status === "unissued");
  const filteredCards = cards.filter(c => 
    c.uid.toLowerCase().includes(search.toLowerCase()) || 
    c.user.toLowerCase().includes(search.toLowerCase())
  );
  const pendingOrders = orders.filter(o => o.status === "paid");

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 flex items-center gap-4">
              <Layers className="text-azure-400 opacity-50" size={24} /> Central Asset Registry
            </h1>
            <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase font-bold italic">Hexa System / 物理資産中央台帳</p>
          </div>
          <Link href="/admin/onboarding" className="text-[9px] uppercase tracking-widest text-azure-400 border-b border-azure-400/20 pb-1 hover:border-azure-400 transition-all flex items-center gap-2">
            Protocol Guide <ExternalLink size={10} />
          </Link>
        </div>
      </header>

      {/* 1. Pending Orders Section */}
      <section id="orders" className="mb-20">
        <h2 className="text-[11px] tracking-[0.4em] uppercase text-azure-400 font-bold mb-6 flex items-center gap-3">
          <Package size={16} /> Pending Shipments
          {pendingOrders.length > 0 && (
            <span className="bg-azure-500 text-white text-[8px] px-2 py-0.5 rounded-full animate-pulse">{pendingOrders.length}</span>
          )}
        </h2>

        {pendingOrders.length === 0 ? (
          <div className="p-12 border border-white/5 bg-white/[0.01] text-center opacity-20 text-[10px] tracking-widest uppercase">
            No pending orders detected in the system.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingOrders.map(order => (
              <motion.div 
                key={order.id}
                className="p-6 border border-white/10 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs font-bold tracking-widest uppercase">{order.customer_name}</span>
                    <span className={`text-[8px] px-2 py-0.5 border uppercase tracking-widest font-bold ${order.tier === 'Apex' ? 'border-rose-500 text-rose-500 bg-rose-500/5' : 'border-azure-400 text-azure-400 bg-azure-400/5'}`}>
                      {order.tier} {order.variant && `- ${order.variant}`}
                    </span>
                  </div>
                  <div className="text-[9px] opacity-40 uppercase tracking-widest space-y-1">
                    <p>{order.customer_email}</p>
                    <p>{order.shipping_address?.postal_code} {order.shipping_address?.city} {order.shipping_address?.line1}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-widest opacity-20 mb-1">Created At</p>
                    <p className="text-[10px] font-mono opacity-60">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="px-6 py-3 bg-azure-600 text-white text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-azure-500 transition-all flex items-center gap-2 shadow-lg"
                  >
                    Assign Card <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Quick Registry Section */}
      <section className="mb-20 bg-azure-500/5 border border-azure-500/10 p-10">
        <h2 className="text-[11px] tracking-[0.4em] uppercase text-azure-400 font-bold mb-8 flex items-center gap-3">
          <Zap size={16} /> Asset Provisioning
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-[8px] uppercase tracking-[0.3em] opacity-40 ml-1">Card UID (NFC Serial)</label>
            <input 
              placeholder="e.g. 04A23B..." 
              value={newCard.uid} 
              onChange={(e) => {
                const val = e.target.value.toUpperCase().replace(/[:\s]/g, "");
                setNewCard(prev => ({ 
                   ...prev, 
                   uid: val, 
                   serial: prev.serial || generateRandomSerial(cards) 
                }));
              }}
              className="w-full bg-void border border-white/10 p-4 text-azure-400 tracking-widest outline-none focus:border-azure-400 font-mono text-lg"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[8px] uppercase tracking-[0.3em] opacity-40 ml-1">Serial Number (Auto-Assigned)</label>
            <div className="flex gap-4">
              <input 
                value={newCard.serial} 
                readOnly
                placeholder="UID entry required"
                className="flex-1 bg-white/[0.03] border border-white/10 p-4 text-azure-400 tracking-widest outline-none font-mono text-lg"
              />
              <button 
                onClick={createSlot}
                disabled={!newCard.uid}
                className="px-10 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-azure-400 hover:text-white transition-all disabled:opacity-20"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Card Ledger Section */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-[11px] tracking-[0.4em] uppercase text-azure-400 font-bold flex items-center gap-3">
            <Shield size={16} /> Master Ledger
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20" size={12} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 p-2 pl-10 text-[9px] tracking-widest uppercase outline-none focus:border-azure-500 transition-all w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[8px] uppercase tracking-[0.4em] opacity-20 border-b border-white/5">
                <th className="p-4 font-normal">UID</th>
                <th className="p-4 font-normal">Secret Serial</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Owner / Linked User</th>
                <th className="p-4 text-right font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="text-[11px] tracking-widest uppercase">
              {filteredCards.map(card => (
                <tr key={card.uid} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-all">
                  <td className="p-4 font-mono">{card.uid}</td>
                  <td className="p-4 font-mono opacity-40 group hover:opacity-100 transition-opacity">
                    {card.serial || "DESTROYED"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 border text-[7px] font-bold ${
                      card.status === 'active' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                      card.status === 'shipped' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                      'border-white/10 text-white/40'
                    }`}>
                      {card.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <UserIcon size={10} className="opacity-40" /> 
                        <span className="text-white/80">{card.user || "-"}</span>
                      </div>
                      {card.rank && (
                        <div className="flex">
                          <span className={`text-[7px] px-2 py-0.5 border uppercase font-bold tracking-widest ${
                            card.role === 'chief_officer' || card.role === 'fixer' ? 'border-rose-500/40 text-rose-500 bg-rose-500/5' :
                            card.role === 'mastermind' ? 'border-amber-500/40 text-amber-500 bg-amber-500/5' :
                            'border-azure-400/40 text-azure-400 bg-azure-400/5'
                          }`}>
                            {card.rank}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {(card.status === "unissued" || card.status === "shipped") && card.serial && (
                        <button 
                          onClick={() => copyUrl(card.uid, card.serial)}
                          className="text-[8px] text-azure-400 border border-azure-400/20 px-3 py-1.5 hover:bg-azure-400/10 transition-all flex items-center gap-2"
                        >
                          <Copy size={10} /> Copy URL
                        </button>
                      )}
                      {(card.status === "active" || card.status === "shipped") && (
                        <button 
                          onClick={() => unlinkCard(card.uid)}
                          className="text-[8px] text-amber-500 border border-amber-500/20 px-3 py-1.5 hover:bg-amber-500/10 transition-all flex items-center gap-2"
                        >
                          <RefreshCcw size={10} /> Unlink
                        </button>
                      )}
                      {card.status !== "void" && (
                        <button 
                          onClick={() => voidCard(card.uid)}
                          className="text-[8px] text-rose-500 border border-rose-500/20 px-3 py-1.5 hover:bg-rose-500/10 transition-all flex items-center gap-2"
                        >
                          <Shield size={10} /> Void
                        </button>
                      )}
                      {currentUserRole === "fixer" && (
                        <button 
                          onClick={() => deleteCard(card.uid)}
                          className="text-[8px] text-zinc-500 border border-zinc-500/20 px-3 py-1.5 hover:bg-rose-950/20 hover:text-rose-500 transition-all flex items-center gap-2"
                          title="物理的抹消 (Fixer Only)"
                        >
                          <Trash2 size={10} /> Eradicate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assignment Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-void/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 p-10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <h2 className="text-xl tracking-[0.3em] uppercase mb-2 text-white font-light">Assign Physical Card</h2>
              <p className="text-[9px] tracking-widest text-azure-400 opacity-60 uppercase mb-8 italic">
                Select an unissued card for {selectedOrder.customer_name}&apos;s {selectedOrder.tier} order
              </p>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                {unissuedCards.length === 0 ? (
                  <div className="py-12 text-center opacity-20 text-[10px] uppercase tracking-widest border border-dashed border-white/10">
                    No unissued cards available. Register a new UID first.
                  </div>
                ) : (
                  unissuedCards.map(card => (
                    <div 
                      key={card.uid}
                      className="p-4 border border-white/5 bg-white/[0.02] hover:border-azure-500/40 transition-all flex justify-between items-center group cursor-pointer"
                      onClick={() => assignCardToOrder(selectedOrder.id, card.uid)}
                    >
                      <div>
                        <p className="text-[10px] font-mono tracking-widest text-white">{card.uid}</p>
                        <p className="text-[7px] uppercase tracking-widest opacity-20">Secret: {card.serial}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-azure-400 text-[8px] uppercase tracking-widest font-bold flex items-center gap-2">
                        Select & Ship <Check size={12} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-4 border border-white/10 text-[9px] uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
