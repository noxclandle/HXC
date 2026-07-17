"use client";

import { Printer, ArrowRight } from "lucide-react";

const DIFFERENTIATORS = [
  {
    title: "買い切りなのに、システムは進化し続ける",
    body: "多くの買い切り型サービス（プレーリーカード、lit.link∞など）は静的なプロフィールページの表示で終わります。Hexa Cardは買い切り価格のまま、共鳴接続・RT経済・月次レポートなど、クラウド上で継続的に進化するシステムを無償で提供し続けます。",
  },
  {
    title: "実名前提ではない、エイリアス対応",
    body: "Eight・A-Meishiなど主要な名刺サービスは実名でのビジネス利用が前提です。Hexa Cardはハンドルネームや活動アバターでの登録を標準サポートしており、クリエイターやVTuberなど「もう一つの顔」を持つ層にも刺さります。",
  },
  {
    title: "静的デザインで終わらない、体験としての名刺",
    body: "競合の多くはテンプレート選択止まりです。Hexa Cardはカードを開いた瞬間のアニメーション・フレーム演出・BGMを標準搭載し、名刺交換の瞬間そのものを演出できます。",
  },
  {
    title: "渡して終わりではない、双方向のネットワーク",
    body: "一般的なデジタル名刺は一方通行の表示ツールです。Hexa Cardは「共鳴接続」でユーザー同士がつながり、紹介プログラムや実績称号など、渡した後も関係が育っていく仕組みを持っています。",
  },
];

const COMPARISON = [
  { axis: "料金モデル", hexa: "買い切り＋無償アップデート", eight: "無料＋月額600円(Premium)", prairie: "買い切り(¥3,480〜)", ameishi: "月額500円〜" },
  { axis: "物理NFCカード", hexa: "◎ 標準", eight: "× 非対応", prairie: "◎ 標準", ameishi: "× 非対応" },
  { axis: "エイリアス対応", hexa: "◎ 標準搭載", eight: "× 実名前提", prairie: "△ 想定外", ameishi: "△ 想定外" },
  { axis: "動的ビジュアル/BGM", hexa: "◎ 標準搭載", eight: "× 非対応", prairie: "× 非対応", ameishi: "△ 3Dアバター(要追加課金)" },
  { axis: "紙名刺のOCR取込", hexa: "◎ 標準搭載", eight: "◎ 主力機能", prairie: "× 非対応", ameishi: "× 非対応" },
  { axis: "会員間ネットワーク", hexa: "◎ 共鳴接続/紹介制度", eight: "△ 名刺管理のみ", prairie: "× 非対応", ameishi: "× 非対応" },
];

const PRICING = [
  { name: "Standard", price: "¥3,000", note: "オリジナルデザイン / 初期3,000RT / 永続利用権" },
  { name: "Executive", price: "¥20,000", note: "メタリック(Silver/Gold) / 優先発行レーン" },
  { name: "Apex", price: "¥1,000,000", note: "全世界10枠限定 / 限定称号 / 専属コンシェルジュ" },
  { name: "Corporate", price: "¥5,800 / 枚", note: "最低100枚〜 / 法人ロゴ・カラー対応" },
];

const OBJECTIONS = [
  {
    q: "月額の方が導入しやすいのでは？",
    a: "初期費用のハードルはあるが、名刺は配布して終わりではなく「渡した後も使われ続ける」もの。月額課金は使うたびにコストが積み上がる一方、Hexa Cardは一度の投資で生涯利用でき、総コストは早い段階で逆転する。",
  },
  {
    q: "買い切りなのに、どうやって運用を続けているのか？",
    a: "新規カードの販売収益でクラウド側の運用・機能追加を継続している。既存ユーザーへの追加課金は発生しない設計。",
  },
  {
    q: "Androidでも使えるか？",
    a: "iOS/Android問わず、NFC対応スマートフォンの標準ブラウザで動作。専用アプリのインストールは不要。",
  },
  {
    q: "カードを紛失したら情報が漏れないか？",
    a: "カード自体には個人情報を直接書き込んでおらず、サーバー上の暗号化プロフィールとUIDで紐付いている。紛失時は管理画面から即座にリンク解除・無効化が可能。",
  },
];

