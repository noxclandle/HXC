import type { Metadata, Viewport } from "next";
import "./globals.css";
import GeometricBackground from "@/components/background/GeometricBackground";

// Build Triggered: 2026-05-17
export const metadata: Metadata = {
  title: {
    default: "Hexa Card | Premium Identity",
    template: "%s | Hexa System"
  },
  description: "Beyond existence. A high-end identity synchronization system for the chosen few.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Hexa Card | Premium Identity",
    description: "Synchronize your identity via the Hexa Card system. A masterpiece of gothic tech and minimal chic.",
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
      </head>
      <body className="bg-void text-moonlight min-h-screen flex flex-col antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
        <NextAuthProvider>
          <ConnectionToastProvider>
            <GeometricBackground />
            <div className="relative z-10 flex-grow flex flex-col">
              <ConnectionInteraction />
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
