import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { FaMoon } from 'react-icons/fa6';
import { useImages } from '../context/ImageContext';

interface SectionWelcomeProps {
  onEnter: () => void;
}

export const SectionWelcome: React.FC<SectionWelcomeProps> = ({ onEnter }) => {
  const { getImageUrl } = useImages();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12; // -6 to 6 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const portraitUrl = getImageUrl('welcome_portrait');

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-12 -left-16 w-72 h-72 rounded-full bg-[#FFB3C6]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 -right-16 w-80 h-80 rounded-full bg-[#FAD9E0] blur-2xl pointer-events-none" />

      {/* Handcrafted Header Note */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FaMoon className="text-[#E8B86D] text-2xl animate-moon drop-shadow-[0_0_8px_rgba(232,184,109,0.7)]" />
          <span className="text-xs uppercase tracking-widest text-[#B85D59]/80 font-semibold font-quicksand">
            Special Edition · Just for You
          </span>
          <Sparkles className="w-4 h-4 text-[#FFB3C6] animate-pulse" />
        </div>

        <h1 className="font-caveat text-5xl sm:text-6xl md:text-7xl font-bold text-[#642825] tracking-tight mb-2">
          Happy Birthday, Jyoti
        </h1>

        <p className="font-quicksand text-base sm:text-lg text-[#B85D59] font-medium max-w-sm leading-relaxed">
          To my favorite person, my guiding light, and the warmest part of my everyday life.
        </p>
      </div>

      {/* Polaroid Frame with Desktop Tilt Interaction */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) rotate(-2deg)`,
        }}
        className="relative z-10 w-full max-w-[290px] sm:max-w-[320px] p-4 sm:p-5 bg-white rounded-2xl shadow-[0_16px_40px_-10px_rgba(184,93,89,0.22)] transition-transform duration-200 ease-out border border-white/60 mb-8 cursor-pointer group"
      >
        {/* Washi Tape Accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#FFB3C6]/60 backdrop-blur-xs rounded-sm rotate-1 shadow-xs border border-white/40 pointer-events-none" />

        {/* Image Container with fixed aspect ratio */}
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#FAD9E0]/40 border border-[#FAD9E0]">
          {portraitUrl ? (
            <img
              src={portraitUrl}
              alt="Jyoti - Beautiful Birthday Girl"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#B85D59]/60">
              <FaMoon className="text-4xl text-[#E8B86D] mb-2" />
              <p className="font-caveat text-2xl">My Lovely Jyoti</p>
            </div>
          )}
        </div>

        {/* Polaroid Handwritten Caption */}
        <div className="mt-4 pt-1 flex items-center justify-between px-1">
          <span className="font-caveat text-2xl sm:text-3xl text-[#642825] font-semibold">
            My Moon 🌙
          </span>
          <span className="text-xs text-[#B85D59]/70 font-quicksand font-medium">
            With endless love
          </span>
        </div>
      </div>

      {/* Tap-to-Enter Interaction Button (Also acts as Audio Permission Gesture) */}
      <div className="relative z-10">
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#FFB3C6] hover:bg-[#ffa2b9] active:scale-95 text-[#642825] font-quicksand font-bold text-base sm:text-lg rounded-full shadow-[0_8px_20px_-4px_rgba(255,179,198,0.7)] hover:shadow-[0_12px_28px_-4px_rgba(255,179,198,0.85)] transition-all duration-200 border border-white/40 cursor-pointer"
        >
          <Heart className="w-5 h-5 text-[#642825] fill-[#642825] group-hover:scale-115 transition-transform duration-200" />
          <span>Open Your Birthday Letter</span>
          <Sparkles className="w-4 h-4 text-[#642825] opacity-70 group-hover:rotate-12 transition-transform duration-200" />
        </button>
      </div>

      <p className="relative z-10 mt-3 text-xs text-[#B85D59]/70 font-quicksand font-medium text-center">
        Tap to step inside & unlock your special surprises
      </p>
    </section>
  );
};
