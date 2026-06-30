import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, TrendingUp, CreditCard, Gem, Calendar, DollarSign, Package, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSalesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
    redirect("/hub");
  }

  // 1. Fetch physical card orders
  const orders = await prisma.order.findMany({
    orderBy: { created_at: "desc" }
  });

  // 2. Fetch digital RT purchases via Stripe
  const rtTransactions = await prisma.rTTransaction.findMany({
    where: {
      description: {
        startsWith: "Stripe RT Purchase"
      }
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: { created_at: "desc" }
  });

  // Map RT amount to JPY price based on Shop packages
  const getRtPrice = (amount: number) => {
    if (amount <= 2000) return 1000;
    if (amount <= 11000) return 5000;
    if (amount <= 23000) return 10000;
    // Fallback proportional rate (~0.43 JPY per RT)
    return Math.round(amount * 0.434);
  };

  // 3. Aggregate data
  const salesByMonth: Record<string, { cardSales: number; rtSales: number; cardCount: number; rtCount: number }> = {};
  const salesByYear: Record<string, { cardSales: number; rtSales: number; cardCount: number; rtCount: number }> = {};

  let totalCardRevenue = 0;
  let totalRtRevenue = 0;

  // Process physical card orders
  orders.forEach(order => {
    const date = new Date(order.created_at);
    const year = date.getFullYear().toString();
    const month = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const price = order.price; // Price is stored in JPY

    totalCardRevenue += price;

    if (!salesByMonth[month]) {
      salesByMonth[month] = { cardSales: 0, rtSales: 0, cardCount: 0, rtCount: 0 };
    }
    salesByMonth[month].cardSales += price;
    salesByMonth[month].cardCount += 1;

    if (!salesByYear[year]) {
      salesByYear[year] = { cardSales: 0, rtSales: 0, cardCount: 0, rtCount: 0 };
    }
    salesByYear[year].cardSales += price;
    salesByYear[year].cardCount += 1;
  });

  // Process RT transactions
  rtTransactions.forEach(tx => {
    const date = new Date(tx.created_at);
    const year = date.getFullYear().toString();
    const month = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const price = getRtPrice(tx.amount);

    totalRtRevenue += price;

    if (!salesByMonth[month]) {
      salesByMonth[month] = { cardSales: 0, rtSales: 0, cardCount: 0, rtCount: 0 };
    }
    salesByMonth[month].rtSales += price;
    salesByMonth[month].rtCount += 1;

    if (!salesByYear[year]) {
      salesByYear[year] = { cardSales: 0, rtSales: 0, cardCount: 0, rtCount: 0 };
    }
    salesByYear[year].rtSales += price;
    salesByYear[year].rtCount += 1;
  });

  const sortedMonths = Object.keys(salesByMonth).sort((a, b) => b.localeCompare(a));
  const sortedYears = Object.keys(salesByYear).sort((a, b) => b.localeCompare(a));

  const totalRevenue = totalCardRevenue + totalRtRevenue;

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/admin" className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-4">
            <ArrowLeft size={12} /> Back to Admin / 管理ハブへ戻る
          </Link>
          <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2">Sales & Revenue / 売上管理</h1>
          <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase italic font-bold">Financial Analysis Dashboard / 財務集計パネル</p>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded">
          <Clock size={14} className="text-azure-400 opacity-60" />
          <span className="text-[9px] tracking-widest uppercase opacity-60">Last Sync: Just Now / 自動同期完了</span>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white/[0.02] border border-white/10 rounded relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-azure-500/[0.01] rounded-full blur-2xl animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="flex justify-between items-start mb-4">
            <p className="text-[9px] tracking-[0.3em] uppercase opacity-40 font-bold font-mono">Total Sales / 累計売上高</p>
            <DollarSign size={14} className="text-azure-400" />
          </div>
          <p className="text-3xl font-extralight tracking-wider text-white">¥{totalRevenue.toLocaleString()}</p>
          <p className="text-[8px] tracking-widest opacity-30 mt-2 uppercase">Physical Cards + Digital RT Purchases</p>
        </div>

        <div className="p-6 bg-white/[0.02] border border-white/10 rounded relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-bronze-500/[0.01] rounded-full blur-2xl" />
          <div className="flex justify-between items-start mb-4">
            <p className="text-[9px] tracking-[0.3em] uppercase opacity-40 font-bold font-mono">Physical Card Sales / 物理カード売上</p>
            <CreditCard size={14} className="text-bronze-400" />
          </div>
          <p className="text-3xl font-extralight tracking-wider text-white">¥{totalCardRevenue.toLocaleString()}</p>
          <p className="text-[8px] tracking-widest opacity-30 mt-2 uppercase">Based on {orders.length} card orders</p>
        </div>

        <div className="p-6 bg-white/[0.02] border border-white/10 rounded relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-azure-500/[0.01] rounded-full blur-2xl" />
          <div className="flex justify-between items-start mb-4">
            <p className="text-[9px] tracking-[0.3em] uppercase opacity-40 font-bold font-mono">Digital RT Sales / RTチャージ売上</p>
            <Gem size={14} className="text-azure-400" />
          </div>
          <p className="text-3xl font-extralight tracking-wider text-white">¥{totalRtRevenue.toLocaleString()}</p>
          <p className="text-[8px] tracking-widest opacity-30 mt-2 uppercase">From {rtTransactions.length} Stripe sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Monthly Sales Table */}
        <div className="p-6 bg-white/[0.02] border border-white/10 rounded space-y-6">
          <h2 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white flex items-center gap-2">
            <Calendar size={14} className="text-azure-400" /> Monthly Revenue / 月別売上推移
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-[9px] tracking-widest uppercase opacity-40">
                  <th className="py-3 font-semibold">Month / 月</th>
                  <th className="py-3 font-semibold text-right">Card Sales / 物理</th>
                  <th className="py-3 font-semibold text-right">RT Sales / デジタル</th>
                  <th className="py-3 font-semibold text-right text-white">Total / 合計</th>
                </tr>
              </thead>
              <tbody>
                {sortedMonths.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center opacity-35 uppercase tracking-widest text-[9px]">No records found. / 記録がありません</td>
                  </tr>
                ) : (
                  sortedMonths.map(month => {
                    const data = salesByMonth[month];
                    const monthTotal = data.cardSales + data.rtSales;
                    return (
                      <tr key={month} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 font-bold text-white">{month}</td>
                        <td className="py-4 text-right opacity-75">¥{data.cardSales.toLocaleString()} <span className="text-[9px] opacity-30">({data.cardCount})</span></td>
                        <td className="py-4 text-right opacity-75">¥{data.rtSales.toLocaleString()} <span className="text-[9px] opacity-30">({data.rtCount})</span></td>
                        <td className="py-4 text-right font-bold text-azure-400">¥{monthTotal.toLocaleString()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yearly Sales Table */}
        <div className="p-6 bg-white/[0.02] border border-white/10 rounded space-y-6">
          <h2 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white flex items-center gap-2">
            <Calendar size={14} className="text-azure-400" /> Yearly Revenue / 年別売上推移
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-[9px] tracking-widest uppercase opacity-40">
                  <th className="py-3 font-semibold">Year / 年</th>
                  <th className="py-3 font-semibold text-right">Card Sales / 物理</th>
                  <th className="py-3 font-semibold text-right">RT Sales / デジタル</th>
                  <th className="py-3 font-semibold text-right text-white">Total / 合計</th>
                </tr>
              </thead>
              <tbody>
                {sortedYears.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center opacity-35 uppercase tracking-widest text-[9px]">No records found. / 記録がありません</td>
                  </tr>
                ) : (
                  sortedYears.map(year => {
                    const data = salesByYear[year];
                    const yearTotal = data.cardSales + data.rtSales;
                    return (
                      <tr key={year} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 font-bold text-white">{year}</td>
                        <td className="py-4 text-right opacity-75">¥{data.cardSales.toLocaleString()} <span className="text-[9px] opacity-30">({data.cardCount})</span></td>
                        <td className="py-4 text-right opacity-75">¥{data.rtSales.toLocaleString()} <span className="text-[9px] opacity-30">({data.rtCount})</span></td>
                        <td className="py-4 text-right font-bold text-azure-400">¥{yearTotal.toLocaleString()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Card Orders */}
        <div className="p-6 bg-white/[0.02] border border-white/10 rounded space-y-6">
          <h2 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white flex items-center gap-2">
            <Package size={14} className="text-bronze-400" /> Recent Card Orders / 直近の物理カード注文
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {orders.length === 0 ? (
              <p className="text-center py-12 text-[10px] uppercase tracking-widest opacity-35">No orders recorded. / 注文記録がありません</p>
            ) : (
              orders.slice(0, 10).map(order => (
                <div key={order.id} className="p-4 bg-white/[0.01] border border-white/5 rounded flex justify-between items-center text-xs font-mono">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-white truncate">{order.customer_name}</span>
                      <span className="text-[7px] px-1.5 py-0.5 border border-white/10 text-white/50 uppercase tracking-widest">{order.tier}</span>
                    </div>
                    <p className="text-[9px] text-white/40 truncate">{order.customer_email}</p>
                    <p className="text-[8px] text-white/20">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-bold text-white">¥{order.price.toLocaleString()}</p>
                    <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase tracking-wider">{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent RT Charge Sessions */}
        <div className="p-6 bg-white/[0.02] border border-white/10 rounded space-y-6">
          <h2 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white flex items-center gap-2">
            <Gem size={14} className="text-azure-400" /> Recent RT Charges / 直近のRTチャージ履歴
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {rtTransactions.length === 0 ? (
              <p className="text-center py-12 text-[10px] uppercase tracking-widest opacity-35">No points purchased. / チャージ記録がありません</p>
            ) : (
              rtTransactions.slice(0, 10).map(tx => {
                const jpyPrice = getRtPrice(tx.amount);
                return (
                  <div key={tx.id} className="p-4 bg-white/[0.01] border border-white/5 rounded flex justify-between items-center text-xs font-mono">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-white truncate">{tx.user?.name || "Member"}</span>
                        <span className="text-[7px] px-1.5 py-0.5 border border-azure-500/30 text-azure-400 uppercase tracking-widest">+{tx.amount} RT</span>
                      </div>
                      <p className="text-[9px] text-white/40 truncate">{tx.user?.email || "Unknown"}</p>
                      <p className="text-[8px] text-white/20">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-bold text-azure-400">¥{jpyPrice.toLocaleString()}</p>
                      <span className="text-[7px] text-white/40 uppercase tracking-wider">Stripe</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
