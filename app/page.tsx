import { ShieldCheck, Zap, CreditCard, Smartphone, Share2, Code, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/ui/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://virtual-business-card.hexa-relation.com/",
  },
};

/**
 * 究極の Safari 最適化 (Pure Static Edition)
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-void text-moonlight">
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center relative max-w-4xl mx-auto w-full pb-32">
        
        {/* Logo Section */}
        <div className="relative mb-12 mt-20">
          <div className="relative z-10 w-[160px] h-[160px] md:w-[200px] md:h-[200px]">
             <Image 
               src="/logo.png" 
               alt="Hexa Relation Logo" 
               width={200}
               height={200}
               priority
               className="object-contain" 
             />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.25em] uppercase mb-4 text-white">
          Hexa Card
          <span className="block text-[9px] tracking-[0.4em] opacity-30 mt-6 leading-relaxed">アイデンティティの透過 / Permeation of Identity</span>
        </h1>

        <p className="text-white/40 max-w-sm mb-12 tracking-[0.2em] text-[10px] md:text-[11px] leading-relaxed uppercase px-4">
          Connecting physical and digital identities / 物理とデジタルのアイデンティティを繋ぐ<br />
          Redefining business networking / ビジネスネットワーキングの再定義
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full max-w-2xl px-4 mb-16 z-10">
          <Link
            href="/purchase"
            className="w-full md:w-auto px-6 md:px-8 h-[56px] bg-white text-void tracking-[0.4em] uppercase text-[10px] font-bold flex items-center justify-center gap-2 rounded-full hover:bg-zinc-200 transition-all"
          >
            <CreditCard size={12} /> Order Card / 購入
          </Link>

          <Link
            href="/features"
            className="w-full md:w-auto px-6 md:px-8 h-[56px] border border-white/10 tracking-[0.3em] uppercase text-[10px] font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center rounded-full"
          >
            Showcase / 機能紹介
          </Link>

          <Link
            href="/login"
            className="w-full md:w-auto px-6 md:px-8 h-[56px] border border-white/10 tracking-[0.3em] uppercase text-[10px] font-bold text-azure-400/80 hover:bg-white/5 hover:text-azure-400 transition-all flex items-center justify-center rounded-full"
          >
            Member Login / ログイン
          </Link>
        </div>

        {/* Easy visual Flow Diagram */}
        <section className="w-full max-w-xl border border-white/5 bg-white/[0.01] p-8 rounded-2xl mb-16">
          <h2 className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/50 mb-8">
            How it works / スマート名刺の仕組み
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative px-4">
            
            {/* Step 1: Card */}
            <div className="flex flex-col items-center space-y-3 z-10 w-24">
              <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/60">
                <CreditCard size={20} />
              </div>
              <span className="text-[9px] tracking-wider font-bold">1. Tap Card / カードをかざす</span>
              <p className="text-[7px] text-white/30 tracking-widest leading-relaxed">物理カードを相手のスマートフォンにかざすだけ / Simply tap the physical card to any smartphone.</p>
            </div>

            {/* Connection Arrow/Ripple 1 */}
            <div className="hidden md:flex flex-col items-center flex-grow opacity-20">
              <span className="text-[8px] tracking-[0.2em] font-mono animate-pulse">NFC WAVE</span>
              <div className="w-full h-px border-t border-dashed border-white/30 my-2" />
              <Zap size={10} className="text-azure-400" />
            </div>

            {/* Step 2: Phone */}
            <div className="flex flex-col items-center space-y-3 z-10 w-24">
              <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/60">
                <Smartphone size={20} />
              </div>
              <span className="text-[9px] tracking-wider font-bold">2. Instant Sync / 瞬時の同期</span>
              <p className="text-[7px] text-white/30 tracking-widest leading-relaxed">専用アプリ不要。ブラウザが自動起動し接続 / No app required. The browser opens automatically.</p>
            </div>

            {/* Connection Arrow/Ripple 2 */}
            <div className="hidden md:flex flex-col items-center flex-grow opacity-20">
              <span className="text-[8px] tracking-[0.2em] font-mono animate-pulse">RESONANCE</span>
              <div className="w-full h-px border-t border-dashed border-white/30 my-2" />
              <Sparkles size={10} className="text-azure-400" />
            </div>

            {/* Step 3: Server/Profile */}
            <div className="flex flex-col items-center space-y-3 z-10 w-24">
              <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/60">
                <Share2 size={20} />
              </div>
              <span className="text-[9px] tracking-wider font-bold">3. Connection / つながりの構築</span>
              <p className="text-[7px] text-white/30 tracking-widest leading-relaxed">あなたのアイデンティティを美しく展開・保存 / Share and save your digital identity elegantly.</p>
            </div>

          </div>
        </section>

        {/* Core Capabilities Section */}
        <section className="w-full max-w-2xl mb-16 text-left px-4">
          <h2 className="text-[9px] tracking-[0.5em] uppercase font-bold text-azure-400 mb-8 border-l border-azure-500 pl-4">
            System Capabilities / 主な実装機能
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">Physical-Digital Resonance / 物理とデジタルの同期</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
                NFC (近距離無線通信) 技術を用いて、カードをタップするだけで最新のプロフィールデータを相手のスマートフォンに即座に透過展開します。 <br />
                <span className="text-[8px] opacity-60 mt-1 block">Seamlessly transmit your latest profile data to any smartphone with a simple card tap using NFC technology.</span>
              </p>
            </div>

            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">Infinite Customize / 豊富なアセット機能</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
                Relation Token（RT）を使用し、フレーム、背景、エフェクト、さらには共鳴サウンドなどを自由に解禁・装着し、独自の世界観を構築可能。 <br />
                <span className="text-[8px] opacity-60 mt-1 block">Use Relation Tokens (RT) to unlock and equip custom frames, backgrounds, effects, and resonance sounds.</span>
              </p>
            </div>

            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">AI-OCR Document Scan / アナログ名刺のOCR解析</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
                カメラで撮影した従来の紙名刺から、AI（OCR）が文字情報を自動解析し、システム内のデジタル名刺ライブラリへと一括保存します。 <br />
                <span className="text-[8px] opacity-60 mt-1 block">Scan traditional paper cards with the AI-OCR camera, automatically converting and saving them to your digital library.</span>
              </p>
            </div>

            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">Strict iOS Alignment / 完全なSafari・iPhone対応</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
                iOSでの動作安定に特化したCSSアニメーション設計と、iPhone連絡先に画像付きで一発登録可能な独自規格vCard出力を実現。 <br />
                <span className="text-[8px] opacity-60 mt-1 block">Engineered with Safari-optimized CSS animations and a vCard output for seamless contact saving on iOS.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Specifications & Technical Details Section */}
        <section className="w-full max-w-2xl mb-16 text-left px-4">
          <h2 className="text-[9px] tracking-[0.5em] uppercase font-bold text-azure-400 mb-8 border-l border-azure-500 pl-4">
            Technical Specifications / 技術仕様と対応規格
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">Hardware Standard / ハードウェア規格</h3>
              <ul className="text-[9px] text-white/40 space-y-2 tracking-wider leading-relaxed list-disc pl-4">
                <li>通信チップ: NTAG213 / NTAG215 高感度NFCICチップ搭載</li>
                <li>動作周波数: 13.56 MHz (近接型無線通信プロトコル準拠)</li>
                <li>データフォーマット: NDEF (NFC Data Exchange Format) 規格</li>
                <li>物理仕様: 高耐久マットブラックPVC素材 / ISO/IEC 7810準拠 (85.6mm × 53.98mm)</li>
              </ul>
            </div>

            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">System Compatibility / システム互換性</h3>
              <ul className="text-[9px] text-white/40 space-y-2 tracking-wider leading-relaxed list-disc pl-4">
                <li>対応デバイス: NFCリーダー搭載のすべてのスマートフォン</li>
                <li>iOS環境: iPhone XS以降 (iOS 13以上の標準カメラ/NFCリーダー)</li>
                <li>Android環境: OS 6.0以降のNFCオン設定端末</li>
                <li>ブラウザ仕様: WebKit (Safari), Blink (Chrome/Edge) に完全最適化</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detailed Activation Protocol */}
        <section className="w-full max-w-2xl mb-16 text-left px-4 font-sans">
          <h2 className="text-[9px] tracking-[0.5em] uppercase font-bold text-azure-400 mb-8 border-l border-azure-500 pl-4">
            Activation Protocol / カード初期登録の詳細手順
          </h2>
          
          <div className="p-8 border border-white/5 bg-white/[0.01] space-y-6">
            <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
              Hexa Cardがお手元に届いた後、以下のプロトコルに従ってあなたのデジタルアイデンティティ（アトリエ）と物理カードを紐付けます。この手順は一回のみ必要で、暗号化通信により安全に保護されています。
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-[9px] font-mono text-azure-400 font-bold shrink-0">STEP 01</span>
                <div>
                  <h4 className="text-[10px] font-bold text-white uppercase">NFC Tap & Detection / カードの検知</h4>
                  <p className="text-[9px] text-white/40 tracking-wider leading-relaxed">スマホのNFC読み取りエリア（iPhoneは本体上部の背面、Androidは中央付近）にカードを数秒間近づけます。自動的にブラウザ通知ポップアップが起動します。</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-[9px] font-mono text-azure-400 font-bold shrink-0">STEP 02</span>
                <div>
                  <h4 className="text-[10px] font-bold text-white uppercase">Secure Claim Page / 所有権の認証</h4>
                  <p className="text-[9px] text-white/40 tracking-wider leading-relaxed">通知をタップすると、カード固有のセキュアなクレーム（登録）画面にアクセスします。ここでアカウント登録（または既存アカウントへのログイン）を行います。</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-[9px] font-mono text-azure-400 font-bold shrink-0">STEP 03</span>
                <div>
                  <h4 className="text-[10px] font-bold text-white uppercase">Resonance Sync / アイデンティティの透過同期</h4>
                  <p className="text-[9px] text-white/40 tracking-wider leading-relaxed">登録完了後、カードの固有UIDとあなたのアトリエデータが透過的に共鳴し、同期されます。以降、カードを誰かにタップするだけで、あなたの最新のプロフィールが表示されます。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Integrity Overview */}
        <section className="w-full max-w-2xl mb-16 text-left px-4 font-sans">
          <h2 className="text-[9px] tracking-[0.5em] uppercase font-bold text-azure-400 mb-8 border-l border-azure-500 pl-4">
            Security & Data Integrity / セキュリティと整合性
          </h2>
          <div className="p-6 border border-white/5 bg-white/[0.01]">
            <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
              Hexa Cardシステムは、ユーザーのプライバシーとデータの整合性を第一に設計されています。物理カードに書き込まれるUID（固有識別子）は、サーバー上の暗号化されたプロフィールと紐付いており、カード自体にあなたの個人情報（電話番号やメールアドレスなど）が直接書き込まれることはありません。紛失時には管理画面から瞬時にカードのリンク解除や無効化（Void）を実行でき、不正アクセスを確実に防ぎます。
            </p>
          </div>
        </section>

        {/* Developer Showcase Section */}
        <section className="w-full max-w-xl border-t border-white/5 pt-12 mb-16 text-center px-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-azure-400">
              <Code size={14} />
            </div>
            <h3 className="text-[10px] tracking-[0.3em] font-bold text-white uppercase">System Architect / 開発者紹介</h3>
            <p className="text-[9px] text-white/40 leading-relaxed max-w-md tracking-wider">
              本デジタル名刺システム「Hexa Card」は、次世代ビジネスネットワーキングを支援するため、**[nox]**によって設計・開発されています。 <br />
              <span className="text-[8px] opacity-60 mt-1 block">Designed and developed by **[nox]** to empower the next generation of business networking.</span>
            </p>
            <div className="flex gap-6 items-center justify-center pt-2">
              <Link 
                href="/guide"
                className="text-[9px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors font-bold"
              >
                Guide / 使い方ガイド
              </Link>
              <span className="text-white/10">|</span>
              <a 
                href="https://www.hexa-relation.com/save/nox/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[9px] tracking-[0.3em] uppercase text-azure-400 hover:text-azure-300 transition-colors font-bold flex items-center gap-1"
              >
                View Portfolio / nox ポートフォリオ <ArrowRight size={10} className="inline" />
              </a>
            </div>
          </div>
        </section>

        {/* SEO FAQ & System Details Section */}
        <section className="w-full max-w-xl border-t border-white/5 pt-16 mb-16 text-left px-4">
          <h2 className="text-[9px] tracking-[0.5em] uppercase font-bold text-azure-400 mb-8 border-l border-azure-500 pl-4">
            System Resonance & FAQ / 共鳴システムの詳細とよくある質問
          </h2>
          
          <div className="space-y-8 font-sans">
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-white tracking-widest uppercase">Q. Hexa Cardとはどのようなサービスですか？</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider pl-4">
                A. 物理的なNFCスマートカードと、Web上のデジタルプロフィール（アイデンティティ）をシームレスに共鳴・同期させるビジネスツールです。カードをスマートフォンにかざすだけで、インストール不要で即座にあなたのポートフォリオや連絡先を共有できます。<br />
                <span className="text-[8px] opacity-60 mt-1 block">Hexa Card is a professional tool that synchronizes physical NFC cards with digital profiles. Simply tap the card on a smartphone to share your portfolio and contact info instantly.</span>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-white tracking-widest uppercase">Q. 会員同士の「共鳴接続」とは何ですか？</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider pl-4">
                A. Hexa Cardユーザー同士が出会った際、お互いのアイデンティティを共鳴させ、非同期に安全な連絡先交換を行う機能です。共鳴が完了すると、名刺帳への登録と同時にシステム内での活動を拡張するためのRelation Token (RT) が付与されます。<br />
                <span className="text-[8px] opacity-60 mt-1 block">Resonance Connection is a feature for Hexa Card members to securely exchange contact details asynchronously. Establishing resonance also grants Relation Tokens (RT).</span>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-white tracking-widest uppercase">Q. セキュリティや個人情報の保護はどのようになっていますか？</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider pl-4">
                A. 本システムはプライバシーの保護を最優先に設計されています。公開するエイリアス情報と、厳重に暗号化された個人情報を明確に分離し、あなたが「共鳴」を承認した信頼できるパートナーにのみ、選択した連絡先が開示される仕組みを採用しています。<br />
                <span className="text-[8px] opacity-60 mt-1 block">Security and privacy are our highest priorities. Public aliases and encrypted personal details are separated, revealing contacts only to trusted partners you resonate with.</span>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-white tracking-widest uppercase">Q. どのような端末に対応していますか？</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider pl-4">
                A. Safari（WebKit）を含むiOS、およびAndroid端末の標準ブラウザに完全対応しています。特別なアプリケーションのダウンロードは一切不要で、NFCのタップまたはQRコードの読み取りによって瞬時にプロフィールが透過的に展開されます。<br />
                <span className="text-[8px] opacity-60 mt-1 block">Fully compatible with standard browsers on iOS (Safari/WebKit) and Android. No app installation required; profiles load via NFC tap or QR code scan.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 opacity-30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] uppercase tracking-[0.4em] font-mono">System Online / システム稼働中</span>
        </div>

      </main>
      <Footer />
    </div>
  );
}
