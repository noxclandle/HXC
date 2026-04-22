import type { Metadata, Viewport } from "next";
import "./globals.css";
import GeometricBackground from "@/components/background/GeometricBackground";

export const metadata: Metadata = {
  title: "Hexa Card | Premium Identity",
  description: "Synchronize your identity via the Hexa Card.",
  manifest: "/manifest.json",
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
      <body className="bg-void text-moonlight">
        <NextAuthProvider>
          <GeometricBackground />
          <ResonanceInteraction />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
