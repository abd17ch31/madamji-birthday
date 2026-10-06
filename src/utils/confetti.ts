import confetti from 'canvas-confetti';

const colors = ['#FFB3C6', '#FAD9E0', '#B85D59', '#FFD166', '#FFCCD5', '#FFF0F5', '#E8B86D'];

export const triggerCandleConfetti = () => {
  try {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      disableForReducedMotion: true,
      scalar: 1.1,
    });
  } catch {
    // fallback safe
  }
};

export const triggerBalloonConfetti = (x: number, y: number) => {
  try {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: {
        x: Math.max(0.05, Math.min(0.95, x / window.innerWidth)),
        y: Math.max(0.05, Math.min(0.95, y / window.innerHeight)),
      },
      colors,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  } catch {
    // fallback safe
  }
};

export const triggerCornerPopper = (corner: 'left' | 'right') => {
  try {
    confetti({
      particleCount: 60,
      angle: corner === 'left' ? 60 : 120,
      spread: 55,
      origin: {
        x: corner === 'left' ? 0.05 : 0.95,
        y: 0.9,
      },
      colors,
      disableForReducedMotion: true,
    });
  } catch {
    // fallback safe
  }
};

export const triggerHeartBurst = () => {
  try {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        shapes: ['circle', 'square'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        shapes: ['circle', 'square'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  } catch {
    // fallback safe
  }
};