export default function PitchClient() {
  return (
    <div className="min-h-screen bg-void text-moonlight px-6 py-16 print:bg-white print:text-black">
      <div className="max-w-4xl mx-auto space-y-20 print:space-y-10">
        {/* Print Button (hidden on print) */}
        <div className="print:hidden flex justify-end">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-[10px] tracking-[0.2em] uppercase hover:bg-white/5 transition-all rounded"
          >
            <Printer size={12} /> Print / PDF出力
          </button>
        </div>

        {/* Hero */}
        <section className="text-center space-y-6 pb-10 border-b border-white/10 print:border-black/20">
          <span className="text-[9px] tracking-[0.4em] uppercase text-azure-400 print:text-black font-mono font-bold">
            Hexa Card / 提案資料
          </span>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide">
            紙名刺を、進化し続けるデジタル資産へ。
          </h1>
          <p className="text-sm text-white/60 print:text-black/70 max-w-xl mx-auto leading-relaxed">
            NFCタップ一つで、あなたのすべての存在とポートフォリオを相手のスマートフォンへ。
            買い切り価格で、クラウド側の機能は無償で進化し続けます。
          </p>
        </section>

        {/* Differentiators */}
        <section className="space-y-8 break-inside-avoid">
          <h2 className="text-lg tracking-widest uppercase font-bold border-l-4 border-azure-500 pl-4">
            同業にはない4つの価値
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map((d, i) => (
              <div key={i} className="p-5 border border-white/10 print:border-black/20 rounded-lg space-y-2">
                <span className="text-[10px] font-mono text-azure-400 print:text-black font-bold">0{i + 1}</span>
                <h3 className="text-sm font-bold">{d.title}</h3>
                <p className="text-xs text-white/50 print:text-black/70 leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-6 break-inside-avoid">
          <h2 className="text-lg tracking-widest uppercase font-bold border-l-4 border-purple-500 pl-4">
            競合比較（2026年7月時点の各社公開情報ベース）
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-white/20 print:border-black/30">
                  <th className="py-3 pr-4 font-mono text-[9px] uppercase text-white/40 print:text-black/50">項目</th>
                  <th className="py-3 px-4 font-mono text-[9px] uppercase bg-purple-500/10 print:bg-black/5">Hexa Card</th>
                  <th className="py-3 px-4 font-mono text-[9px] uppercase text-white/40 print:text-black/50">Eight</th>
                  <th className="py-3 px-4 font-mono text-[9px] uppercase text-white/40 print:text-black/50">プレーリーカード</th>
                  <th className="py-3 pl-4 font-mono text-[9px] uppercase text-white/40 print:text-black/50">A-Meishi</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 print:border-black/10">
                    <td className="py-3 pr-4 font-bold text-white/70 print:text-black/80">{row.axis}</td>
                    <td className="py-3 px-4 font-bold bg-purple-500/[0.04] print:bg-black/[0.02]">{row.hexa}</td>
                    <td className="py-3 px-4 text-white/40 print:text-black/60">{row.eight}</td>
                    <td className="py-3 px-4 text-white/40 print:text-black/60">{row.prairie}</td>
                    <td className="py-3 pl-4 text-white/40 print:text-black/60">{row.ameishi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[9px] text-white/25 print:text-black/40">
            ※ 各社の公開情報を基にした一般的な比較であり、仕様は変更される場合があります。商談の場では「現時点の情報として」と一言添えてください。
          </p>
        </section>

        {/* Pricing */}
        <section className="space-y-6 break-inside-avoid">
          <h2 className="text-lg tracking-widest uppercase font-bold border-l-4 border-emerald-500 pl-4">
            価格帯
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {PRICING.map((p, i) => (
              <div key={i} className="p-5 border border-white/10 print:border-black/20 rounded-lg text-center space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest">{p.name}</h3>
                <p className="text-xl font-light">{p.price}</p>
                <p className="text-[9px] text-white/40 print:text-black/60 leading-relaxed">{p.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Objection Handling */}
        <section className="space-y-6 break-inside-avoid">
          <h2 className="text-lg tracking-widest uppercase font-bold border-l-4 border-amber-500 pl-4">
            想定質問への回答例
          </h2>
          <div className="space-y-5">
            {OBJECTIONS.map((o, i) => (
              <div key={i} className="space-y-1">
                <p className="text-xs font-bold">Q. {o.q}</p>
                <p className="text-xs text-white/50 print:text-black/70 leading-relaxed pl-4">A. {o.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-4 pt-10 border-t border-white/10 print:border-black/20 print:hidden">
          <p className="text-xs text-white/40">この資料は検索エンジンには表示されません。商談の際にURLを直接共有してください。</p>
          <a
            href="/purchase"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-void text-[10px] font-bold tracking-widest uppercase rounded-full hover:bg-zinc-200 transition-all"
          >
            発注ページを見る <ArrowRight size={12} />
          </a>
        </section>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 1.5cm;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
