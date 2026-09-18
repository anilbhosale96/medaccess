import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      onClick={onFinish}
      className="fixed inset-0 bg-[#0A0A0F] z-50 flex flex-col items-center justify-center cursor-pointer select-none transition-opacity duration-500 animate-in fade-in"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Brand Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#12121A] border-2 border-[#2B2B3E] flex items-center justify-center shadow-2xl shadow-blue-500/10">
            <Zap className="w-10 h-10 text-[#C9F24B] fill-[#C9F24B] animate-pulse" />
          </div>
          <div className="absolute -inset-2 rounded-3xl bg-[#C9F24B]/10 blur-xl pointer-events-none" />
        </div>

        {/* Brand Name & Headline */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black tracking-wider text-[#F2F2F5]">
            MEDACCESS
          </h1>
          <p className="text-xs font-medium text-[#A0A0B0] tracking-wide">
            Emergency Patient Information System
          </p>
        </div>

        {/* Minimal Spinner / Loader */}
        <div className="pt-6">
          <div className="w-6 h-6 border-2 border-[#2B2B3E] border-t-[#C9F24B] rounded-full animate-spin" />
        </div>
      </div>

      <div className="absolute bottom-8 text-[11px] text-[#6B7280] font-mono">
        Tap anywhere to skip
      </div>
    </div>
  );
};
