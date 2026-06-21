"use client";

import { Layout, Smartphone } from "lucide-react";
import { ReactNode } from "react";

interface UnifiedCardContainerProps {
  children: ReactNode;
  orientation: "horizontal" | "vertical";
  onOrientationChange?: (orientation: "horizontal" | "vertical") => void;
  textColor?: "white" | "black";
  onTextColorChange?: (color: "white" | "black") => void;
  showControls?: boolean;
  previewLabel?: string;
  isUpdating?: boolean;
  compact?: boolean;
}

/**
 * A unified container for the HexaCardPreview used across Hub, Inventory, and Edit screens.
 * Handles consistent scaling, orientation toggles, and aesthetic framing.
 */
export default function UnifiedCardContainer({
  children,
  orientation,
  onOrientationChange,
  textColor,
  onTextColorChange,
  showControls = true,
  previewLabel = "Live Preview / ライブプレビュー",
  isUpdating = false,
  compact = false
}: UnifiedCardContainerProps) {
  return (
    <div className={`w-full ${compact ? 'py-1 lg:py-8' : 'py-4 lg:py-8'} bg-white/[0.01] lg:bg-white/[0.02] lg:border lg:border-white/5 shadow-2xl relative overflow-visible group flex flex-col items-center transition-all duration-500 ${isUpdating ? 'opacity-30' : 'opacity-100'}`}>
      
      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute top-2 right-4 lg:top-4 lg:right-4 z-30 flex flex-col gap-3 p-2 bg-white/10 lg:bg-white/5 border border-white/10 scale-90 lg:scale-100 backdrop-blur-md">
           <div className="flex gap-2">
              <button 
                onClick={() => onOrientationChange?.('horizontal')} 
                className={`p-1.5 transition-all ${orientation === 'horizontal' ? 'bg-azure-600 text-white' : 'hover:bg-white/10 text-white/40'}`}
                title="Horizontal Layout"
              >
                  <Layout size={12}/>
              </button>
              <button 
                onClick={() => onOrientationChange?.('vertical')} 
                className={`p-1.5 transition-all ${orientation === 'vertical' ? 'bg-azure-600 text-white' : 'hover:bg-white/10 text-white/40'}`}
                title="Vertical Layout"
              >
                  <Smartphone size={12}/>
              </button>
           </div>
           
           {(onTextColorChange && textColor) && (
             <>
               <div className="h-px bg-white/10 w-full" />
               <div className="flex gap-2 justify-center">
                  <button 
                    onClick={() => onTextColorChange('white')} 
                    className={`w-4 h-4 rounded-full border border-white/20 bg-white transition-all ${textColor === 'white' ? 'ring-2 ring-azure-500 ring-offset-2 ring-offset-void' : 'opacity-20'}`} 
                    title="White Text"
                  />
                  <button 
                    onClick={() => onTextColorChange('black')} 
                    className={`w-4 h-4 rounded-full border border-white/20 bg-black transition-all ${textColor === 'black' ? 'ring-2 ring-azure-500 ring-offset-2 ring-offset-void' : 'opacity-20'}`} 
                    title="Black Text"
                  />
               </div>
             </>
           )}
        </div>
      )}

      {/* Scaled Content Wrapper */}
      <div className={`w-full flex justify-center origin-center transition-transform duration-500 relative z-20 flex items-center
        ${orientation === 'horizontal' 
          ? (compact 
              ? 'scale-[0.5] xs:scale-[0.6] sm:scale-[0.7] lg:scale-100 h-[140px] xs:h-[170px] sm:h-[200px] lg:h-[285px]'
              : 'scale-[0.65] xs:scale-[0.75] sm:scale-[0.85] lg:scale-100 h-[185px] xs:h-[214px] sm:h-[242px] lg:h-[285px]')
          : (compact
              ? 'scale-[0.4] xs:scale-[0.5] sm:scale-[0.6] lg:scale-100 h-[180px] xs:h-[225px] sm:h-[270px] lg:h-[450px]'
              : 'scale-[0.55] xs:scale-[0.65] sm:scale-[0.75] lg:scale-100 h-[248px] xs:h-[293px] sm:h-[338px] lg:h-[450px]')
        }
      `}>
        {children}
      </div>

      {/* Label */}
      {previewLabel && (
        <div className={`text-center ${compact ? 'mt-1 pb-1' : 'mt-2 lg:mt-4 pb-2'} flex flex-col items-center gap-1`}>
           <p className="text-[7px] tracking-[0.3em] uppercase opacity-20 font-bold">{previewLabel}</p>
        </div>
      )}
    </div>
  );
}
