"use client";

import { useState, useEffect } from "react";
import { Search, ShieldAlert, CreditCard, RotateCcw, Lock, Package, CheckCircle, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LedgerPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [newCard, setNewCard] = useState({ uid: "", serial: "" });

  const fetchLedger = async () => {
    try {
      const res = await fetch("/api/admin/card/list");
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/order/list");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const statusLabel = status === 'shipped' ? '発送済み' : '完了';
    if (!confirm(`注文ステータスを「${statusLabel}」に更新しますか？`)) return;

    try {
      const res = await fetch("/api/admin/order/update", {
        method: "POST",
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLedger();
    fetchOrders();
  }, []);

  const toggleStatus = async (uid: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    setCards(cards.map(c => c.uid === uid ? { ...c, status: nextStatus } : c));
    
    try {
      await fetch("/api/admin/card/update-status", {
        method: "POST",
        body: JSON.stringify({ uid, status: nextStatus })
      });
    } catch (e) {
      fetchLedger();
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-400";
      case "suspended": return "text-amber-500";
      case "void": return "text-rose-500";
      default: return "text-moonlight/40";
    }
  };

  const [isScanning, setIsScanning] = useState(false);

  const generateRandomSerial = (existingCards: any[]) => {
    const year = "2026";
    let version = 0;
    
    // 現在の台帳から使用済みのシリアルを抽出
    const usedSerials = new Set(existingCards.map(c => c.internal_serial));

    while (version < 100) {
      const vStr = version.toString().padStart(2, '0');
      const prefix = `${vStr}${year}`;
      
      // このバージョンの使用数をカウント
      const countInVersion = existingCards.filter(c => c.internal_serial.startsWith(prefix)).length;

      if (countInVersion < 100000) {
        // 5桁の乱数を生成（重複があればリトライ）
        let attempts = 0;
        while (attempts < 1000) {
          const randomSuffix = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
          const candidate = `${prefix}${randomSuffix}`;
          
          if (!usedSerials.has(candidate)) {
            return candidate;
          }
          attempts++;
        }
      }
      version++;
    }
    return "OVERFLOW"; // 1000万枚を超えた場合
  };

  const startScan = async () => {
    if (!("NDEFReader" in window)) {
      alert("このブラウザ/デバイスはNFCスキャンに対応していません。");
      return;
    }

    try {
      setIsScanning(true);
      const reader = new (window as any).NDEFReader();
      await reader.scan();

      reader.addEventListener("reading", ({ serialNumber }: any) => {
        const formattedUid = serialNumber.toUpperCase();
        
        // 乱数ベースのシリアル生成 (例: 00202612345)
        const autoSerial = generateRandomSerial(cards);
        
        setNewCard(prev => ({
          ...prev,
          uid: formattedUid,
          serial: prev.serial || autoSerial
        }));
        setIsScanning(false);
      });

    } catch (error) {
      console.error("NFC Scan Error:", error);
      setIsScanning(false);
    }
  };

  const createSlot = async () => {
    if (!newCard.uid || !newCard.serial) return;
    try {
      const res = await fetch("/api/admin/card/create", {
        method: "POST",
        body: JSON.stringify(newCard)
      });
      if (res.ok) {
        fetchLedger();
        setNewCard({ uid: "", serial: "" });
      } else {
        const err = await res.json();
        alert(err.error || "スロットの作成に失敗しました。");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-12 border-b border-moonlight/10 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-xl tracking-[0.6em] uppercase flex items-center gap-4">
            <CreditCard className="text-moonlight opacity-40" size={20} />
            Central Asset Ledger
          </h1>
          <p className="text-[10px] tracking-widest opacity-40 uppercase mt-2">中央台帳：物理カードの登録、注文管理、およびペアリング</p>
        </div>
        <a href="/docs/NTAG_SETUP_GUIDE.md" target="_blank" className="text-[8px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity underline underline-offset-8">セットアップマニュアル</a>
      </header>

      {/* Orders Section */}
      <section id="orders" className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <Package className="text-azure-400 opacity-60" size={18} />
          <h2 className="text-[11px] tracking-[0.5em] uppercase font-bold">Pending Orders (未発送の注文)</h2>
          <span className="px-2 py-0.5 bg-azure-500/10 text-azure-400 text-[9px] rounded font-mono">
            {orders.filter(o => o.status !== 'completed').length}
          </span>
        </div>

        <div className="grid grid-cols-5 p-4 border-b border-white/5 text-[9px] uppercase tracking-[0.2em] opacity-30 font-bold">
           <div>注文日 / 顧客</div>
           <div>プラン / バリアント</div>
           <div>ステータス</div>
           <div>配送先</div>
           <div className="text-right">アクション</div>
        </div>

        <div className="space-y-1 mt-2">
          {loadingOrders ? (
            <div className="py-12 text-center text-[10px] uppercase opacity-20 tracking-widest">注文データを同期中...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-[10px] uppercase opacity-10 tracking-widest italic">注文履歴はありません</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="grid grid-cols-5 p-5 bg-white/[0.02] border border-white/5 items-center text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-white opacity-80">{order.customer_name}</span>
                  <span className="text-[8px] opacity-30">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-wider text-azure-300">{order.tier}</span>
                  <span className="text-[8px] opacity-30 uppercase">{order.variant || 'Standard'}</span>
                </div>
                <div>
                   <span className={`text-[9px] px-2 py-0.5 rounded border ${
                     order.status === 'paid' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' : 
                     order.status === 'shipped' ? 'border-azure-500/20 text-azure-500 bg-azure-500/5' : 
                     'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
                   } uppercase tracking-tighter`}>
                     {order.status === 'paid' ? '支払い済み' : order.status === 'shipped' ? '発送済み' : '完了'}
                   </span>
                </div>
                <div className="flex flex-col gap-1 pr-4">
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] text-white/80">{order.customer_email}</span>
                   </div>
                   {order.shipping_address && (
                     <div className="text-[8px] opacity-40 leading-relaxed font-sans mt-1">
                       <span className="mr-2">〒{(order.shipping_address as any).postal_code}</span>
                       <span>{(order.shipping_address as any).state}{(order.shipping_address as any).city}{(order.shipping_address as any).line1}{(order.shipping_address as any).line2}</span>
                     </div>
                   )}
                </div>
                <div className="flex justify-end gap-2">
                   {order.status === 'paid' && (
                     <button 
                       onClick={() => updateOrderStatus(order.id, 'shipped')}
                       className="flex items-center gap-2 px-4 py-2 bg-azure-500/5 border border-azure-500/20 hover:border-azure-500 text-azure-400 transition-all text-[8px] uppercase tracking-widest font-bold"
                     >
                        <Truck size={12} />
                        発送完了としてマーク
                     </button>
                   )}
                   {order.status === 'shipped' && (
                     <button 
                       onClick={() => updateOrderStatus(order.id, 'completed')}
                       className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 transition-all text-[8px] uppercase tracking-widest font-bold"
                     >
                        <CheckCircle size={12} />
                        取引を完了する
                     </button>
                   )}
                   {order.status === 'completed' && (
                     <span className="text-[8px] opacity-20 uppercase tracking-[0.2em] flex items-center gap-2 pr-4">
                        <CheckCircle size={10} /> 処理済み
                     </span>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Slot Creation Form */}
      <section className="mb-16 p-8 border border-moonlight/10 bg-gothic-dark/20 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-bold">Create New Card Slot (新規カード枠の作成)</h2>
          <button 
            onClick={startScan} 
            disabled={isScanning}
            className={`px-8 py-2 border ${isScanning ? "border-emerald-500 text-emerald-400 animate-pulse" : "border-moonlight/20 text-moonlight opacity-40 hover:opacity-100 hover:bg-white/5"} text-[9px] tracking-[0.4em] uppercase transition-all`}
          >
            {isScanning ? "スキャン中..." : "スキャン開始"}
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-1">
            <label className="text-[8px] uppercase opacity-30 tracking-widest">物理 UID</label>
            <input
              type="text" placeholder="04:A2:3F:..." value={newCard.uid}
              onChange={(e) => setNewCard({ ...newCard, uid: e.target.value })}
              className="w-full bg-void border border-moonlight/10 p-3 text-xs tracking-widest outline-none focus:border-moonlight transition-all uppercase"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[8px] uppercase opacity-30 tracking-widest">シリアル番号</label>
            <input
              type="text" placeholder="HXC-2026-XXXX" value={newCard.serial}
              onChange={(e) => setNewCard({ ...newCard, serial: e.target.value })}
              className="w-full bg-void border border-moonlight/10 p-3 text-xs tracking-widest outline-none focus:border-moonlight transition-all uppercase"
            />
          </div>
          <div className="flex items-end">
            <button onClick={createSlot} className="px-12 py-3 bg-moonlight text-void text-[10px] font-bold uppercase tracking-[0.6em] hover:bg-white transition-all shadow-xl">作成</button>
          </div>
        </div>
        <p className="mt-4 text-[9px] opacity-30 italic leading-relaxed">
           * [スキャン開始] を押し、物理カードをデバイスにタッチするとUIDが自動取得されます。シリアルは自動生成されますが、手動入力も可能です。
        </p>
      </section>

      <div className="flex items-center gap-4 mb-8">
          <CreditCard className="text-moonlight opacity-40" size={18} />
          <h2 className="text-[11px] tracking-[0.5em] uppercase font-bold">Inventory Ledger (在庫台帳)</h2>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-5 p-6 border-b border-moonlight/10 text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2 font-bold bg-white/5">
         <div>UID (物理ID)</div>
         <div>Serial (シリアル)</div>
         <div>Status (状態)</div>
         <div>Identity (紐付けユーザー)</div>
         <div className="text-right">Action</div>
      </div>

      {/* Ledger Rows */}
      <div className="space-y-1">
        {loading ? (
          <div className="py-24 text-center animate-pulse text-[10px] uppercase opacity-20 tracking-widest">台帳を同期中...</div>
        ) : (
          <AnimatePresence>
            {cards.map((c) => (
              <motion.div
                key={c.uid}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-5 p-6 bg-gothic-dark/10 border border-transparent hover:border-moonlight/10 transition-all text-xs font-mono items-center"
              >
                <div className="tracking-widest">{c.uid}</div>
                <div className="opacity-60">{c.serial}</div>
                <div className={`uppercase text-[10px] tracking-[0.2em] font-sans font-bold ${statusColor(c.status)}`}>
                  {c.status === 'active' ? '有効' : c.status === 'suspended' ? '停止中' : c.status === 'unissued' ? '未発行' : '無効'}
                </div>
                <div className="opacity-40 font-sans uppercase text-[10px] tracking-widest">{c.user || '---'}</div>
                <div className="flex justify-end gap-6">
                   {c.status !== "unissued" && (
                     <button 
                       onClick={() => toggleStatus(c.uid, c.status)}
                       className="flex items-center gap-2 text-[8px] uppercase tracking-widest border border-moonlight/20 px-4 py-1.5 hover:bg-white/5 transition-all group"
                     >
                       {c.status === "active" ? <Lock size={10} className="opacity-40 group-hover:opacity-100" /> : <RotateCcw size={10} className="opacity-40 group-hover:opacity-100" />}
                       {c.status === "active" ? "停止" : "再開"}
                     </button>
                   )}
                   <button className="text-rose-500/40 hover:text-rose-500 transition-colors"><ShieldAlert size={16} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
