"use client";

import { useEffect, useRef } from "react";

export default function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Very subtle, slow moving minimalist orbs
    const orbs = [
      { x: width * 0.2, y: height * 0.3, vx: 0.1, vy: -0.05, size: width * 0.4, color: "rgba(255, 255, 255, 0.015)" },
      { x: width * 0.8, y: height * 0.7, vx: -0.08, vy: 0.08, size: width * 0.5, color: "rgba(255, 255, 255, 0.02)" },
      { x: width * 0.5, y: height * 0.8, vx: 0.05, vy: -0.1, size: width * 0.3, color: "rgba(255, 255, 255, 0.01)" }
    ];

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw a very faint static noise/grid overlay
      ctx.fillStyle = "#020202"; // base void
      ctx.fillRect(0, 0, width, height);

      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges gently
        if (orb.x < -orb.size || orb.x > width + orb.size) orb.vx *= -1;
        if (orb.y < -orb.size || orb.y > height + orb.size) orb.vy *= -1;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle scanline overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.005)";
      for(let i = 0; i < height; i += 4) {
        ctx.fillRect(0, i, width, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-[#020202]" />;
}
