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
  isUpdating = false
}: UnifiedCardContainerProps) {
  return (
    <div className={`w-full py-4 lg:py-8 bg-white/[0.01] lg:bg-white/[0.02] lg:border lg:border-white/5 shadow-2xl relative overflow-visible group flex flex-col items-center transition-all duration-500 ${isUpdating ? 'opacity-30' : 'opacity-100'}`}>
      
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
      <div className={`w-full flex justify-center origin-center lg:origin-top transition-transform duration-500 relative z-20 min-h-[260px] flex items-center
        ${orientation === 'horizontal' 
          ? 'scale-[0.8] xs:scale-[0.9] sm:scale-100 lg:scale-100' 
          : 'scale-[0.7] xs:scale-[0.8] sm:scale-90 lg:scale-100'
        }
      `}>
        {children}
      </div>

      {/* Label */}
      {previewLabel && (
        <div className="text-center mt-[-10%] lg:mt-4 pb-2 flex flex-col items-center gap-1">
           <p className="text-[7px] tracking-[0.3em] uppercase opacity-20 font-bold">{previewLabel}</p>
        </div>
      )}
    </div>
  );
}
