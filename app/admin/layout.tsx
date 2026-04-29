import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin | Hexa Ledger",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-void text-moonlight">
      <nav className="border-b border-moonlight/10 p-4 bg-gothic-dark/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/admin" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <div className="text-sm tracking-[0.4em] uppercase font-light">Hexa Card Ledger <span className="text-[10px] opacity-40">v0.1</span></div>
          </Link>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest opacity-60">
             <a href="/admin/ledger" className="hover:opacity-100 transition-opacity">中央台帳</a>
             <a href="/admin/users" className="hover:opacity-100 transition-opacity">ユーザー管理</a>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
