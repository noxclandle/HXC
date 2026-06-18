"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Monitor, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BackgroundGenerator({ userSlug }: { userSlug: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const profileUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/p/${userSlug}` 
    : `https://hxc.hexa-relation.com/p/${userSlug}`;

  const handleDownload = async () => {
    setGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Set Background (Black/Gothic)
    ctx.fillStyle = "#020202";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Subtle Hex Pattern
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      for (let j = 0; j < canvas.height; j += 40) {
        ctx.strokeRect(i, j, 40, 40);
      }
    }

    // 3. Draw Brand Text
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "20px sans-serif";
    ctx.letterSpacing = "10px";
    ctx.fillText("HEXA RELATION / HXC SYSTEM", 60, canvas.height - 60);

    // 4. Convert SVG QR to Image and Draw it
    const svgElement = qrRef.current?.querySelector("svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new window.Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Draw QR at Top Right
        const qrSize = 250;
        const padding = 80;
        ctx.fillStyle = "white";
        ctx.fillRect(canvas.width - qrSize - padding - 10, padding - 10, qrSize + 20, qrSize + 20);
        ctx.drawImage(img, canvas.width - qrSize - padding, padding, qrSize, qrSize);

        // Download
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `hxc-zoom-bg-${userSlug}.png`;
        link.href = dataUrl;
        link.click();
        setGenerating(false);
      };
      img.src = url;
    }
  };

  return (
    <div className="min-h-screen bg-void pt-32 px-6 pb-24 text-moonlight">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <Link href="/hub" className="flex items-center gap-2 text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-8 uppercase">
             <ArrowLeft size={12} /> Back to Hub
          </Link>
          <h1 className="text-3xl tracking-[0.4em] uppercase font-light mb-4">Virtual Background</h1>
          <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase leading-relaxed">
            オンライン商談やネット面談で使用できる、QRコード付きのバーチャル背景を生成します。<br />
            画面越しに名刺と資料を相手に即座に配ることが可能です。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
           <div className="space-y-8">
              <div className="aspect-video bg-black border border-white/10 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                 <Camera size={48} className="opacity-10" />
                 <div className="absolute top-4 right-4 w-12 h-12 bg-white flex items-center justify-center">
                    <div className="w-8 h-8 bg-black opacity-40" />
                 </div>
                 <div className="absolute bottom-4 left-4 text-[6px] tracking-[2px] opacity-20 uppercase">Preview Mode</div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-azure-400">使い方 / How to use</h3>
                 <ul className="text-[9px] tracking-widest text-white/40 space-y-3 leading-relaxed uppercase">
                    <li>1. 下の「背景を生成・保存」ボタンを押してください。</li>
                    <li>2. 保存された画像をZoomやGoogle Meetの背景に設定します。</li>
                    <li>3. オンライン商談中、相手に「画面のQRをスマホで撮ってください」と伝えます。</li>
                    <li>4. 相手は即座にあなたの名刺と、設定した資料にアクセスできます。</li>
                 </ul>
              </div>

              <button 
                onClick={handleDownload}
                disabled={generating}
                className="w-full py-6 bg-white text-void font-bold text-[11px] tracking-[1em] uppercase flex items-center justify-center gap-4 hover:bg-azure-50 transition-all disabled:opacity-50"
              >
                {generating ? "Generating..." : <><Download size={16} /> 生成して保存</>}
              </button>
           </div>

           <div className="hidden md:block border border-white/5 p-8 bg-white/[0.01]">
              <p className="text-[9px] tracking-[0.4em] text-center mb-8 opacity-40 uppercase">Internal QR Generator</p>
              <div ref={qrRef} className="bg-white p-4 flex justify-center mx-auto w-fit">
                <QRCodeSVG value={profileUrl} size={150} />
              </div>
           </div>
        </div>

        {/* Hidden Canvas for High Res Generation */}
        <canvas 
          ref={canvasRef} 
          width={1920} 
          height={1080} 
          className="hidden"
        />
      </div>
    </div>
  );
}
