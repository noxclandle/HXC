"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

/**
 * 軌跡 (Pointer) アセットの色彩と形状をリアルタイムに同期させる
 * パフォーマンス向上のため、Framer Motionを使わずCanvasで描画する
 */
export default function ConnectionInteraction() {
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerConfig = useRef({ color: "#FFFFFF", size: 8, shape: "hex" });
  const trail = useRef<{ x: number; y: number; life: number }[]>([]);
  const pulses = useRef<{ x: number; y: number; life: number }[]>([]);

  const fetchPointerStyle = async () => {
    try {
      const res = await fetch("/api/user/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const equippedPointer = data.equipped?.pointer || "Pure White Hex";
        
        switch (equippedPointer) {
          case "Azure Trace": pointerConfig.current = { color: "#3B82F6", size: 10, shape: "hex" }; break;
          case "Emerald Pulse": pointerConfig.current = { color: "#10B981", size: 10, shape: "hex" }; break;
          case "Ruby Flare": pointerConfig.current = { color: "#F43F5E", size: 12, shape: "star" }; break;
          case "Gold Trace": pointerConfig.current = { color: "#F59E0B", size: 10, shape: "hex" }; break;
          case "Violet Connection": pointerConfig.current = { color: "#8B5CF6", size: 10, shape: "hex" }; break;
          case "Crimson Ember": pointerConfig.current = { color: "#EF4444", size: 14, shape: "flare" }; break;
          case "Shadow Trace": pointerConfig.current = { color: "#111111", size: 18, shape: "ink" }; break;
          case "Prism Trace": pointerConfig.current = { color: "rgba(255,255,255,0.8)", size: 12, shape: "prism" }; break;
          case "Void Trace": pointerConfig.current = { color: "#000000", size: 20, shape: "tear" }; break;
          default: pointerConfig.current = { color: "#FFFFFF", size: 8, shape: "hex" };
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (session) fetchPointerStyle();
    const handleAssetsUpdated = () => fetchPointerStyle();
    window.addEventListener("hxc-assets-updated", handleAssetsUpdated);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const handleMove = (x: number, y: number) => {
      // 新しい点のみを追加し、古い点はrender内で管理
      trail.current.push({ x, y, life: 1.0 });
    };

    const handleAction = (x: number, y: number) => {
      pulses.current.push({ x, y, life: 1.0 });
    };

    const mouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const mouseDown = (e: MouseEvent) => handleAction(e.clientX, e.clientY);
    const touchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const touchStart = (e: TouchEvent) => {
      if (e.touches[0]) handleAction(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("mousemove", mouseMove, { passive: true });
    window.addEventListener("mousedown", mouseDown, { passive: true });
    window.addEventListener("touchmove", touchMove, { passive: true });
    window.addEventListener("touchstart", touchStart, { passive: true });

    let animationFrameId: number;

    const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      if (size <= 0) return;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
      }
      ctx.closePath();
    };

    const render = () => {
      // 画面を完全にクリア
      ctx.clearRect(0, 0, width, height);

      // Pulsesの処理
      const nextPulses: any[] = [];
      for (const p of pulses.current) {
        p.life -= 0.04;
        if (p.life > 0) {
          const size = (1 - p.life) * 100;
          ctx.globalAlpha = p.life;
          ctx.strokeStyle = pointerConfig.current.color;
          ctx.lineWidth = 1;
          drawHex(ctx, p.x, p.y, size);
          ctx.stroke();
          nextPulses.push(p);
        }
      }
      pulses.current = nextPulses;

      // Trailの処理
      const nextTrail: any[] = [];
      // パフォーマンスのため、表示する点数を厳密に制限
      const activeTrail = trail.current.slice(-20);
      
      activeTrail.forEach((t, i) => {
        t.life -= 0.025;
        if (t.life > 0) {
          const opacity = t.life * (i / activeTrail.length);
          const size = pointerConfig.current.size * t.life;
          
          ctx.globalAlpha = opacity;
          ctx.fillStyle = pointerConfig.current.color;
          
          drawHex(ctx, t.x, t.y, size);
          ctx.fill();
          nextTrail.push(t);
        }
      });
      trail.current = nextTrail;

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("hxc-assets-updated", handleAssetsUpdated);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchstart", touchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, [session]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
}
