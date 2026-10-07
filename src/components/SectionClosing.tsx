import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { FaMoon } from 'react-icons/fa6';
import { defaultLetters } from '../data/defaultContent';
import { triggerCandleConfetti } from '../utils/confetti';

export const SectionClosing: React.FC = () => {
  const [pressedCount, setPressedCount] = useState(0);

  const handleHeartClick = () => {
    triggerCandleConfetti();
    setPressedCount(prev => prev + 1);
  };

  return (
    <footer className="relative pt-16 pb-20 px-4 sm:px-6 max-w-2xl mx-auto text-center">
      {/* Background Soft Glow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#FFB3C6]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-center gap-2">
          <FaMoon className="text-[#E8B86D] text-lg animate-moon" />
          <Sparkles className="w-4 h-4 text-[#FFB3C6]" />
        </div>

        <p className="font-caveat text-3xl sm:text-4xl text-[#642825] font-bold max-w-md mx-auto leading-snug">
          {defaultLetters.closingText}
        </p>

        {/* Small Heart Replay Button */}
        <div className="pt-2 flex flex-col items-center">
          <button
            onClick={handleHeartClick}
            title="Tap for extra birthday love!"
            className="group relative p-4 bg-white hover:bg-[#FFF0F5] active:scale-90 rounded-full shadow-[0_8px_20px_-4px_rgba(255,179,198,0.7)] border border-[#FFCCD5] transition-all duration-200 cursor-pointer"
          >
            <Heart className="w-6 h-6 text-[#E85D75] fill-[#FFB3C6] group-hover:scale-115 group-hover:fill-[#E85D75] transition-all duration-200" />
            <span className="sr-only">Replay celebration confetti</span>
          </button>

          {pressedCount > 0 && (
            <span className="text-[11px] text-[#B85D59]/70 font-quicksand font-medium mt-2 animate-fade-in">
              Sending love to Jyoti {pressedCount > 1 ? `×${pressedCount}` : ''} ✨
            </span>
          )}
        </div>

        {/* Quiet Footer Signoff */}
        <div className="pt-8 border-t border-[#FAD9E0]/70 flex flex-col items-center gap-2">
          <p className="text-xs text-[#B85D59]/70 font-quicksand font-medium">
            Handcrafted with love for Jyoti's Birthday · Forever My Moon 🌙
          </p>
        </div>
      </div>
    </footer>
  );
};
