import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Database, ShieldAlert, Newspaper, Users, BookOpen } from "lucide-react";
import AdminNotificationBadge from "@/components/admin/AdminNotificationBadge";
import OrderNotificationBadge from "@/components/admin/OrderNotificationBadge";
import InquiryNotificationBadge from "@/components/admin/InquiryNotificationBadge";

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
      <nav className="border-b border-white/10 p-4 bg-void/95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/admin" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={32} 
              height={32} 
              priority 
              fetchPriority="high"
              className="object-contain" 
            />
            <div className="flex flex-col">
              <span className="text-sm tracking-[0.4em] uppercase font-light">Admin Panel</span>
              <span className="text-[8px] tracking-[0.2em] opacity-40 uppercase">Hexa System Admin</span>
            </div>
          </Link>
          <div className="flex gap-8 text-[9px] uppercase tracking-[0.2em] font-bold">
             <Link href="/admin/users" className="opacity-60 hover:text-azure-400 hover:opacity-100 transition-colors flex items-center gap-2"><Users size={12}/> ユーザー</Link>
             <Link href="/admin/news" className="opacity-60 hover:text-azure-400 hover:opacity-100 transition-colors flex items-center gap-2"><Newspaper size={12}/> お知らせ配信</Link>
             <Link href="/admin/logs" className="opacity-60 hover:text-azure-400 hover:opacity-100 transition-colors flex items-center gap-2"><Database size={12}/> システムログ</Link>
             <InquiryNotificationBadge />
             <OrderNotificationBadge />
             <AdminNotificationBadge />
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
