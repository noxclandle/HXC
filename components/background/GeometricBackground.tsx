"use client";

/**
 * 構造改革: Safari iOS の Canvas フリーズ問題を根絶するため、
 * Canvas 描画を完全に廃止し、100% CSS (GPU 最適化) による背景へ移行。
 */
export default function GeometricBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020202] overflow-hidden pointer-events-none">
      {/* CSS-based subtle ambient orbs - Zero CPU Load */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.02) 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.01) 0%, transparent 70%)'
        }}
      />

      {/* Static CSS Scanlines for high performance */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.5) 50%)', 
          backgroundSize: '100% 4px' 
        }} 
      />
    </div>
  );
}
