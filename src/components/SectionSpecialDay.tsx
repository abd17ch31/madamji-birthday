import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, MicOff, Volume2, VolumeX, RotateCcw, PartyPopper } from 'lucide-react';
import { triggerCandleConfetti, triggerBalloonConfetti, triggerCornerPopper } from '../utils/confetti';
import { birthdayMusic } from '../utils/audioSynthesizer';

interface BalloonItem {
  id: number;
  x: number;
  y: number;
  color: string;
  isPopped: boolean;
  size: number;
  speed: number;
}

export const SectionSpecialDay: React.FC = () => {
  // 5 Candles state (all lit initially)
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true, true, true]);
  const [isAllBlownOut, setIsAllBlownOut] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);

  // Audio Player state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Microphone detection state
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Interactive Balloons (floating in section background)
  const [balloons, setBalloons] = useState<BalloonItem[]>([
    { id: 1, x: 8, y: 35, color: '#FFB3C6', isPopped: false, size: 54, speed: 22 },
    { id: 2, x: 88, y: 25, color: '#FAD9E0', isPopped: false, size: 48, speed: 18 },
    { id: 3, x: 18, y: 70, color: '#FFD166', isPopped: false, size: 50, speed: 25 },
    { id: 4, x: 82, y: 65, color: '#FFCCD5', isPopped: false, size: 56, speed: 20 },
    { id: 5, x: 92, y: 45, color: '#FFB3C6', isPopped: false, size: 44, speed: 24 },
  ]);

  // Sync music state
  useEffect(() => {
    const unsub = birthdayMusic.subscribe((state) => {
      setIsPlayingMusic(state);
    });
    return () => {
      unsub();
    };
  }, []);

  // Check if all candles are blown out
  useEffect(() => {
    const allOut = candlesLit.every(lit => !lit);
    if (allOut && !isAllBlownOut) {
      setIsAllBlownOut(true);
      setShowSmoke(true);
      triggerCandleConfetti();
      setTimeout(() => setShowSmoke(false), 3000);
    }
  }, [candlesLit, isAllBlownOut]);

  // Tap single candle to blow out
  const handleCandleClick = (index: number) => {
    setCandlesLit(prev => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  // Blow out all candles
  const blowOutAllCandles = () => {
    setCandlesLit([false, false, false, false, false]);
  };

  // Relight all candles
  const relightCandles = () => {
    setCandlesLit([true, true, true, true, true]);
    setIsAllBlownOut(false);
    setShowSmoke(false);
  };

  // Pop a balloon
  const handleBalloonClick = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerBalloonConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

    setBalloons(prev =>
      prev.map(b => (b.id === id ? { ...b, isPopped: true } : b))
    );
  };

  // Restore balloons if all popped
  const resetBalloons = () => {
    setBalloons(prev => prev.map(b => ({ ...b, isPopped: false })));
  };

  // Microphone Blow Detection (Web Audio API)
  const toggleMicDetection = async () => {
    if (micActive) {
      // Turn off
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      setMicActive(false);
      return;
    }

    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setMicActive(true);

      const checkBlow = () => {
        analyser.getByteFrequencyData(dataArray);

        // Blow generates high low-frequency energy / volume threshold
        let sum = 0;
        for (let i = 0; i < 20; i++) {
          sum += dataArray[i];
        }
        const lowFreqAverage = sum / 20;

        if (lowFreqAverage > 165) {
          // Detected strong breath!
          blowOutAllCandles();
        }

        animFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch {
      setMicError('Mic permission was not granted. You can still tap the candles!');
      setMicActive(false);
    }
  };

  // Cleanup mic on unmount
  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <section id="her-special-day" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto overflow-hidden">
      {/* Floating Interactive Balloons (Poppable) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {balloons.map(balloon => {
          if (balloon.isPopped) return null;
          return (
            <div
              key={balloon.id}
              onClick={(e) => handleBalloonClick(e, balloon.id)}
              style={{
                left: `${balloon.x}%`,
                top: `${balloon.y}%`,
                width: `${balloon.size}px`,
                height: `${balloon.size * 1.25}px`,
                backgroundColor: balloon.color,
              }}
              title="Click to pop!"
              className="absolute pointer-events-auto rounded-full shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-transform flex items-center justify-center border border-white/60 group"
            >
              {/* Balloon Shine Highlight */}
              <div className="absolute top-2 left-2.5 w-2 h-3.5 bg-white/60 rounded-full rotate-12" />
              {/* Balloon String */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#B85D59]/40" />
            </div>
          );
        })}
      </div>

      <div className="relative z-20 bg-[#FFF9FA] rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_12px_36px_-8px_rgba(184,93,89,0.18)] border border-white/80 paper-texture text-center">
        {/* Header Section */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFB3C6]/40 text-[#642825] text-xs font-quicksand font-bold mb-3 border border-[#FFB3C6]/50">
          <Sparkles className="w-3.5 h-3.5 text-[#E8B86D]" />
          <span>Make a Birthday Wish</span>
        </div>

        <h2 className="font-caveat text-4xl sm:text-5xl md:text-6xl font-bold text-[#642825] leading-tight mb-2">
          Blow Out the Candles, Jyoti! 🎂
        </h2>

        <p className="font-quicksand text-xs sm:text-sm text-[#B85D59] font-medium max-w-md mx-auto mb-8">
          Close your eyes, make the sweetest wish for this coming year, and blow out your candles.
        </p>

        {/* The Birthday Cake Display */}
        <div className="relative max-w-sm mx-auto my-6 flex flex-col items-center">
          {/* Candles Row */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 mb-[-6px] z-20">
            {candlesLit.map((isLit, idx) => (
              <div
                key={idx}
                onClick={() => handleCandleClick(idx)}
                className="flex flex-col items-center cursor-pointer group"
                title="Click candle to blow out"
              >
                {/* Flame / Smoke */}
                <div className="h-7 flex items-center justify-center">
                  {isLit ? (
                    <div className="w-4 h-6 bg-gradient-to-t from-[#FF7A00] via-[#FFD166] to-white rounded-full animate-flame shadow-[0_0_12px_#FFAA33]" />
                  ) : showSmoke ? (
                    <div className="w-2 h-4 text-xs text-slate-400 animate-smoke select-none">
                      💨
                    </div>
                  ) : (
                    <div className="w-1 h-2 bg-slate-600 rounded-xs opacity-70" />
                  )}
                </div>

                {/* Candle Body */}
                <div
                  className="w-3.5 h-12 rounded-t-sm border border-white/60 shadow-xs transition-colors"
                  style={{
                    backgroundColor: idx % 2 === 0 ? '#FFB3C6' : '#FFD166',
                  }}
                >
                  <div className="w-full h-1 bg-white/50 mt-1" />
                  <div className="w-full h-1 bg-white/50 mt-2" />
                </div>
              </div>
            ))}
          </div>

          {/* Cake Top Tier */}
          <div className="w-48 sm:w-56 h-16 bg-[#FFCCD5] rounded-t-3xl border-2 border-white/80 relative shadow-inner overflow-hidden">
            {/* Frosting drips */}
            <div className="absolute top-0 left-0 right-0 h-5 bg-[#FFF0F5] rounded-b-xl border-b border-white/60" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3 text-xs opacity-80">
              <span>🍓</span>
              <span>🌸</span>
              <span>🍓</span>
            </div>
          </div>

          {/* Cake Base Tier */}
          <div className="w-64 sm:w-72 h-20 bg-[#FAD9E0] rounded-t-2xl rounded-b-lg border-2 border-white/80 relative shadow-md overflow-hidden">
            {/* Middle cream ribbon */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#FFF0F5] border-b border-white/60" />
            <div className="absolute bottom-2 left-0 right-0 flex justify-around text-xs text-[#642825]/40 font-caveat font-bold">
              <span>★</span>
              <span>Jyoti</span>
              <span>★</span>
              <span>Happy Birthday</span>
              <span>★</span>
            </div>
          </div>

          {/* Cake Stand / Platter */}
          <div className="w-72 sm:w-80 h-3.5 bg-gradient-to-r from-[#E8B86D] via-[#FCE38A] to-[#E8B86D] rounded-full shadow-lg border border-white/50 mt-0.5" />
          <div className="w-24 h-4 bg-[#E8B86D]/80 rounded-b-lg shadow-sm" />
        </div>

        {/* Blow Status / Celebration Banner */}
        {isAllBlownOut ? (
          <div className="my-6 p-4 bg-[#FFF0F5] rounded-2xl max-w-md mx-auto border border-[#FFCCD5] space-y-3 animate-fade-in">
            <h3 className="font-caveat text-3xl sm:text-4xl text-[#642825] font-bold">
              All your wishes are soaring into the stars! ✨
            </h3>
            <p className="font-quicksand text-xs sm:text-sm text-[#B85D59] font-medium">
              May every single dream you carry quietly in your heart come true this year.
            </p>
            <button
              onClick={relightCandles}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFB3C6] hover:bg-[#ffa2b9] text-[#642825] font-quicksand font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Relight candles & make another wish</span>
            </button>
          </div>
        ) : (
          <div className="my-4 flex flex-wrap items-center justify-center gap-3">
            {/* Tap Blow Out Button */}
            <button
              onClick={blowOutAllCandles}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFB3C6] hover:bg-[#ffa2b9] text-[#642825] font-quicksand font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all active:scale-95 border border-white/60 cursor-pointer"
            >
              <span>💨 Tap to Blow All Candles</span>
            </button>

            {/* Mic Detection Button */}
            <button
              onClick={toggleMicDetection}
              className={`inline-flex items-center gap-2 px-5 py-2.5 font-quicksand font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all active:scale-95 border border-white/60 cursor-pointer ${
                micActive
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#81C784]'
                  : 'bg-white hover:bg-[#FAD9E0]/40 text-[#642825]'
              }`}
            >
              {micActive ? (
                <>
                  <Mic className="w-4 h-4 text-[#2E7D32] animate-pulse" />
                  <span>Mic Active: Blow gently!</span>
                </>
              ) : (
                <>
                  <MicOff className="w-4 h-4 text-[#B85D59]" />
                  <span>Enable Mic to Blow (Bonus)</span>
                </>
              )}
            </button>
          </div>
        )}

        {micError && (
          <p className="text-xs text-[#C62828] font-quicksand font-medium mt-1">
            {micError}
          </p>
        )}

        {/* Audio Player for "Happy Birthday to You" */}
        <div className="mt-8 pt-6 border-t border-[#FAD9E0] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-[#FFCCD5] flex items-center justify-center text-[#642825] shadow-xs shrink-0">
              {isPlayingMusic ? (
                <Volume2 className="w-5 h-5 text-[#642825] animate-pulse" />
              ) : (
                <VolumeX className="w-5 h-5 text-[#B85D59]/70" />
              )}
            </div>
            <div>
              <p className="text-xs font-quicksand font-bold text-[#642825]">
                Happy Birthday Melody 🎶
              </p>
              <p className="text-[11px] text-[#B85D59]/80 font-quicksand">
                {isPlayingMusic ? 'Playing gentle birthday music...' : 'Tap play to listen to your melody'}
              </p>
            </div>
          </div>

          <button
            onClick={() => birthdayMusic.toggle()}
            className={`px-5 py-2 rounded-full font-quicksand font-bold text-xs shadow-xs transition-all cursor-pointer ${
              isPlayingMusic
                ? 'bg-[#B85D59] text-white'
                : 'bg-[#FFB3C6] hover:bg-[#ffa2b9] text-[#642825]'
            }`}
          >
            {isPlayingMusic ? 'Pause Melody' : 'Play Melody'}
          </button>
        </div>

        {/* Balloon Pop & Corner Party Poppers Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {balloons.some(b => b.isPopped) && (
            <button
              onClick={resetBalloons}
              className="text-xs text-[#B85D59] hover:text-[#642825] underline font-quicksand font-semibold transition-colors cursor-pointer"
            >
              🎈 Restore popped balloons
            </button>
          )}
        </div>
      </div>

      {/* Clickable Party Poppers in Bottom Corners */}
      <button
        onClick={() => triggerCornerPopper('left')}
        title="Pop confetti from left corner!"
        className="absolute bottom-4 left-4 z-30 p-3 bg-white/90 hover:bg-white active:scale-90 rounded-full shadow-lg border border-[#FFCCD5] text-[#642825] transition-transform cursor-pointer group"
      >
        <PartyPopper className="w-5 h-5 text-[#B85D59] group-hover:rotate-12 transition-transform" />
      </button>

      <button
        onClick={() => triggerCornerPopper('right')}
        title="Pop confetti from right corner!"
        className="absolute bottom-4 right-4 z-30 p-3 bg-white/90 hover:bg-white active:scale-90 rounded-full shadow-lg border border-[#FFCCD5] text-[#642825] transition-transform cursor-pointer group"
      >
        <PartyPopper className="w-5 h-5 text-[#B85D59] group-hover:-rotate-12 transition-transform scale-x-[-1]" />
      </button>
    </section>
  );
};
