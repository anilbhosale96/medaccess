import React, { useState } from 'react';
import { ShieldAlert, Zap, QrCode, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'What is MedAccess?',
      subtitle: 'Critical patient information when every second matters',
      description: 'Emergency departments waste 20+ minutes identifying unconscious patients. MedAccess gives trauma doctors instant access to blood type, allergies, and chronic conditions in <2 minutes during the Golden Hour.',
      icon: <ShieldAlert className="w-14 h-14 text-[#FF4D4D]" />,
      badge: 'PROBLEM & MISSION'
    },
    {
      title: 'How It Works',
      subtitle: 'Biometric identification & secure instant retrieval',
      description: 'Paramedics scan an emergency QR code wristband or take a fast face snapshot. Our vector similarity engine identifies the patient in <500ms and securely retrieves their critical medical profile with zero permanent biometric storage.',
      icon: <Zap className="w-14 h-14 text-[#C9F24B]" />,
      badge: 'MULTI-MODAL TECH'
    },
    {
      title: 'Get Started in 60 Seconds',
      subtitle: 'Pre-register your emergency medical profile',
      description: 'Create your account, register your emergency contacts, list drug allergies (like Penicillin), and generate your official SEPS Emergency QR wristband card ready for your wallet or phone.',
      icon: <QrCode className="w-14 h-14 text-[#3B82F6]" />,
      badge: 'PROTECT YOUR LIFE'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-[#0A0A0F] text-[#F2F2F5] z-40 flex flex-col justify-between p-6 sm:p-12 max-w-2xl mx-auto selection:bg-[#C9F24B] selection:text-[#0A0A0F]">
      {/* Top Header with Skip Button */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono font-bold tracking-widest text-[#A0A0B0] uppercase">
          {slide.badge}
        </span>
        <button
          onClick={onSkip}
          className="text-xs font-bold text-[#A0A0B0] hover:text-[#F2F2F5] uppercase tracking-wider py-1.5 px-3 rounded-lg hover:bg-[#12121A] transition"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="my-auto space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-[#12121A] border border-[#2B2B3E] flex items-center justify-center shadow-xl">
          {slide.icon}
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F2F2F5]">
            {slide.title}
          </h2>
          <p className="text-sm font-semibold text-[#C9F24B]">
            {slide.subtitle}
          </p>
          <p className="text-sm sm:text-base text-[#A0A0B0] leading-relaxed font-normal">
            {slide.description}
          </p>
        </div>

        {/* Slide Indicators */}
        <div className="flex gap-2 pt-4">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-[#C9F24B]' : 'w-2 bg-[#2B2B3E]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA Buttons */}
      <div className="pt-6 border-t border-[#1F1F2E] flex items-center justify-between gap-4">
        <button
          onClick={() => {
            if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
          }}
          disabled={currentSlide === 0}
          className={`text-xs font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#A0A0B0] py-3 px-4 ${
            currentSlide === 0 ? 'invisible' : ''
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="py-3 px-8 bg-transparent hover:bg-[#C9F24B] text-[#C9F24B] hover:text-[#0A0A0F] border-2 border-[#C9F24B] rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition duration-200 shadow-md"
        >
          <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
