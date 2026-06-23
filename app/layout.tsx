import type { Metadata, Viewport } from "next";
import "./globals.css";
import GeometricBackground from "@/components/background/GeometricBackground";

// Build Triggered: 2026-05-17
export const metadata: Metadata = {
  metadataBase: new URL("https://virtual-business-card.hexa-relation.com"),
  title: {
    default: "Hexa Card | 次世代NFCデジタルアイデンティティ / Next-Gen NFC Digital Identity",
    template: "%s | Hexa System"
  },
  description: "存在を超越する。選ばれた者のための、プレミアムなNFCデジタル名刺とアイデンティティ同期システム。 / Beyond existence. A premium NFC digital business card and identity synchronization system for the chosen few.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Hexa Card | プレミアムNFCデジタルアイデンティティ",
    description: "Hexa Cardシステムでアイデンティティを同期。物理とデジタルを繋ぐ、究極のスマート名刺。 / Synchronize your identity via the Hexa Card system. The ultimate smart card bridging physical and digital presence.",
    url: "https://virtual-business-card.hexa-relation.com",
    siteName: "Hexa Card",
    images: [
      {
        url: "/ogp_card.png",
        width: 1200,
        height: 630,
        alt: "Hexa Card Physical Asset",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexa Card | NFC Digital Identity System",
    description: "アイデンティティの透過と拡張。 / Permeation and expansion of identity.",
    images: ["/ogp_card.png"],
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
                "url": "https://virtual-business-card.hexa-relation.com"
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Hexa Relation",
                "url": "https://virtual-business-card.hexa-relation.com",
                "logo": "https://virtual-business-card.hexa-relation.com/logo.png",
                "sameAs": [
                  "https://x.com/HexaRelation"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": "Hexa Card",
                "image": "https://virtual-business-card.hexa-relation.com/ogp_card.png",
                "description": "次世代NFCデジタルアイデンティティ。物理カードとデジタル名刺帳が同期する、1万通り以上のカスタマイズが可能なプレミアムスマート名刺。",
                "brand": {
                  "@type": "Brand",
                  "name": "Hexa Relation"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "27"
                },
                "review": [
                  {
                    "@type": "Review",
                    "author": {
                      "@type": "Person",
                      "name": "S. Sasaki"
                    },
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5",
                      "bestRating": "5"
                    },
                    "reviewBody": "極限まで削ぎ落とされたデザインと、NFC同調のシームレスな体験に感動しました。"
                  }
                ],
                "offers": {
                  "@type": "Offer",
                  "url": "https://virtual-business-card.hexa-relation.com/purchase",
                  "priceCurrency": "JPY",
                  "price": "3000",
                  "availability": "https://schema.org/InStock",
                  "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingRate": {
                      "@type": "MonetaryAmount",
                      "value": 0,
                      "currency": "JPY"
                    },
                    "shippingDestination": {
                      "@type": "DefinedRegion",
                      "addressCountry": "JP"
                    },
                    "deliveryTime": {
                      "@type": "ShippingDeliveryTime",
                      "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 0,
                        "maxValue": 1,
                        "unitCode": "DAY"
                      },
                      "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 3,
                        "unitCode": "DAY"
                      }
                    }
                  },
                  "hasMerchantReturnPolicy": {
                    "@type": "MerchantReturnPolicy",
                    "applicableCountry": "JP",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                    "merchantReturnDays": 7,
                    "returnMethod": "https://schema.org/ReturnByMail",
                    "returnFees": "https://schema.org/ReturnFeesCustomerResponsibility"
                  }
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
            </div>
          </ConnectionToastProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
