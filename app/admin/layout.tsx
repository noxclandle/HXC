import { Metadata } from "next";
import Link from "next/link";
import { Database, ShieldAlert, Newspaper, Users, BookOpen } from "lucide-react";
import AdminNotificationBadge from "@/components/admin/AdminNotificationBadge";
import OrderNotificationBadge from "@/components/admin/OrderNotificationBadge";

export const metadata: Metadata = {
  title: "Admin | Hexa System",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-void text-moonlight">
      <nav className="border-b border-white/10 p-4 bg-void/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/admin" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <div className="flex flex-col">
              <span className="text-sm tracking-[0.4em] uppercase font-light">Central Oversight</span>
              <span className="text-[8px] tracking-[0.2em] opacity-40 uppercase">Hexa System Admin</span>
            </div>
          </Link>
          <div className="flex gap-8 text-[9px] uppercase tracking-[0.2em] font-bold">
             <Link href="/admin/users" className="opacity-60 hover:text-azure-400 hover:opacity-100 transition-colors flex items-center gap-2"><Users size={12}/> ユーザー</Link>
             <Link href="/admin/news" className="opacity-60 hover:text-azure-400 hover:opacity-100 transition-colors flex items-center gap-2"><Newspaper size={12}/> お知らせ配信</Link>
             <OrderNotificationBadge />
             <AdminNotificationBadge />
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
