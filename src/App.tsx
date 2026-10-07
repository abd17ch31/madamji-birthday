import React, { useState, useEffect } from 'react';
import { ImageProvider } from './context/ImageContext';
import { RibbonProgress } from './components/RibbonProgress';
import { AmbientParticles } from './components/AmbientParticles';
import { SectionWelcome } from './components/SectionWelcome';
import { SectionQuizOverlay } from './components/SectionQuizOverlay';
import { SectionRoleInMyLife } from './components/SectionRoleInMyLife';
import { SectionHerBeauty } from './components/SectionHerBeauty';
import { SectionWriteAWish } from './components/SectionWriteAWish';
import { SectionSpecialDay } from './components/SectionSpecialDay';
import { SectionHowMuchILoveHer } from './components/SectionHowMuchILoveHer';
import { SectionMemoriesFlipbook } from './components/SectionMemoriesFlipbook';
import { SectionClosing } from './components/SectionClosing';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [showQuiz, setShowQuiz] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);

  // Check URL path or hash for /admin
  useEffect(() => {
    const checkAdminRoute = () => {
      if (
        window.location.pathname === '/admin' ||
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true')
      ) {
        setIsAdminView(true);
      }
    };
    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  const handleQuizComplete = () => {
    setShowQuiz(false);
    // Smooth scroll down to Section 3 (Her Role in My Life)
    const roleEl = document.getElementById('role-in-my-life');
    if (roleEl) {
      roleEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  return (
    <ImageProvider>
      <div className="relative min-h-[100dvh] bg-[#FAD9E0] text-[#B85D59] font-quicksand selection:bg-[#FFB3C6] selection:text-[#642825]">
        {/* Ribbon Scroll Progress */}
        <RibbonProgress />

        {/* Ambient Floating Sparkles, Petals, and Cursor Heart Trail */}
        <AmbientParticles />

        {/* Admin Panel View or Main Single-Page Birthday Flow */}
        {isAdminView ? (
          <AdminPanel onBack={handleCloseAdmin} />
        ) : (
          <main className="relative z-10 w-full overflow-hidden">
            {/* Section 1: Welcome */}
            <SectionWelcome />

            {/* Section 2: Quiz Gate (scroll ends here until all questions are answered) */}
            <SectionQuizOverlay
              isOpen={showQuiz}
              inline
              onComplete={handleQuizComplete}
            />

            {/* Section 3: Her role in my life */}
            <SectionRoleInMyLife />

            {/* Section 4: Her beauty */}
            <SectionHerBeauty />

            {/* Section 5: Write a wish */}
            <SectionWriteAWish />

            {/* Section 6: Her special day (Cake, Candles, Blow, Poppers, Music) */}
            <SectionSpecialDay />

            {/* Section 7: How much I love her (The Letter) */}
            <SectionHowMuchILoveHer />

            {/* Section 8: Our memories (Flipbook + Long-press Stickers) */}
            <SectionMemoriesFlipbook />

            {/* Section 9: Closing */}
            <SectionClosing onOpenAdmin={handleOpenAdmin} />
          </main>
        )}
      </div>
    </ImageProvider>
  );
}
