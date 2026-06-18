import type { Metadata, Viewport } from "next";
import "./globals.css";
import GeometricBackground from "@/components/background/GeometricBackground";

// Build Triggered: 2026-05-17
export const metadata: Metadata = {
  metadataBase: new URL("https://hxc.hexa-relation.com"),
  alternates: {
    canonical: "https://hxc.hexa-relation.com",
  },
  title: {
    default: "Hexa Card | 次世代NFCデジタルアイデンティティ / Next-Gen NFC Digital Identity",
    template: "%s | Hexa System"
  },
  description: "存在を超越する。選ばれた者のための、プレミアムなNFCデジタル名刺とアイデンティティ同期システム。 / Beyond existence. A premium NFC digital business card and identity synchronization system for the chosen few.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Hexa Card | プレミアムNFCデジタルアイデンティティ",
    description: "Hexa Cardシステムでアイデンティティを同期。物理とデジタルを繋ぐ、究極のスマート名刺。 / Synchronize your identity via the Hexa Card system. The ultimate smart card bridging physical and digital presence.",
    url: "https://hxc.hexa-relation.com",
    siteName: "Hexa Card",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Hexa Card Logo",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexa Card | NFC Digital Identity System",
    description: "アイデンティティの透過と拡張。 / Permeation and expansion of identity.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import ConnectionInteraction from "@/components/ui/ConnectionInteraction";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { ConnectionToastProvider } from "@/components/ui/ConnectionToast";
import Footer from "@/components/ui/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Preload critical assets */}
        <link rel="preload" href="/logo.png" as="image" />
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Hexa Card",
                "url": "https://hxc.hexa-relation.com"
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Hexa Relation",
                "url": "https://hxc.hexa-relation.com",
                "logo": "https://hxc.hexa-relation.com/logo.png",
                "sameAs": [
                  "https://x.com/HexaRelation"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": "Hexa Card",
                "description": "次世代NFCデジタルアイデンティティ。物理カードとデジタル名刺帳が同期する、1万通り以上のカスタマイズが可能なプレミアムスマート名刺。",
                "brand": {
                  "@type": "Brand",
                  "name": "Hexa Relation"
                },
                "offers": {
                  "@type": "Offer",
                  "url": "https://hxc.hexa-relation.com/purchase",
                  "priceCurrency": "JPY",
                  "price": "3000",
                  "availability": "https://schema.org/InStock"
                }
              }
            ])
          }}
        />
      </head>
      <body className="bg-void text-moonlight min-h-screen flex flex-col antialiased">
        <NextAuthProvider>
          <ConnectionToastProvider>
            <ConnectionInteraction />
            <div className="relative z-10 flex-grow flex flex-col">
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ConnectionToastProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
