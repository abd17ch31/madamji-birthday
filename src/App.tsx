import React, { useState } from 'react';
import { ImageProvider } from './context/ImageContext';
import { RibbonProgress } from './components/RibbonProgress';
import { AmbientParticles } from './components/AmbientParticles';
import { SectionWelcome } from './components/SectionWelcome';
import { SectionQuizOverlay } from './components/SectionQuizOverlay';
import { SectionRoleInMyLife } from './components/SectionRoleInMyLife';
import { SectionHerBeauty } from './components/SectionHerBeauty';
import { SectionSpecialDay } from './components/SectionSpecialDay';
import { SectionHowMuchILoveHer } from './components/SectionHowMuchILoveHer';
import { SectionMemoriesFlipbook } from './components/SectionMemoriesFlipbook';
import { SectionClosing } from './components/SectionClosing';

export default function App() {
  const [isQuizUnlocked, setIsQuizUnlocked] = useState(false);

  const handleQuizComplete = () => {
    setIsQuizUnlocked(true);
    // Smooth scroll down to Chapter 1 once unlocked
    setTimeout(() => {
      const roleEl = document.getElementById('role-in-my-life');
      if (roleEl) {
        roleEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  };

  return (
    <ImageProvider>
      <div className="relative min-h-[100dvh] bg-[#FAD9E0] text-[#B85D59] font-quicksand selection:bg-[#FFB3C6] selection:text-[#642825]">
        {/* Ribbon Scroll Progress */}
        <RibbonProgress />

        {/* Ambient Floating Sparkles, Petals, and Cursor Heart Trail */}
        <AmbientParticles />

        <main className="relative z-10 w-full overflow-hidden">
          {/* Section 1: Welcome */}
          <SectionWelcome />

          {/* Section 2: Quiz Gate (The gate that stops scrolldown until solved) */}
          <SectionQuizOverlay
            isOpen={true}
            onComplete={handleQuizComplete}
          />

          {/* Only render remaining sections after the user correctly answers all quiz questions */}
          {isQuizUnlocked && (
            <div className="animate-fade-in transition-all duration-700">
              {/* Section 3: Her role in my life */}
              <SectionRoleInMyLife />

              {/* Section 4: Her beauty */}
              <SectionHerBeauty />

              {/* Section 5: Her special day (Cake, Candles, Blow, Poppers, Music) */}
              <SectionSpecialDay />

              {/* Section 6: How much I love her (The Letter) */}
              <SectionHowMuchILoveHer />

              {/* Section 7: Our memories (Flipbook + Long-press Stickers) */}
              <SectionMemoriesFlipbook />

              {/* Section 8: Closing */}
              <SectionClosing />
            </div>
          )}
        </main>
      </div>
    </ImageProvider>
  );
}
