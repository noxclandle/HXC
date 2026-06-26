"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Camera } from "lucide-react";
import { motion } from "framer-motion";

export default function BackgroundGenerator({ 
  userSlug, 
  equippedZoomBg = "ZoomBgDefault" 
}: { 
  userSlug: string; 
  equippedZoomBg?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const profileUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/p/${userSlug}` 
    : `https://virtual-business-card.hexa-relation.com/p/${userSlug}`;

  const handleDownload = async () => {
    setGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Draw Background style
    if (equippedZoomBg === "ZoomBgCyber") {
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Cyber grid lines
      ctx.strokeStyle = "rgba(34, 211, 238, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 60) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 60) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
      }
      // Glowing neon border
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    } else if (equippedZoomBg === "ZoomBgGold") {
      ctx.fillStyle = "#1c150c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Gold frame double border
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);
    } else if (equippedZoomBg === "ZoomBgPrism") {
      ctx.fillStyle = "#090514";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Prism gradient border
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#a855f7");
      grad.addColorStop(0.5, "#ec4899");
      grad.addColorStop(1, "#3b82f6");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    } else if (equippedZoomBg === "ZoomBgNebula") {
      ctx.fillStyle = "#02020f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Nebula cloud
      const radGrad = ctx.createRadialGradient(400, 540, 100, 400, 540, 900);
      radGrad.addColorStop(0, "rgba(168, 85, 247, 0.15)");
      radGrad.addColorStop(0.5, "rgba(45, 212, 191, 0.1)");
      radGrad.addColorStop(1, "transparent");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 60; i++) {
        const x = (Math.sin(i) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(i * 1.7) * 0.5 + 0.5) * canvas.height;
        ctx.fillRect(x, y, 2.5, 2.5);
      }
      ctx.strokeStyle = "rgba(168, 85, 247, 0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    } else {
      // Default: Solid Void
      ctx.fillStyle = "#020202";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 80) {
        for (let j = 0; j < canvas.height; j += 80) {
          ctx.strokeRect(i, j, 80, 80);
        }
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    }

    // 2. Draw Brand Text
    ctx.fillStyle = equippedZoomBg === "ZoomBgGold" ? "rgba(251, 191, 36, 0.4)" : "rgba(255, 255, 255, 0.3)";
    ctx.font = "24px sans-serif";
    ctx.letterSpacing = "12px";
    ctx.fillText("HEXA RELATION", 80, canvas.height - 80);

    // 3. Convert SVG QR to Image and Draw it
    const svgElement = qrRef.current?.querySelector("svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new window.Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const qrSize = 250;
        const padding = 80;
        ctx.fillStyle = "white";
        ctx.fillRect(canvas.width - qrSize - padding - 15, padding - 15, qrSize + 30, qrSize + 30);
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

  // Preview styling helpers based on equipped Zoom background style
  const getPreviewBgStyle = () => {
    switch (equippedZoomBg) {
      case "ZoomBgCyber":
        return "bg-[#030712] border-cyan-500/30";
      case "ZoomBgGold":
        return "bg-[#1c150c] border-amber-500/30";
      case "ZoomBgPrism":
        return "bg-[#090514] border-purple-500/30";
      case "ZoomBgNebula":
        return "bg-[#02020f] border-indigo-500/30";
      default:
        return "bg-[#020202] border-white/10";
    }
  };

  return (
    <div className="border border-white/5 bg-white/[0.01] p-6 space-y-8 rounded-lg">
      <div className="mb-2">
         <h3 className="text-xs tracking-[0.4em] uppercase font-bold text-azure-400">Virtual Background / バーチャル背景</h3>
         <p className="text-[7px] tracking-[0.2em] text-white/30 uppercase mt-1">Meeting Image Generator</p>
      </div>

      <div className={`aspect-video border flex items-center justify-center relative overflow-hidden group rounded ${getPreviewBgStyle()}`}>
         {/* Cyber Grid Pattern */}
         {equippedZoomBg === "ZoomBgCyber" && (
           <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
         )}
         
         {/* Default Hex Pattern */}
         {equippedZoomBg === "ZoomBgDefault" && (
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px]" />
         )}

         {/* Nebula Glow */}
         {equippedZoomBg === "ZoomBgNebula" && (
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.12)_0%,rgba(45,212,191,0.08)_50%,transparent_100%)]" />
         )}

         {/* Gold Inner Frame */}
         {equippedZoomBg === "ZoomBgGold" && (
           <div className="absolute inset-2 border border-amber-500/10 rounded" />
         )}

         <Camera size={28} className="opacity-10 z-10" />
         
         {/* QR Code Area at Top Right */}
         <div className="absolute top-3 right-3 p-1 bg-white z-10 shadow-[0_0_10px_rgba(255,255,255,0.1)] rounded-sm">
            <QRCodeSVG value={profileUrl} size={32} />
         </div>

         {/* Brand Text at Bottom Left */}
         <div className="absolute bottom-3 left-3 text-[5px] tracking-[3px] text-white/20 uppercase z-10">
           HEXA RELATION
         </div>

         <div className="absolute bottom-3 right-3 text-[5px] tracking-[1.5px] opacity-20 uppercase z-10">Preview</div>
      </div>

      <div className="space-y-3">
         <h4 className="text-[9px] tracking-[0.3em] uppercase font-bold text-white/60">使い方 / Setup Instructions</h4>
         <ul className="text-[8px] tracking-wider text-white/30 space-y-2 leading-relaxed uppercase">
            <li>1. Press the button below to generate background. / 下のボタンから背景を保存。</li>
            <li>2. Set as background in Zoom or Google Meet. / Zoom等の背景に設定します。</li>
            <li>3. Ask clients to scan the screen QR code. / 商談中、相手にQRを読んでもらいます。</li>
            <li>4. They instantly receive your card and files. / 相手に名刺と左記の配布資料が届きます。</li>
         </ul>
      </div>

      <button 
        onClick={handleDownload}
        disabled={generating}
        className="w-full py-5 bg-white text-void font-bold text-[10px] tracking-[0.8em] uppercase flex items-center justify-center gap-3 hover:bg-azure-50 transition-all disabled:opacity-50"
      >
        {generating ? "Generating..." : <><Download size={14} /> Generate / 生成して保存</>}
      </button>

      {/* Hidden QR container for High-Res parsing */}
      <div className="hidden">
         <div ref={qrRef} className="bg-white p-4">
           <QRCodeSVG value={profileUrl} size={150} />
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
  );
}
