"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

/**
 * 軌跡 (Pointer) アセットの色彩と形状をリアルタイムに同期させる
 * パフォーマンス向上のため、Framer Motionを使わずCanvasで描画する
 */
export default function ResonanceInteraction() {
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
          case "Violet Resonance": pointerConfig.current = { color: "#8B5CF6", size: 10, shape: "hex" }; break;
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
    const ctx = canvas.getContext("2d");
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
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      trail.current.push({ x: e.clientX, y: e.clientY, life: 1.0 });
    };

    const handleMouseDown = (e: MouseEvent) => {
      pulses.current.push({ x: e.clientX, y: e.clientY, life: 1.0 });
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      trail.current.push({ x: touch.clientX, y: touch.clientY, life: 1.0 });
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      pulses.current.push({ x: touch.clientX, y: touch.clientY, life: 1.0 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    let animationFrameId: number;

    const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + size * Math.cos(i * Math.PI / 3), y + size * Math.sin(i * Math.PI / 3));
      }
      ctx.closePath();
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? size : size / 2;
        ctx.lineTo(x + radius * Math.cos(i * Math.PI / 5 - Math.PI / 2), y + radius * Math.sin(i * Math.PI / 5 - Math.PI / 2));
      }
      ctx.closePath();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw pulses
      pulses.current = pulses.current.filter(p => p.life > 0);
      pulses.current.forEach(p => {
        p.life -= 0.05;
        const opacity = p.life;
        const currentSize = (1 - p.life) * 80;
        ctx.strokeStyle = pointerConfig.current.color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 1;
        
        if (pointerConfig.current.shape === "hex") {
          drawHex(ctx, p.x, p.y, currentSize);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        }
        ctx.stroke();
      });

      // Draw trail
      trail.current = trail.current.filter(t => t.life > 0);
      if (trail.current.length > 25) {
        trail.current = trail.current.slice(-25);
      }

      trail.current.forEach((t, i) => {
        t.life -= 0.02;
        const opacity = t.life * (i / trail.current.length);
        const currentSize = pointerConfig.current.size * t.life;
        
        ctx.globalAlpha = opacity;
        ctx.fillStyle = pointerConfig.current.color;
        
        // Shadow / Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = pointerConfig.current.color;

        if (pointerConfig.current.shape === "hex") {
          drawHex(ctx, t.x, t.y, currentSize);
          ctx.fill();
        } else if (pointerConfig.current.shape === "star") {
          drawStar(ctx, t.x, t.y, currentSize);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(t.x, t.y, currentSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("hxc-assets-updated", handleAssetsUpdated);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, [session]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
}
