import { Users, CreditCard, Activity, Database, TrendingUp, ShieldCheck, ArrowRight, Shield, BookOpen, Layers, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
    redirect("/hub");
  }

  // サーバーサイドで全統計データを取りきる
  const [activeUsers, issuedCards, totalCP, reportCount] = await Promise.all([
    prisma.user.count(),
    prisma.card.count({ where: { status: "active" } }),
    prisma.user.aggregate({ _sum: { rt_balance: true } }),
    prisma.report.count({ where: { status: "pending" } })
  ]);

  const stats = {
    activeUsers: activeUsers.toString(),
    issuedCards: issuedCards.toString(),
    totalCP: (totalCP._sum.rt_balance || 0n).toString(),
  };

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16">
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2">Admin Panel</h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase italic font-bold">Hexa System / 管理ハブ v1.0.2</p>
      </header>

      <AdminDashboardClient stats={stats} reportCount={reportCount} />
    </div>
  );
}
