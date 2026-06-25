import { Metadata } from "next";
import { Hexagon, Smartphone, QrCode, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Activate Card / 有効化",
  description: "Hexa Card を有効化（アクティベート）する手順のご案内。",
};

export default function ActivateInstructionPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-void text-moonlight">
      <div className="max-w-md w-full space-y-12 py-12">
        <header className="space-y-4">
          <div className="w-12 h-12 border border-azure-500/30 bg-azure-500/5 flex items-center justify-center mx-auto rotate-45 mb-6">
             <Hexagon size={20} className="text-azure-400 -rotate-45" />
          </div>
          <h2 className="text-2xl tracking-[0.4em] uppercase font-light text-white">Activate / 有効化</h2>
          <p className="text-[12px] tracking-[0.2em] font-bold text-azure-400">
            物理カードの有効化手順 / Physical Card Activation
          </p>
        </header>

        <div className="space-y-8 text-left bg-white/[0.01] border border-white/5 p-8 rounded-sm">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] shrink-0 font-bold">1</div>
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-2">
                <Smartphone size={14} className="text-azure-400" /> NFC Touch / カードをかざす
              </h3>
              <p className="text-[10px] opacity-40 leading-relaxed tracking-wider font-sans">
                スマートフォンのNFC読み取り部分に Hexa Card をかざしてください。自動的にあなた専用の登録URL（アクティベーション画面）が開きます。
              </p>
              
              {/* NFC Alignment Guide */}
              <div className="grid grid-cols-2 gap-4 mt-4 max-w-xs">
                {/* iPhone Spot */}
                <div className="flex flex-col items-center p-3 bg-white/[0.01] border border-white/5 rounded-sm">
                  <svg className="w-10 h-14 text-azure-400" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="28" height="48" rx="4" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <rect x="7.5" y="7.5" width="25" height="45" rx="3" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" />
                    <rect x="15" y="9" width="10" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
                    <path d="M 14,6 L 26,6" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="20" cy="6" r="4" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
                    <circle cx="20" cy="6" r="8" stroke="rgba(96,165,250,0.4)" strokeWidth="0.5" />
                    <circle cx="20" cy="6" r="2" fill="#60a5fa" />
                  </svg>
                  <span className="text-[8px] text-white/60 font-bold mt-1.5">iPhone: 上端にタッチ</span>
                </div>
                {/* Android Spot */}
                <div className="flex flex-col items-center p-3 bg-white/[0.01] border border-white/5 rounded-sm">
                  <svg className="w-10 h-14 text-azure-400" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="28" height="48" rx="4" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <rect x="9" y="9" width="5" height="10" rx="1" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
                    <circle cx="11.5" cy="11.5" r="1" fill="rgba(255,255,255,0.3)" />
                    <circle cx="11.5" cy="16.5" r="1" fill="rgba(255,255,255,0.3)" />
                    <rect x="15" y="25" width="10" height="10" rx="1" stroke="rgba(96,165,250,0.25)" strokeWidth="0.6" strokeDasharray="1.5 1" />
                    <circle cx="20" cy="30" r="4" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
                    <circle cx="20" cy="30" r="8" stroke="rgba(96,165,250,0.4)" strokeWidth="0.5" />
                    <circle cx="20" cy="30" r="2" fill="#60a5fa" />
                  </svg>
                  <span className="text-[8px] text-white/60 font-bold mt-1.5">Android: 背面中央</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] shrink-0 font-bold">2</div>
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-2">
                <QrCode size={14} className="text-azure-400" /> QR Code Scan / QR読み取り
              </h3>
              <p className="text-[10px] opacity-40 leading-relaxed tracking-wider font-sans">
                NFC読み取りに対応していないスマートフォンの場合は、カードに付属のQRコードをスキャンして登録画面へアクセスしてください。
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <Link
            href="/"
            className="w-full py-4 border border-white/10 text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2 rounded-full font-bold"
          >
            <ArrowLeft size={12} /> Return to Home / ホームへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
