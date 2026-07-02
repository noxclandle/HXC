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
  Trash2,
  Mail,
  Phone,
  Eye,
  MapPin
} from "lucide-react";
import Link from "next/link";

interface Card {
  uid: string;
  serial: string;
  status: string;
  userId?: string;
  user: string;
  handle?: string | null;
  email?: string;
  phone?: string;
  purchaseName?: string;
  shippingAddress?: any; // 追加
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
  const [submitting, setSubmitting] = useState(false);
  const [newCard, setNewCard] = useState({ uid: "", serial: "" });
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [inspectUser, setInspectUser] = useState<Card | null>(null); // 追加
  const [justAddedUids, setJustAddedUids] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const ts = Date.now();
    try {
      const [cardRes, orderRes, sessionRes] = await Promise.all([
        fetch(`/api/admin/card/list?t=${ts}`),
        fetch(`/api/admin/order/list?t=${ts}`),
        fetch(`/api/auth/session?t=${ts}`)
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
    let version = 1; // 0から1（バージョン01）へ更新
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

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/card/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: normalizedUid, serial: newCard.serial })
      });
      if (res.ok) {
        await fetchData();
        setNewCard({ uid: "", serial: "" });
        setJustAddedUids(prev => [normalizedUid, ...prev]);
      } else {
        const data = await res.json();
        alert(data.error || "Registration failed");
        // 失敗時もシリアル競合や次の登録の邪魔になるのを防ぐため、入力をクリアする
        setNewCard({ uid: "", serial: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const assignCardToOrder = async (orderId: string, cardUid: string) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/order/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "shipped", card_uid: cardUid })
      });
      if (res.ok) {
        alert("Card assigned and order marked as shipped.");
        setSelectedOrder(null);
        await fetchData();
      } else {
        alert("Assignment failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const unlinkCard = async (uid: string) => {
    if (!confirm("実行しますか？ このカードは『未発行』状態に戻り、シリアル番号もリセットされます。既存のユーザーとの紐付けは完全に解除されます。")) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/card/unlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid })
      });
      if (res.ok) {
        alert("カードの紐付けを解除し、初期化しました。");
        await fetchData();
      } else {
        alert("紐付け解除に失敗しました。");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const voidCard = async (uid: string) => {
    if (!confirm("【警告】永久無効化を実行しますか？ このカードは二度と使用できなくなります。この操作は取り消せません。")) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/card/void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid })
      });
      if (res.ok) {
        alert("カードを永久無効化しました。");
        await fetchData();
      } else {
        alert("無効化処理に失敗しました。");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
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

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/card/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid })
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = { error: "サーバーからの応答が不正です（ビルドエラーの可能性があります）" };
      }

      if (res.ok) {
        alert("抹消完了：このカードの存在は世界から完全に消し去られました。");
        await fetchData();
      } else {
        alert(data.error || "抹消に失敗しました。権限が不足しているか、システムエラーです。");
      }
    } catch (err) {
      alert("通信エラー：抹消プロセスを完遂できませんでした。ネットワークを確認してください。");
      console.error(err);
    } finally {
      setSubmitting(false);
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
    c.user.toLowerCase().includes(search.toLowerCase()) ||
    (c.purchaseName && c.purchaseName.toLowerCase().includes(search.toLowerCase()))
  );
  const pendingOrders = orders.filter(o => o.status === "paid");

  // 表示用カードリストをソート（新規登録＆未発行を最優先で一番上に）
  const sortedCards = [...filteredCards].sort((a, b) => {
    const idxA = justAddedUids.indexOf(a.uid);
    const idxB = justAddedUids.indexOf(b.uid);
    
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;

    if (a.status === "unissued" && b.status !== "unissued") return -1;
    if (a.status !== "unissued" && b.status === "unissued") return 1;

    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 border-b border-white/5 pb-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-xl md:text-2xl tracking-[0.4em] uppercase font-light mb-2 flex items-center gap-4 text-white">
              <Layers className="text-azure-400 animate-pulse" size={22} /> Central Asset Registry / 物理資産中央台帳
            </h1>
            <p className="text-[9px] tracking-[0.2em] text-azure-400/60 uppercase font-bold italic">Hexa System Oversight Protocol</p>
          </div>
          <Link href="/admin/onboarding" className="text-[9px] uppercase tracking-[0.2em] text-azure-400 hover:text-white border-b border-azure-400/20 pb-1 hover:border-white/50 transition-all flex items-center gap-2 font-bold shrink-0">
            Protocol Guide / 出荷手順書 <ExternalLink size={10} />
          </Link>
        </div>
      </header>

      {/* 1. Pending Orders Section */}
      <section id="orders" className="mb-20">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-azure-400 font-bold mb-6 flex items-center gap-3">
          <Package className="text-azure-400" size={16} /> Pending Shipments / 発送待ちの注文
          {pendingOrders.length > 0 && (
            <span className="bg-azure-500 text-white text-[8px] px-2.5 py-0.5 rounded-full font-bold shadow-md shadow-azure-500/20 animate-pulse">{pendingOrders.length}</span>
          )}
        </h2>

        {pendingOrders.length === 0 ? (
          <div className="p-16 border border-white/5 bg-white/[0.01] rounded-sm text-center opacity-30 text-[10px] tracking-[0.3em] uppercase">
            No pending orders detected in the system. / 発送待ちの注文はありません。
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingOrders.map(order => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.03] hover:border-white/20 transition-all flex flex-col md:flex-row justify-between items-center gap-6 rounded-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs font-bold tracking-widest text-white uppercase">{order.customer_name}</span>
                    <span className={`text-[8px] px-2.5 py-0.5 border uppercase tracking-widest font-bold rounded-sm ${order.tier === 'Apex' ? 'border-rose-500 text-rose-500 bg-rose-500/5' : 'border-azure-400 text-azure-400 bg-azure-400/5'}`}>
                      {order.tier} {order.variant && `- ${order.variant}`}
                    </span>
                  </div>
                  <div className="text-[9px] opacity-40 uppercase tracking-widest space-y-1.5 font-sans">
                    <p className="font-mono">{order.customer_email}</p>
                    <p className="text-[10px] text-white/60 flex items-center gap-2">
                      <MapPin size={10} className="text-azure-400/60" />
                      〒{order.shipping_address?.postal_code} {order.shipping_address?.state}{order.shipping_address?.city}{order.shipping_address?.line1} {order.shipping_address?.line2}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap mt-4 md:mt-0">
                  <div className="text-right hidden md:block mr-4 border-r border-white/5 pr-4">
                    <p className="text-[8px] uppercase tracking-widest opacity-20 mb-1">Created At / 注文日</p>
                    <p className="text-[10px] font-mono opacity-60">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  {/* Manual mail triggers styled smaller as overrides */}
                  <div className="flex gap-2 border border-white/5 p-1 bg-white/[0.01] rounded-sm">
                    <button 
                      onClick={() => {
                        const subject = encodeURIComponent("【HXC】アイデンティティの転送（発送）が完了しました");
                        const body = encodeURIComponent(`${order.customer_name} 様\n\nご注文ありがとうございます。\n先ほど、あなたの物理カードの初期設定と発送が完了しました。\n数日以内にご指定の住所へお届けいたします。\n\nHexa Relation 監視局`);
                        window.location.href = `mailto:${order.customer_email}?subject=${subject}&body=${body}`;
                      }}
                      title="Launch Mail App (Manual) / 手動メール送信"
                      className="p-2.5 bg-transparent hover:bg-white/5 transition-all text-white/40 hover:text-white rounded-sm"
                    >
                      <Mail size={12} />
                    </button>
                    
                    <button 
                      onClick={() => {
                        const text = `${order.customer_email}\n\n件名: 【HXC】アイデンティティの転送（発送）が完了しました\n\n${order.customer_name} 様\n\nご注文ありがとうございます。\n先ほど、あなたの物理カードの初期設定と発送が完了しました。\n数日以内にご指定の住所へお届けいたします。\n\nHexa Relation 監視局`;
                        navigator.clipboard.writeText(text);
                        alert("メールの宛先とテンプレート本文をコピーしました。");
                      }}
                      title="Copy Mail Template (Manual) / 本文コピー"
                      className="p-2.5 bg-transparent hover:bg-white/5 transition-all text-white/40 hover:text-white rounded-sm"
                    >
                      <Copy size={12} />
                    </button>
                  </div>

                  <button 
                    onClick={() => setSelectedOrder(order)}
                    disabled={submitting}
                    className="px-6 py-3.5 bg-azure-600 hover:bg-azure-500 text-white text-[9px] uppercase tracking-[0.25em] font-bold transition-all flex items-center gap-2 rounded-sm shadow-lg shadow-azure-900/10 hover:shadow-azure-500/10 active:scale-95 disabled:opacity-50"
                  >
                    Assign Card / カード紐付け <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Quick Registry Section */}
      <section className="mb-20 bg-azure-950/10 border border-azure-500/15 p-6 md:p-10 rounded-sm relative overflow-hidden z-10 shadow-xl shadow-black/20">
        <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/30" />
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-azure-400 font-bold mb-8 flex items-center gap-3">
          <Zap className="text-amber-400" size={16} /> Asset Provisioning / ハードウェア登録
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-2.5">
            <label className="text-[8px] uppercase tracking-[0.2em] opacity-40 ml-1 font-bold">Card UID (NFC Serial) / カード固有識別子</label>
            <input 
              placeholder="e.g. 04A23B..." 
              value={newCard.uid} 
              onChange={(e) => {
                const val = e.target.value.toUpperCase().replace(/[:\s]/g, "");
                setNewCard(prev => ({ 
                   ...prev, 
                   uid: val, 
                   // UIDが空ならシリアルも空にクリアし、値がある時のみ生成・維持する
                   serial: val ? (prev.serial || generateRandomSerial(cards)) : ""
                }));
              }}
              className="w-full bg-void/50 border border-white/10 p-4 text-azure-400 tracking-widest outline-none focus:border-azure-400 font-mono text-lg rounded-sm transition-all focus:bg-void/80"
            />
          </div>
          <div className="flex-1 space-y-2.5">
            <label className="text-[8px] uppercase tracking-[0.2em] opacity-40 ml-1 font-bold">Serial Number (Auto-Assigned) / 発行シリアル番号</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                value={newCard.serial} 
                readOnly
                placeholder="UID entry required"
                className="flex-1 bg-white/[0.02] border border-white/5 p-4 text-azure-400/50 tracking-widest outline-none font-mono text-lg rounded-sm"
              />
              <button 
                onClick={createSlot}
                disabled={!newCard.uid || submitting}
                className="px-6 py-4 sm:py-0 bg-white text-black text-[9px] uppercase tracking-[0.35em] font-bold hover:bg-azure-400 hover:text-white transition-all disabled:opacity-20 active:scale-98 rounded-sm w-full sm:w-auto sm:px-10 shrink-0 font-sans"
              >
                {submitting ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Card Ledger Section */}
      <section className="relative z-10">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-[11px] tracking-[0.3em] uppercase text-azure-400 font-bold flex items-center gap-3">
            <Shield className="text-azure-400" size={16} /> Master Ledger / 中央登録台帳
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20" size={12} />
            <input 
              type="text" 
              placeholder="Search assets... / 資産検索" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 p-2.5 pl-10 text-[9px] tracking-widest uppercase outline-none focus:border-azure-500 focus:bg-white/[0.02] rounded-sm transition-all w-60"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-white/5 rounded-sm bg-white/[0.01]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[8px] uppercase tracking-[0.25em] opacity-35 border-b border-white/10 bg-white/[0.01]">
                <th className="p-4 font-bold text-azure-400">UID / 固有識別子</th>
                <th className="p-4 font-bold text-azure-400">Secret Serial / 秘密シリアル</th>
                <th className="p-4 font-bold text-azure-400">Status / 状態</th>
                <th className="p-4 font-bold text-azure-400">Fulfillment / 発送先</th>
                <th className="p-4 font-bold text-azure-400">Owner / 所有者</th>
                <th className="p-4 text-right font-bold text-azure-400">Action / 操作</th>
              </tr>
            </thead>
            <tbody className="text-[11px] tracking-widest uppercase">
              {sortedCards.map(card => (
                <tr key={card.uid} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-all">
                  <td className="p-4 font-mono flex items-center gap-2">
                    {card.uid}
                    {justAddedUids.includes(card.uid) && (
                      <span className="text-[7px] text-azure-400 bg-azure-400/10 border border-azure-400/20 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-[0.1em] animate-pulse shrink-0">
                        New
                      </span>
                    )}
                  </td>
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
                    {card.purchaseName !== "-" ? (
                      <div className="flex flex-col gap-1 max-w-[200px]">
                        <span className="text-white/90 text-[10px] font-bold flex items-center gap-2">
                          <Package size={10} className="text-azure-400" /> {card.purchaseName}
                        </span>
                        {card.shippingAddress && (
                          <span className="text-[8px] opacity-40 lowercase tracking-normal truncate">
                            〒{card.shippingAddress.postal_code} {card.shippingAddress.state}{card.shippingAddress.city}...
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="opacity-10">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div 
                        onClick={() => (card.userId || card.purchaseName !== "-") && setInspectUser(card)}
                        className={`flex items-center gap-2 group/user ${(card.userId || card.purchaseName !== "-") ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        <UserIcon size={10} className="opacity-40 group-hover/user:text-azure-400 transition-colors" /> 
                        <span className="text-white/80 group-hover/user:text-white transition-colors border-b border-transparent group-hover/user:border-white/20">
                          {card.user !== "-" ? card.user : (card.purchaseName !== "-" ? card.purchaseName : "-")}
                        </span>
                        {(card.userId || card.purchaseName !== "-") && <Eye size={10} className="opacity-0 group-hover/user:opacity-40 transition-opacity" />}
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
                          disabled={submitting}
                          className="text-[8px] text-amber-500 border border-amber-500/20 px-3 py-1.5 hover:bg-amber-500/10 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <RefreshCcw size={10} /> Unlink
                        </button>
                      )}
                      {card.status !== "void" && (
                        <button 
                          onClick={() => voidCard(card.uid)}
                          disabled={submitting}
                          className="text-[8px] text-rose-500 border border-rose-500/20 px-3 py-1.5 hover:bg-rose-500/10 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <Shield size={10} /> Void
                        </button>
                      )}
                      {currentUserRole === "fixer" && card.status === "void" && (
                        <button 
                          onClick={() => deleteCard(card.uid)}
                          disabled={submitting}
                          className="text-[8px] text-rose-500 border border-rose-500/40 bg-rose-500/5 px-3 py-1.5 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
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
                      className={`p-4 border border-white/5 bg-white/[0.02] hover:border-azure-500/40 transition-all flex justify-between items-center group ${submitting ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                      onClick={() => !submitting && assignCardToOrder(selectedOrder.id, card.uid)}
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

      {/* User Details Inspector Modal */}
      <AnimatePresence>
        {inspectUser && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-void/95 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-azure-500 via-purple-500 to-rose-500" />
              
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4">
                  <UserIcon size={32} className="text-white/20" />
                </div>
                
                <div>
                  <h3 className="text-2xl tracking-[0.2em] font-light text-white mb-2">{inspectUser.user}</h3>
                  <span className={`text-[8px] px-3 py-1 border uppercase font-bold tracking-[0.4em] ${
                    inspectUser.role === 'fixer' ? 'border-rose-500 text-rose-500 bg-rose-500/5' :
                    inspectUser.role === 'mastermind' ? 'border-amber-500 text-amber-500 bg-amber-500/5' :
                    'border-azure-400 text-azure-400 bg-azure-400/5'
                  }`}>
                    {inspectUser.rank || "Member"}
                  </span>
                </div>

                <div className="w-full space-y-4 pt-8 border-t border-white/5">
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[8px] uppercase tracking-widest opacity-20 flex items-center gap-2"><UserIcon size={10}/> Purchase Name / 申し込み時の氏名</span>
                    <p className="text-xs text-azure-400/80">{inspectUser.purchaseName || "Unknown"}</p>
                  </div>
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[8px] uppercase tracking-widest opacity-20 flex items-center gap-2"><Mail size={10}/> Email Address</span>
                    <p className="text-xs font-mono text-white/80">{inspectUser.email || "Not registered"}</p>
                  </div>
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[8px] uppercase tracking-widest opacity-20 flex items-center gap-2"><Phone size={10}/> Contact Number</span>
                    <p className="text-xs font-mono text-white/80">{inspectUser.phone || "Not registered"}</p>
                  </div>
                  
                  {/* 配送先情報の表示 */}
                  {inspectUser.shippingAddress && (
                    <div className="flex flex-col items-start space-y-1 pt-4 border-t border-white/5 w-full">
                      <span className="text-[8px] uppercase tracking-widest text-azure-400 flex items-center gap-2 font-bold"><MapPin size={10}/> Shipping Address / 配送先</span>
                      <div className="text-[11px] text-white/90 leading-relaxed bg-white/5 p-4 rounded-sm w-full font-sans">
                        <p>〒{inspectUser.shippingAddress.postal_code}</p>
                        <p>{inspectUser.shippingAddress.state}{inspectUser.shippingAddress.city}{inspectUser.shippingAddress.line1}</p>
                        <p>{inspectUser.shippingAddress.line2}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 w-full pt-10">
                  {inspectUser.status === 'active' && (
                    <Link 
                      href={`/p/${inspectUser.handle || inspectUser.userId}`}
                      target="_blank"
                      className="py-4 bg-azure-600 text-[9px] uppercase tracking-widest font-bold text-white hover:bg-azure-500 transition-all text-center flex items-center justify-center gap-2 col-span-2 shadow-lg mb-2"
                    >
                      View Public Profile <ExternalLink size={12} />
                    </Link>
                  )}
                  <Link 
                    href={`/admin/users?search=${inspectUser.user}`}
                    className="py-4 bg-white/[0.05] border border-white/10 text-[9px] uppercase tracking-widest font-bold text-azure-400 hover:bg-azure-400/10 transition-all text-center flex items-center justify-center gap-2"
                  >
                    Manage Identity <ExternalLink size={12} />
                  </Link>
                  <button 
                    onClick={() => setInspectUser(null)}
                    className="py-4 border border-white/10 text-[9px] uppercase tracking-widest font-bold hover:bg-white/5 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
