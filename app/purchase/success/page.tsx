import Link from "next/link";
import { CheckCircle, Shield } from "lucide-react";

export default function PurchaseSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mb-8 bg-white/5">
        <CheckCircle size={32} className="text-white" />
      </div>
      
      <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase mb-4">
        決済が完了しました
      </h1>
      
      <p className="text-sm tracking-widest text-white/50 max-w-md leading-relaxed mb-12">
        ご注文ありがとうございます。<br />
        これよりカードの製造・発行手続きに入ります。<br />
        お手元に届くまで通常2週間前後のお時間をいただいております。<br />
        カードがお手元に届きましたら、スマートフォンにかざしてアカウントのアクティベーション（本登録）を完了させてください。
      </p>
      
      <Link 
        href="/"
        className="px-8 py-4 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3"
      >
        <Shield size={14} /> トップページへ戻る
      </Link>
    </div>
  );
}
