import type { Metadata, Viewport } from "next";
import "./globals.css";
import GeometricBackground from "@/components/background/GeometricBackground";

export const metadata: Metadata = {
  title: {
    default: "Hexa Card | Premium Identity",
    template: "%s | Hexa Protocol"
  },
  description: "Beyond existence. A high-end identity synchronization system for the chosen few.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Hexa Card | Premium Identity",
    description: "Synchronize your identity via the Hexa Card. A masterpiece of gothic tech and minimal chic.",
    url: "https://hxc.hexa-relation.com",
    siteName: "Hexa Relation",
    images: [
      {
        url: "/logo.png", // Replace with a dedicated OG image later if available
        width: 800,
        height: 800,
        alt: "Hexa Relation Logo",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexa Card | Premium Identity",
    description: "Beyond existence. A masterpiece of gothic tech and minimal chic.",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import ResonanceInteraction from "@/components/ui/ResonanceInteraction";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { ResonanceToastProvider } from "@/components/ui/ResonanceToast";
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
      </head>
      <body className="bg-void text-moonlight min-h-screen flex flex-col">
        <NextAuthProvider>
          <ResonanceToastProvider>
            <GeometricBackground />
            <ResonanceInteraction />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ResonanceToastProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
