import React, { useEffect, useState } from 'react';

export const RibbonProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-50 pointer-events-none bg-[#FAD9E0]/40 backdrop-blur-xs">
      <div
        className="h-full bg-gradient-to-r from-[#FFB3C6] via-[#F48FB1] to-[#B85D59] rounded-r-full transition-all duration-150 ease-out shadow-[0_0_8px_rgba(255,179,198,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
