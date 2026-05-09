"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AdminNotificationBadge() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/admin/report/count", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      }
    } catch (e) {
      // 静かに無視
    }
  };

  useEffect(() => {
    fetchCount();
    // 60秒ごとに更新
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) {
    return (
      <Link href="/admin/reports" className="hover:text-azure-400 hover:opacity-100 transition-colors flex items-center gap-2">
        <ShieldAlert size={12}/> 通報・違反
      </Link>
    );
  }

  return (
    <Link href="/admin/reports" className="text-rose-500 hover:text-rose-400 transition-colors flex items-center gap-2 font-bold relative group">
      <ShieldAlert size={12} className="animate-pulse" /> 
      通報・違反
      <span className="absolute -top-1 -right-3 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 text-[6px] text-white items-center justify-center font-mono">
          {count > 9 ? "!" : count}
        </span>
      </span>
    </Link>
  );
}
