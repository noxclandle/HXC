import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default function LockdownPage() {
  return (
    <div className="min-h-screen bg-void text-moonlight flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <ShieldAlert size={40} className="mx-auto text-rose-500" />
        <h1 className="text-lg tracking-[0.4em] uppercase font-bold">System Lockdown</h1>
        <p className="text-[11px] leading-relaxed tracking-widest opacity-60 uppercase">
          現在、緊急メンテナンスのためシステムへのアクセスを一時的に制限しています。
          しばらく経ってから再度お試しください。
        </p>
      </div>
    </div>
  );
}
