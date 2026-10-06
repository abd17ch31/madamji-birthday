import React from 'react';
import { useImages } from '../context/ImageContext';
import { defaultLetters } from '../data/defaultContent';
import { Sparkles, Compass } from 'lucide-react';

export const SectionRoleInMyLife: React.FC = () => {
  const { getImageUrl } = useImages();
  const roleImageUrl = getImageUrl('role_portrait');

  return (
    <section id="role-in-my-life" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-[#FFB3C6]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 bg-[#FFF9FA] rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_12px_36px_-8px_rgba(184,93,89,0.18)] border border-white/80 paper-texture">
        {/* Top Header Stamp */}
        <div className="flex items-center justify-between border-b border-[#FAD9E0] pb-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-quicksand font-bold text-[#B85D59] uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#B85D59]" />
            <span>Chapter I · My Anchor & Advisor</span>
          </div>
          <span className="text-xs text-[#B85D59]/60 font-quicksand">
            Special Note
          </span>
        </div>

        {/* Content Layout: Responsive 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Framed Portrait Image (5 Cols) */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[260px] sm:max-w-[280px] p-3.5 bg-white rounded-2xl shadow-[0_10px_25px_rgba(184,93,89,0.15)] border border-[#FAD9E0] -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#FAD9E0]/40">
                {roleImageUrl ? (
                  <img
                    src={roleImageUrl}
                    alt="Jyoti - My Guide and Advisor"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 text-[#B85D59]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="mt-2.5 text-center">
                <span className="font-caveat text-xl sm:text-2xl text-[#642825] font-semibold">
                  Always guiding with grace ✨
                </span>
              </div>
            </div>
          </div>

          {/* Letter Body (7 Cols) */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <h2 className="font-caveat text-4xl sm:text-5xl font-bold text-[#642825] leading-tight mb-4">
              {defaultLetters.roleSection.heading}
            </h2>

            <div className="space-y-4 font-quicksand text-[#642825] text-sm sm:text-base leading-relaxed font-medium">
              {defaultLetters.roleSection.paragraphs.map((p, idx) => (
                <p key={idx} className="text-[#642825]/90">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#FAD9E0]/70 flex items-center gap-2 text-xs text-[#B85D59] font-quicksand font-bold">
              <span>With the deepest gratitude</span>
              <span className="text-[#FFB3C6]">♥</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
