"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, CreditCard, Activity, Database, TrendingUp, 
  ShieldCheck, ArrowRight, Shield, BookOpen, Layers, 
  ShieldAlert, Sparkles, Search, CheckCircle, AlertTriangle, 
  RefreshCw, Wrench, FileText, MessageSquare, Package
} from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/logger";

interface AdminDashboardClientProps {
  stats: {
    activeUsers: string;
    issuedCards: string;
    totalCP: string;
  };
  reportCount: number;
}

export default function AdminDashboardClient({ stats, reportCount }: AdminDashboardClientProps) {
  // NFC Card Diagnostic States
  const [cardUid, setCardUid] = useState("");
  const [cardResult, setCardResult] = useState<any>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Database Integrity States
  const [integrity, setIntegrity] = useState<any>(null);
  const [isCheckingIntegrity, setIsCheckingIntegrity] = useState(false);
  const [isFixingIntegrity, setIsFixingIntegrity] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Daily Task States
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingIncidents, setPendingIncidents] = useState(reportCount);
  const [pendingInquiries, setPendingInquiries] = useState(0);
  const [isUpdatingTasks, setIsUpdatingTasks] = useState(false);

  // Stat Cards
  const statCards = [
    { label: "有効な ID ユニット", value: stats.activeUsers, icon: <Users size={14} />, desc: "登録ユーザー総数" },
    { label: "発行済み物理カード", value: stats.issuedCards, icon: <CreditCard size={14} />, desc: "有効化されたNFCカード" },
    { label: "総流通トークン (RT)", value: Number(stats.totalCP).toLocaleString(), icon: <TrendingUp size={14} />, desc: "システム内総RT残高" },
    { label: "プロトコル完全性", value: integrity?.isHealthy ? "正常" : "要確認", icon: <ShieldCheck size={14} />, desc: "データベース整合性" },
  ];

  // 1. 自動で整合性とタスク件数を走らせる
  useEffect(() => {
    fetchIntegrity();
    fetchDailyTasks();
  }, []);

  const fetchIntegrity = async () => {
    setIsCheckingIntegrity(true);
    try {
      const res = await fetch("/api/admin/integrity");
      const data = await res.json();
      if (res.ok) {
        setIntegrity({
          ...data.diagnostics,
          isHealthy: data.isHealthy
        });
      }
    } catch (e) {
      logger.error("Failed to fetch integrity diagnostics", { error: e });
    } finally {
      setIsCheckingIntegrity(false);
    }
  };

  const fetchDailyTasks = async () => {
    setIsUpdatingTasks(true);
    try {
      const [ordersRes, incidentsRes, inquiriesRes] = await Promise.all([
        fetch("/api/admin/order/count", { cache: "no-store" }),
        fetch("/api/admin/report/count", { cache: "no-store" }),
        fetch("/api/admin/contacts/count", { cache: "no-store" })
      ]);
      
      if (ordersRes.ok) {
        const d = await ordersRes.json();
        setPendingOrders(d.count);
      }
      if (incidentsRes.ok) {
        const d = await incidentsRes.json();
        setPendingIncidents(d.count);
      }
      if (inquiriesRes.ok) {
        const d = await inquiriesRes.json();
        setPendingInquiries(d.count);
      }
    } catch (e) {
      logger.error("Failed to fetch daily tasks", { error: e });
    } finally {
      setIsUpdatingTasks(false);
    }
  };

  // 2. 整合性の自動修復を実行
  const handleFixIntegrity = async () => {
    if (!confirm("不整合データを自動修復しますか？\n（ユーザーのRT残高を取引履歴元帳の合計値と強制同期します）")) {
      return;
    }
    setIsFixingIntegrity(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/integrity", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        await fetchIntegrity();
      } else {
        setMessage("Error: " + (data.error || "修復に失敗しました。"));
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setMessage("Error: " + message);
    } finally {
      setIsFixingIntegrity(false);
    }
  };

  // 3. カード診断を実行
  const handleDiagnoseCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardUid.trim()) return;
    setIsDiagnosing(true);
    setCardResult(null);
    try {
      const res = await fetch(`/api/admin/card/diagnose?uid=${encodeURIComponent(cardUid)}`);
      const data = await res.json();
      setCardResult(data);
    } catch (err) {
      setCardResult({ found: false, message: "診断リクエストに失敗しました。" });
    } finally {
      setIsDiagnosing(false);
    }
  };

  // 常用業務（普段使う機能）
  const dailyLinks = [
    { label: "ユーザー登録簿", path: "/admin/users", icon: <Users size={16}/>, desc: "IDユニットの管理・RT手動付与・権限変更" },
    { label: "カード中央台帳", path: "/admin/registry", icon: <Layers size={16}/>, desc: "物理カードの登録・アクティベーション状況" },
    { 
      label: "インシデント報告", 
      path: "/admin/reports", 
      icon: (
        <div className="relative">
          <ShieldAlert size={16}/>
          {pendingIncidents > 0 && (
            <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            </span>
          )}
        </div>
      ), 
      desc: "ユーザーからの不具合・違反報告の処理",
      alert: pendingIncidents > 0
    },
    { label: "システム告知", path: "/admin/news", icon: <FileText size={16}/>, desc: "全ユーザー向けお知らせの配信・編集" },
    { label: "LP 管理簿", path: "/admin/lps", icon: <Layers size={16}/>, desc: "各種LP・特設プロモーションページのリンク管理" },
    { label: "売上・財務統計", path: "/admin/sales", icon: <TrendingUp size={16}/>, desc: "物理カード販売およびRTチャージの売上集計（月別・年別）" },
  ];

  // システム管理（たまに管理する機能）
  const systemLinks = [
    { label: "システム構成", path: "/admin/config", icon: <Database size={16}/>, desc: "ガチャ確率・初期ボーナス・価格パラメーター設定" },
    { label: "セキュリティ司令室", path: "/admin/security", icon: <Shield size={16}/>, desc: "レートリミット監視・不正アクセス・IP制限" },
    { label: "アセット大典", path: "/admin/items", icon: <BookOpen size={16}/>, desc: "称号・フレームなどの獲得条件・ゲームデータ管理" },
    { label: "システム実行ログ", path: "/admin/logs", icon: <Activity size={16}/>, desc: "管理者が行った全操作の監査トレール確認" },
    { label: "発行・登録手順", path: "/admin/onboarding", icon: <ShieldCheck size={16}/>, desc: "新規カード発行・プロビジョニング手順マニュアル" },
    { label: "データバックアップ", path: "/api/admin/backup/export", icon: <Layers size={16}/>, desc: "全データベースのJSONエクスポート（ダウンロード）" },
  ];

  // デイリータスクが存在するか？
  const hasTasks = pendingOrders > 0 || pendingIncidents > 0 || pendingInquiries > 0 || (integrity && !integrity.isHealthy);

  return (
    <div className="space-y-8">
      
      {/* ==================== DAILY TASK ACTION CENTER (最上部配置) ==================== */}
      <div className={`border backdrop-blur-md p-6 rounded-2xl space-y-4 relative overflow-hidden transition-all duration-300 ${
        hasTasks 
          ? "border-rose-500/80 bg-rose-950/[0.02] shadow-[0_0_25px_rgba(244,63,94,0.1)] animate-pulse-slow" 
          : "border-white/10 bg-void/70"
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-azure-500/[0.01] rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${
              hasTasks 
                ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" 
                : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
            }`}></span>
            <h2 className="text-[11px] tracking-[0.3em] uppercase text-white font-black font-mono">Daily Task Control / デイリー業務司令部</h2>
            {hasTasks && (
              <span className="text-[9px] font-bold text-rose-400 font-mono animate-pulse tracking-wider bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded">
                ⚠️ 未対応の重要タスクがあります。必ず対応してください。 / PENDING URGENT TASKS. PLEASE RESOLVE IMMEDIATELY.
              </span>
            )}
          </div>
          <button 
            onClick={() => { fetchDailyTasks(); fetchIntegrity(); }}
            disabled={isUpdatingTasks}
            className="text-[8px] border border-white/10 hover:border-white/30 px-2 py-1 rounded font-mono text-white/60 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw size={8} className={isUpdatingTasks ? "animate-spin" : ""} />
            REFRESH TASKS
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!hasTasks ? (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex items-center gap-3 text-emerald-400 text-[10px] font-mono leading-relaxed"
            >
              <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-bold tracking-wider">ALL OPERATIONS SECURE / 本日のタスクは完了しています</p>
                <p className="text-[8px] text-emerald-400/60 uppercase">No pending orders, unresolved incidents, or inquiries. System is fully operational.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2.5 font-mono text-xs"
            >
              {/* 1. Pending Orders Alert */}
              {pendingOrders > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-azure-500/5 border border-azure-500/20 rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <Package size={16} className="text-azure-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-wider">Unshipped Orders / 未発送の注文あり</p>
                      <p className="text-[8px] text-white/40 leading-relaxed">新たに {pendingOrders} 件の物理カードの注文が入っています。カードの発送作業とアクティベーションの紐付けを行ってください。</p>
                    </div>
                  </div>
                  <Link 
                    href="/admin/registry#orders" 
                    className="self-end sm:self-center px-3 py-1.5 bg-white text-void hover:bg-zinc-200 text-[8px] font-bold tracking-widest rounded-lg flex items-center gap-1.5 transition-all flex-shrink-0"
                  >
                    GO TO REGISTRY <ArrowRight size={8} />
                  </Link>
                </div>
              )}

              {/* 2. Pending Incidents Alert */}
              {pendingIncidents > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-rose-500/5 border border-rose-500/20 rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <ShieldAlert size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-wider">Unresolved Incidents / 未解決の通報・不具合報告あり</p>
                      <p className="text-[8px] text-white/40 leading-relaxed">ユーザーから {pendingIncidents} 件のインシデント（通報・エラー報告）が届いています。内容を精査し、対応を行ってください。</p>
                    </div>
                  </div>
                  <Link 
                    href="/admin/reports" 
                    className="self-end sm:self-center px-3 py-1.5 bg-rose-500 text-white hover:bg-rose-600 text-[8px] font-bold tracking-widest rounded-lg flex items-center gap-1.5 transition-all flex-shrink-0"
                  >
                    RESOLVE NOW <ArrowRight size={8} />
                  </Link>
                </div>
              )}

              {/* 3. Pending Inquiries Alert */}
              {pendingInquiries > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <MessageSquare size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-wider">Pending Inquiries / 未対応の問い合わせあり</p>
                      <p className="text-[8px] text-white/40 leading-relaxed">外部コンタクトフォームより {pendingInquiries} 件のメッセージが届いています。返信対応を行ってください。</p>
                    </div>
                  </div>
                  <Link 
                    href="/admin/contacts" 
                    className="self-end sm:self-center px-3 py-1.5 bg-amber-500 text-void hover:bg-amber-400 text-[8px] font-bold tracking-widest rounded-lg flex items-center gap-1.5 transition-all flex-shrink-0"
                  >
                    REPLY NOW <ArrowRight size={8} />
                  </Link>
                </div>
              )}

              {/* 4. Database Discrepancy Alert */}
              {integrity && !integrity.isHealthy && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-purple-500/5 border border-purple-500/25 rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-wider">Database Inconsistency Detected / データベース不整合検出</p>
                      <p className="text-[8px] text-white/40 leading-relaxed">元帳の取引高の合計値とユーザーの表示残高に不一致が検出されています。残高不正を防ぐため、自動修復を実行してください。</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleFixIntegrity}
                    disabled={isFixingIntegrity}
                    className="self-end sm:self-center px-3 py-1.5 bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 text-[8px] font-bold tracking-widest rounded-lg flex items-center gap-1.5 transition-all flex-shrink-0"
                  >
                    {isFixingIntegrity ? <RefreshCw size={8} className="animate-spin" /> : <Wrench size={10} />}
                    RECONCILE NOW
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }} 
            className="p-6 border border-white/10 bg-white/[0.03] backdrop-blur-md relative overflow-hidden rounded-xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-azure-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-center mb-4">
              <span className="text-[7px] text-azure-300 font-bold tracking-[0.2em] uppercase">{s.label}</span>
              <div className="p-1.5 border border-white/15 text-azure-400/80 rounded-lg">{s.icon}</div>
            </div>
            <p className="text-2xl font-light tracking-tight text-white mb-1">
               {s.value}
            </p>
            <p className="text-[7px] text-white/45 uppercase tracking-widest">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* 4. Main Workspaces Split (常用業務 vs システム管理) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Daily Operations (常用業務) */}
        <div className="lg:col-span-6 space-y-8">
          <div className="border border-white/10 bg-void/50 p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <span className="w-2 h-2 bg-azure-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
              <h2 className="text-[11px] tracking-[0.3em] uppercase text-white font-black font-mono">Daily Operations / 常用業務</h2>
              <span className="text-[8px] text-azure-400/40 font-mono ml-auto">[ FREQUENT ]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dailyLinks.map((link, idx) => (
                <Link 
                  key={link.path}
                  href={link.path}
                  className="p-4 border border-white/5 bg-white/[0.01] hover:border-azure-500/30 hover:bg-azure-500/[0.01] transition-all rounded-xl group flex flex-col justify-between min-h-[110px]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-azure-400/60 group-hover:text-azure-400 transition-colors">{link.icon}</div>
                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-azure-400" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-wider text-white font-bold uppercase mb-1">{link.label}</p>
                    <p className="text-[7.5px] text-white/30 leading-relaxed">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* NFC Card Diagnostics Tool */}
          <div className="border border-white/10 bg-void/50 p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Search size={14} className="text-azure-400" />
              <h2 className="text-[11px] tracking-[0.3em] uppercase text-white font-black font-mono">Card Diagnostic / 物理カード簡易診断</h2>
              <span className="text-[8px] text-azure-400/40 font-mono ml-auto">[ TOOL ]</span>
            </div>

            <form onSubmit={handleDiagnoseCard} className="flex gap-2">
              <input 
                type="text" 
                value={cardUid}
                onChange={(e) => setCardUid(e.target.value)}
                placeholder="NFC UIDを入力 (例: 04A23B...)" 
                className="flex-1 bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-azure-500/50 font-mono"
              />
              <button 
                type="submit"
                disabled={isDiagnosing}
                className="bg-white text-void hover:bg-zinc-200 active:scale-95 text-[10px] font-bold tracking-widest px-4 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isDiagnosing ? <RefreshCw size={10} className="animate-spin" /> : "SCAN"}
              </button>
            </form>

            <AnimatePresence mode="wait">
              {cardResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 border border-white/10 bg-white/[0.01] rounded-xl space-y-3 text-xs font-mono"
                >
                  {!cardResult.found ? (
                    <div className="text-rose-400 text-[10px] flex items-center gap-2">
                      <AlertTriangle size={12} />
                      <span>{cardResult.message}</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[9px] text-white/40">UID: {cardResult.uid}</span>
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          cardResult.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          cardResult.status === "void" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                          "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                        }`}>
                          {cardResult.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-[9px]">
                        <div>
                          <p className="text-white/30">INTERNAL SERIAL</p>
                          <p className="text-white font-bold">{cardResult.serial}</p>
                        </div>
                        <div>
                          <p className="text-white/30">HEALTH CHECK</p>
                          <p className={cardResult.isHealthy ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                            {cardResult.isHealthy ? "✓ SECURE" : "⚠ WARNING"}
                          </p>
                        </div>
                      </div>

                      {cardResult.warnings.length > 0 && (
                        <div className="p-2.5 bg-rose-500/5 border border-rose-500/20 rounded-lg text-rose-400 text-[8px] space-y-1">
                          {cardResult.warnings.map((w: string, idx: number) => (
                            <p key={idx}>⚠ {w}</p>
                          ))}
                        </div>
                      )}

                      {cardResult.user ? (
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-2">
                          <p className="text-[8px] text-azure-400 font-bold tracking-wider uppercase border-b border-white/5 pb-1">BOUND USER / 紐付けユーザー</p>
                          <div className="grid grid-cols-2 gap-2 text-[9px]">
                            <div>
                              <p className="text-white/30">NAME</p>
                              <p className="text-white font-bold">{cardResult.user.name}</p>
                            </div>
                            <div>
                              <p className="text-white/30">EMAIL</p>
                              <p className="text-white">{cardResult.user.email}</p>
                            </div>
                            <div>
                              <p className="text-white/30">ROLE / RANK</p>
                              <p className="text-white uppercase">{cardResult.user.role} / {cardResult.user.rank}</p>
                            </div>
                            <div>
                              <p className="text-white/30">RT BALANCE</p>
                              <p className="text-emerald-400 font-bold">{cardResult.user.rtBalance} RT</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-zinc-500/5 border border-white/5 rounded-lg text-center text-[9px] text-white/30">
                          No user bound to this card. / ユーザー未紐付け
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: System Management (システム管理) */}
        <div className="lg:col-span-6 space-y-8">
          <div className="border border-white/10 bg-void/50 p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <span className="w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(192,132,252,0.6)]"></span>
              <h2 className="text-[11px] tracking-[0.3em] uppercase text-white font-black font-mono">System Management / システム管理</h2>
              <span className="text-[8px] text-purple-400/40 font-mono ml-auto">[ OCCASIONAL ]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {systemLinks.map((link, idx) => (
                <Link 
                  key={link.path}
                  href={link.path}
                  className="p-4 border border-white/5 bg-white/[0.01] hover:border-purple-500/30 hover:bg-purple-500/[0.01] transition-all rounded-xl group flex flex-col justify-between min-h-[110px]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-purple-400/60 group-hover:text-purple-400 transition-colors">{link.icon}</div>
                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-wider text-white font-bold uppercase mb-1">{link.label}</p>
                    <p className="text-[7.5px] text-white/30 leading-relaxed">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Database Integrity Doctor (データ整合性診断) */}
          <div className="border border-white/10 bg-void/50 p-6 rounded-2xl space-y-6 relative overflow-hidden">
            {isCheckingIntegrity && (
              <div className="absolute inset-0 bg-void/80 backdrop-blur-sm z-30 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw size={24} className="text-azure-400 animate-spin" />
                  <span className="text-[9px] font-mono tracking-widest text-white/60">SCANNING DATABASE INTEGRITY...</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Wrench size={14} className="text-purple-400" />
              <h2 className="text-[11px] tracking-[0.3em] uppercase text-white font-black font-mono">Data Doctor / データ整合性診断</h2>
              <button 
                onClick={fetchIntegrity}
                className="text-[8px] border border-white/10 hover:border-white/30 px-2 py-1 rounded font-mono text-white/60 hover:text-white transition-all ml-auto"
              >
                RE-SCAN
              </button>
            </div>

            {integrity ? (
              <div className="space-y-4 font-mono text-xs">
                {/* Checks List */}
                <div className="space-y-2.5">
                  {/* 1. RT Ledger */}
                  <div className="flex justify-between items-center p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-white uppercase">RT Ledger Reconciliation / RT取引高の突合</p>
                      <p className="text-[8px] text-white/30">Checked {integrity.rtLedger.checkedCount} users</p>
                    </div>
                    {integrity.rtLedger.mismatchCount === 0 ? (
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">SECURE</span>
                    ) : (
                      <span className="text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                        {integrity.rtLedger.mismatchCount} MISMATCHES
                      </span>
                    )}
                  </div>

                  {/* 2. Orphaned Cards */}
                  <div className="flex justify-between items-center p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-white uppercase">Card Binding Integrity / 有効カード紐付け監査</p>
                      <p className="text-[8px] text-white/30">Checked {integrity.cards.checkedCount} cards</p>
                    </div>
                    {integrity.cards.orphanedCount === 0 ? (
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">SECURE</span>
                    ) : (
                      <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                        {integrity.cards.orphanedCount} ORPHANED
                      </span>
                    )}
                  </div>

                  {/* 3. Incidents */}
                  <div className="flex justify-between items-center p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-white uppercase">Active Incident Reports / 未解決の通報・報告</p>
                      <p className="text-[8px] text-white/30">Outstanding flags</p>
                    </div>
                    {integrity.reports.pendingCount === 0 ? (
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">SECURE</span>
                    ) : (
                      <span className="text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        {integrity.reports.pendingCount} PENDING
                      </span>
                    )}
                  </div>
                </div>

                {/* If mismatches found, show the Reconcile button */}
                {(integrity.rtLedger.mismatchCount > 0) && (
                  <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-3">
                    <div className="flex items-start gap-2 text-rose-400 text-[9px] leading-relaxed">
                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">データベースの不整合が検出されました。</p>
                        <p className="opacity-80">取引履歴の合計値とユーザーの表示残高が一致していません。バグや不正、または通信遮断が原因の可能性があります。自動修復を実行してください。</p>
                      </div>
                    </div>

                    <button
                      onClick={handleFixIntegrity}
                      disabled={isFixingIntegrity}
                      className="w-full bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 text-[10px] font-bold tracking-widest py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/10"
                    >
                      {isFixingIntegrity ? <RefreshCw size={10} className="animate-spin" /> : <Wrench size={12} />}
                      RECONCILE DATABASE / 自動修復を実行
                    </button>
                  </div>
                )}

                {integrity.isHealthy && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-emerald-400 text-[9px]">
                    <CheckCircle size={14} />
                    <span>All system metrics are aligned. Protocol fully secure. / システムの整合性は保たれています。</span>
                  </div>
                )}

                {message && (
                  <div className="p-2.5 bg-white/[0.02] border border-white/10 rounded-lg text-[8px] text-azure-400">
                    {message}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-white/30 text-[9px] py-4">
                No diagnostic report loaded.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
