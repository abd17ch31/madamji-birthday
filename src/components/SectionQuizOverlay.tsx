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

export const SectionQuizOverlay: React.FC<SectionQuizOverlayProps> = ({ isOpen, onComplete, inline = false }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [isSolved, setIsSolved] = useState(false);
  const [isActive, setIsActive] = useState(!inline);
  const quizSectionRef = useRef<HTMLDivElement>(null);

  // Let the visitor scroll from the welcome section to the quiz, then stop there.
  useEffect(() => {
    if (!isOpen || !inline || !quizSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          quizSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      { threshold: [0.1] }
    );
    observer.observe(quizSectionRef.current);
    return () => observer.disconnect();
  }, [isOpen, inline]);

  // Keep the page anchored to the question gate until every question is answered.
  useEffect(() => {
    if (!isOpen) return;

    // Reset the gate whenever it is opened so it cannot be bypassed on a later visit.
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsWrong(false);
    setAttempts(1);
    setIsSolved(false);
    setIsActive(!inline);

    if (!inline) {
      return;
    }
  }, [isOpen, inline]);

  useEffect(() => {
    if (!isOpen || !isActive || isSolved) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, [isOpen, isActive, isSolved]);

  if (!isOpen) return null;

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
          }, 900);
        }
      }, 600);
    } else {
      // Wrong option - soft encouragement
      setIsWrong(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => {
        setIsWrong(false);
      }, 800);
    }
  };

  return (
    <div
      ref={quizSectionRef}
      className={inline
        ? 'relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-12 bg-[#FAD9E0] overscroll-none'
        : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#642825]/40 backdrop-blur-md transition-opacity duration-300 overscroll-none'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-title"
    >
      <div
        className={`relative w-full max-w-lg bg-[#FFF9FA] rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(100,40,37,0.3)] border-2 border-[#FFB3C6]/60 transition-transform duration-300 ${
          isWrong ? 'animate-wiggle' : ''
        }`}
      >
        {/* Soft Decorative Ribbon Accent */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFB3C6] px-4 py-1 rounded-full text-xs font-quicksand font-bold text-[#642825] shadow-xs flex items-center gap-1.5 border border-white/60">
          <FaMoon className="text-[#E8B86D] text-xs" />
          <span>Little Love Quiz · Question {currentIdx + 1} of {quizQuestions.length}</span>
        </div>

        {/* Progress Bar Dots */}
        <div className="flex items-center justify-center gap-2 mt-2 mb-6">
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

        {/* Question Text */}
        <div className="text-center mb-6">
          <h2 id="quiz-title" className="font-caveat text-3xl sm:text-4xl font-bold text-[#642825] leading-tight mb-2">
            {currentQ.question}
          </h2>
          {currentQ.hint && (
            <p className="text-xs sm:text-sm text-[#B85D59]/80 font-quicksand font-medium italic">
              Hint: {currentQ.hint}
            </p>
          )}
        </div>

        {/* Options Grid */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = isSelected && idx === currentQ.correctIndex;
            const isWrongPick = isSelected && idx !== currentQ.correctIndex;

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className={`w-full text-left p-4 rounded-2xl font-quicksand text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer border flex items-center justify-between gap-3 ${
                  isCorrect
                    ? 'bg-[#E8F5E9] border-[#81C784] text-[#2E7D32] shadow-xs scale-[1.02]'
                    : isWrongPick
                    ? 'bg-[#FFEBEE] border-[#FFCDD2] text-[#C62828]'
                    : 'bg-white hover:bg-[#FAD9E0]/50 active:scale-98 border-[#FAD9E0] text-[#642825] shadow-xs hover:border-[#FFB3C6]'
                }`}
              >
                <span className="flex-1 leading-snug">{option}</span>
                {isCorrect && <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0" />}
                {isWrongPick && <span className="text-xs text-[#C62828] font-bold">Try again 🌸</span>}
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
          <div className="mt-4 p-3 bg-[#FFF0F5] rounded-2xl text-center text-[#642825] font-quicksand font-bold text-sm animate-bounce flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E8B86D]" />
            <span>You unlocked everything! Welcome to your day ❤️</span>
          </div>
        )}
      </div>
    </div>
  );
};
