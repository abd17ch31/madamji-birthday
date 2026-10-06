import React, { useState } from 'react';
import { defaultLetters } from '../data/defaultContent';
import { Heart, Mail, Sparkles, Feather } from 'lucide-react';
import { FaMoon } from 'react-icons/fa6';

export const SectionHowMuchILoveHer: React.FC = () => {
  const [isUnfolded, setIsUnfolded] = useState(true);

  return (
    <section id="how-much-i-love-her" className="relative py-16 sm:py-28 px-4 sm:px-6 max-w-3xl mx-auto">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#FFB3C6]/20 blur-3xl pointer-events-none" />

      {/* Main Letter Container */}
      <div className="relative z-10 bg-[#FFFDFE] rounded-3xl p-6 sm:p-12 md:p-14 shadow-[0_20px_50px_rgba(184,93,89,0.16)] border border-[#FFCCD5]/80 paper-texture">
        {/* Subtle Decorative Envelope Stamp & Wax Seal Motif */}
        <div className="flex items-center justify-between border-b border-[#FAD9E0] pb-5 mb-8">
          <div className="flex items-center gap-2 text-xs font-quicksand font-bold text-[#642825] uppercase tracking-widest">
            <Feather className="w-4 h-4 text-[#B85D59]" />
            <span>Chapter III · A Letter From My Heart</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#B85D59]/70 font-quicksand font-medium">
            <FaMoon className="text-[#E8B86D] text-xs" />
            <span>{defaultLetters.loveSection.dateStamp}</span>
          </div>
        </div>

        {/* Handwritten Letter Header */}
        <div className="mb-8">
          <h2 className="font-caveat text-4xl sm:text-5xl md:text-6xl font-bold text-[#642825] leading-tight">
            {defaultLetters.loveSection.heading}
          </h2>
          <div className="w-16 h-0.5 bg-[#FFB3C6] mt-2 rounded-full" />
        </div>

        {/* Unfolded Letter Content (Deep, calm, breathing space) */}
        <div className="space-y-6 font-quicksand text-[#642825] text-base sm:text-lg leading-relaxed font-normal">
          {defaultLetters.loveSection.paragraphs.map((para, idx) => (
            <p key={idx} className="text-[#642825]/90 tracking-wide">
              {para}
            </p>
          ))}
        </div>

        {/* Tender Handwritten Signature */}
        <div className="mt-12 pt-8 border-t border-[#FAD9E0] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-caveat text-3xl sm:text-4xl text-[#642825] font-bold">
              {defaultLetters.loveSection.signature}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#B85D59]/80 font-quicksand font-medium">
            <span>Written with pure love for Jyoti</span>
            <Heart className="w-3.5 h-3.5 fill-[#FFB3C6] text-[#FFB3C6]" />
          </div>
        </div>
      </div>
    </section>
  );
};
