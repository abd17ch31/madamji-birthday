import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  symbol: string;
  opacity: number;
}

export const AmbientParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    if (!mediaQuery.matches) {
      // Capped low count: exactly 12 soft floating particles
      const symbols = ['🌸', '✨', '🤍', '🌸', '✨', '💖'];
      const generated: Particle[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 94 + 3,
        y: Math.random() * 100,
        size: Math.random() * 8 + 12,
        duration: Math.random() * 14 + 16, // 16s - 30s slow drift
        delay: Math.random() * 8,
        symbol: symbols[i % symbols.length],
        opacity: Math.random() * 0.25 + 0.15, // Very soft 15-40% opacity
      }));
      setParticles(generated);
    }

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Desktop cursor trail of tiny hearts
  useEffect(() => {
    if (reducedMotion) return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return; // Desktop only

    let lastCreated = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastCreated < 90) return; // Throttle cursor particles
      lastCreated = now;

      const heart = document.createElement('span');
      heart.className = 'cursor-heart';
      const symbols = ['💖', '🌸', '✨', '🤍', '🌙'];
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = `${e.clientX}px`;
      heart.style.top = `${e.clientY}px`;
      heart.style.opacity = '0.7';
      heart.style.fontSize = `${Math.floor(Math.random() * 6 + 10)}px`;
      document.body.appendChild(heart);

      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 950);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute select-none pointer-events-none transition-transform"
          style={{
            left: `${p.x}vw`,
            bottom: '-40px',
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `drift ${p.duration}s infinite linear`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.symbol}
        </div>
      ))}
    </div>
  );
};
