import React from 'react';
import { useImages } from '../context/ImageContext';
import { defaultLetters } from '../data/defaultContent';
import { Sparkles, Heart } from 'lucide-react';
import { FaSun } from 'react-icons/fa6';

export const SectionHerBeauty: React.FC = () => {
  const { getImageUrl } = useImages();
  const beautyImageUrl = getImageUrl('beauty_portrait');

  return (
    <section id="her-beauty" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Soft Decorative Ambient Background */}
      <div className="absolute -top-10 right-0 w-72 h-72 rounded-full bg-[#FFCCD5]/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 bg-[#FFF9FA] rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_12px_36px_-8px_rgba(184,93,89,0.18)] border border-white/80 paper-texture">
        {/* Header Ribbon Stamp */}
        <div className="flex items-center justify-between border-b border-[#FAD9E0] pb-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-quicksand font-bold text-[#B85D59] uppercase tracking-wider">
            <FaSun className="text-[#E8B86D] text-xs" />
            <span>Chapter II · Her Radiant Spirit</span>
          </div>
          <span className="text-xs text-[#B85D59]/60 font-quicksand">
            Gentle Moments
          </span>
        </div>

        {/* Content Layout: Reversed on desktop for visual rhythm */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Sincere Letter Body (7 Cols) */}
          <div className="order-2 md:order-1 md:col-span-7 flex flex-col justify-center">
            <h2 className="font-caveat text-4xl sm:text-5xl font-bold text-[#642825] leading-tight mb-4">
              {defaultLetters.beautySection.heading}
            </h2>

            <div className="space-y-4 font-quicksand text-[#642825] text-sm sm:text-base leading-relaxed font-medium">
              {defaultLetters.beautySection.paragraphs.map((p, idx) => (
                <p key={idx} className="text-[#642825]/90">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-[#B85D59] font-quicksand font-semibold">
              <Sparkles className="w-4 h-4 text-[#E8B86D]" />
              <span>Glow that lights up every room</span>
            </div>
          </div>

          {/* Torn-Paper / Polaroid Framed Image (5 Cols) */}
          <div className="order-1 md:order-2 md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] p-4 bg-white rounded-2xl shadow-[0_14px_30px_rgba(184,93,89,0.18)] border border-[#FAD9E0] rotate-2 hover:rotate-0 transition-transform duration-300">
              {/* Cute Washi Tape Stamp */}
              <div className="absolute -top-3 right-8 w-24 h-5 bg-[#FFCCD5]/80 backdrop-blur-xs rounded-xs -rotate-2 border border-white/50 pointer-events-none" />

              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAD9E0]/40">
                {beautyImageUrl ? (
                  <img
                    src={beautyImageUrl}
                    alt="Jyoti - Radiant Beauty"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 text-[#B85D59]">
                    <Heart className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between px-1">
                <span className="font-caveat text-xl sm:text-2xl text-[#642825] font-bold">
                  Warmth in every smile 🌸
                </span>
                <Heart className="w-4 h-4 text-[#FFB3C6] fill-[#FFB3C6]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
