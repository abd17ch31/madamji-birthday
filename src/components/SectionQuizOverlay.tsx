import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { FaMoon } from 'react-icons/fa6';
import { quizQuestions } from '../data/quizQuestions';
import { triggerCandleConfetti } from '../utils/confetti';

interface SectionQuizOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  inline?: boolean;
}

export const SectionQuizOverlay: React.FC<SectionQuizOverlayProps> = ({ isOpen, onComplete, inline = true }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [isSolved, setIsSolved] = useState(false);
  const quizSectionRef = useRef<HTMLDivElement>(null);
  const quizCardRef = useRef<HTMLDivElement>(null);

  // Reset state on open
  useEffect(() => {
    if (!isOpen) return;
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsWrong(false);
    setAttempts(1);
    setIsSolved(false);
  }, [isOpen]);

  // When question index changes, ensure card view is scrolled to top of question
  useEffect(() => {
    if (quizCardRef.current) {
      quizCardRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIdx]);

  // Lock scrolling past the quiz until solved, while allowing clean view of the quiz
  useEffect(() => {
    if (!isOpen || isSolved) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      return;
    }

    // Scroll to the quiz smoothly if user scrolls near it
    const handleScrollLock = () => {
      if (!quizSectionRef.current || isSolved) return;
      const rect = quizSectionRef.current.getBoundingClientRect();
      // If quiz is in view and not solved, keep it nicely centered
      if (rect.top <= 100 && rect.bottom >= window.innerHeight - 100) {
        // Active in quiz
      }
    };

    window.addEventListener('scroll', handleScrollLock, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollLock);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, isSolved]);

  if (!isOpen && isSolved) return null;

  const currentQ = quizQuestions[currentIdx];

  const handleOptionClick = (idx: number) => {
    setSelectedOption(idx);
    if (idx === currentQ.correctIndex) {
      // Correct!
      setIsWrong(false);
      triggerCandleConfetti();

      setTimeout(() => {
        if (currentIdx + 1 < quizQuestions.length) {
          setCurrentIdx(prev => prev + 1);
          setSelectedOption(null);
          setAttempts(1);
        } else {
          // Finished all 4 questions!
          setIsSolved(true);
          setTimeout(() => {
            onComplete();
          }, 800);
        }
      }, 550);
    } else {
      // Wrong option - soft encouragement
      setIsWrong(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => {
        setIsWrong(false);
      }, 700);
    }
  };

  return (
    <section
      id="quiz-gate"
      ref={quizSectionRef}
      className="relative z-20 flex min-h-[100dvh] w-full items-center justify-center px-4 py-8 sm:py-12 bg-[#FAD9E0] scroll-mt-0"
      role="region"
      aria-label="Birthday Quiz Gate"
    >
      <div
        ref={quizCardRef}
        className={`relative w-full max-w-lg bg-[#FFF9FA] rounded-3xl p-5 sm:p-8 shadow-[0_20px_50px_rgba(100,40,37,0.22)] border-2 border-[#FFB3C6]/70 transition-all duration-300 max-h-[88dvh] overflow-y-auto overscroll-contain ${
          isWrong ? 'animate-wiggle' : ''
        }`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#FFB3C6 transparent',
        }}
      >
        {/* Soft Decorative Ribbon Accent */}
        <div className="sticky top-0 z-10 flex justify-center -mt-2 mb-3">
          <div className="bg-[#FFB3C6] px-4 py-1 rounded-full text-xs font-quicksand font-bold text-[#642825] shadow-xs flex items-center gap-1.5 border border-white/60">
            <FaMoon className="text-[#E8B86D] text-xs" />
            <span>Little Love Quiz · Question {currentIdx + 1} of {quizQuestions.length}</span>
          </div>
        </div>

        {/* Progress Bar Dots */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {quizQuestions.map((q, i) => (
            <div
              key={q.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIdx
                  ? 'w-8 bg-[#FFB3C6]'
                  : i < currentIdx
                  ? 'w-4 bg-[#B85D59]'
                  : 'w-2 bg-[#FAD9E0]'
              }`}
            />
          ))}
        </div>

        {/* Question Text (Ensured prominent visibility and crisp hierarchy) */}
        <div className="text-center mb-5 px-1">
          <h2 className="font-caveat text-3xl sm:text-4xl font-bold text-[#642825] leading-snug mb-2">
            {currentQ.question}
          </h2>
          {currentQ.hint && (
            <p className="text-xs sm:text-sm text-[#B85D59]/80 font-quicksand font-medium italic">
              Hint: {currentQ.hint}
            </p>
          )}
        </div>

        {/* Options Grid */}
        <div className="space-y-2.5 mb-4">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = isSelected && idx === currentQ.correctIndex;
            const isWrongPick = isSelected && idx !== currentQ.correctIndex;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionClick(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl font-quicksand text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer border flex items-center justify-between gap-3 active:scale-98 ${
                  isCorrect
                    ? 'bg-[#E8F5E9] border-[#81C784] text-[#2E7D32] shadow-xs scale-[1.01]'
                    : isWrongPick
                    ? 'bg-[#FFEBEE] border-[#FFCDD2] text-[#C62828]'
                    : 'bg-white hover:bg-[#FAD9E0]/40 border-[#FAD9E0] text-[#642825] shadow-2xs hover:border-[#FFB3C6]'
                }`}
              >
                <span className="flex-1 leading-snug">{option}</span>
                {isCorrect && <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0" />}
                {isWrongPick && <span className="text-xs text-[#C62828] font-bold shrink-0">Try again 🌸</span>}
              </button>
            );
          })}
        </div>

        {/* Soft Attempts Indicator (no shame, gentle encouragement) */}
        {attempts > 1 && (
          <div className="text-center text-xs text-[#B85D59]/80 font-quicksand font-medium py-1 animate-pulse flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-[#FFB3C6] text-[#FFB3C6]" />
            <span>Almost there ~ attempt #{attempts}, take your sweet time!</span>
          </div>
        )}

        {/* Solved celebration state */}
        {isSolved && (
          <div className="mt-4 p-3 bg-[#FFF0F5] rounded-2xl text-center text-[#642825] font-quicksand font-bold text-sm animate-bounce flex items-center justify-center gap-2 border border-[#FFB3C6]/60">
            <Sparkles className="w-4 h-4 text-[#E8B86D]" />
            <span>You unlocked everything! Scrolling down to your surprises ❤️</span>
          </div>
        )}
      </div>
    </section>
  );
};
