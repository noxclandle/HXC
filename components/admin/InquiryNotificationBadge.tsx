"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function InquiryNotificationBadge() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/admin/contacts/count", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      }
    } catch (e) {
      // Quiet fail
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) {
    return (
      <Link href="/admin/contacts" className="opacity-60 hover:text-azure-400 hover:opacity-100 transition-colors flex items-center gap-2">
        <MessageSquare size={12}/> 問い合わせ管理
      </Link>
    );
  }

  return (
    <Link href="/admin/contacts" className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-2 font-bold relative group cursor-pointer" title={`${count} 件の未対応の問い合わせがあります`}>
      <MessageSquare size={12} className="animate-pulse" /> 
      問い合わせ管理
      <span className="absolute -top-1 -right-3 flex h-3 w-3 pointer-events-none">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 text-[6px] text-white items-center justify-center font-mono">
          {count > 9 ? "!" : count}
        </span>
      </span>
    </Link>
  );
}
