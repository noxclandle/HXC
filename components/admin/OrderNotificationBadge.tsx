"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package } from "lucide-react";

export default function OrderNotificationBadge() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/admin/order/count", { cache: "no-store" });
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
      <Link href="/admin/registry" className="opacity-60 hover:text-azure-400 hover:opacity-100 transition-colors flex items-center gap-2">
        <Package size={12}/> カード台帳
      </Link>
    );
  }

  return (
    <Link href="/admin/registry#orders" className="text-azure-400 hover:text-azure-300 transition-colors flex items-center gap-2 font-bold relative group cursor-pointer" title={`${count} 件の未発送の注文があります`}>
      <Package size={12} className="animate-pulse" /> 
      カード台帳
      <span className="absolute -top-1 -right-3 flex h-3 w-3 pointer-events-none">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-azure-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-azure-500 text-[6px] text-white items-center justify-center font-mono">
          {count > 9 ? "!" : count}
        </span>
      </span>
    </Link>
  );
}
