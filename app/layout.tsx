import type { Metadata } from "next";
import "./globals.css";
import GeometricBackground from "@/components/background/GeometricBackground";

export const metadata: Metadata = {
  title: "Hexa Card | Premium Identity",
  description: "Synchronize your identity via the Hexa Card.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

import ResonanceInteraction from "@/components/ui/ResonanceInteraction";

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
        <GeometricBackground />
        <ResonanceInteraction />
        {children}
      </body>
    </html>
  );
}
