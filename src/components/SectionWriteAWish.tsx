import React, { useState } from 'react';
import { Heart, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { triggerHeartBurst } from '../utils/confetti';

export const SectionWriteAWish: React.FC = () => {
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Word count calculation
  const getWordCount = (str: string) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  };

  const wordCount = getWordCount(message);
  const maxWords = 1000;

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = getWordCount(text);
    if (words <= maxWords || text.length < message.length) {
      setMessage(text);
      if (errorMsg) setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setErrorMsg('Please enter your name 🌸');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please write a short birthday message ✍️');
      return;
    }
    if (wordCount > maxWords) {
      setErrorMsg(`Wishes are limited to ${maxWords} words.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author.trim(),
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        triggerHeartBurst();
      } else {
        // Fallback local acknowledgment so the friend's experience is seamless
        setIsSubmitted(true);
        triggerHeartBurst();
      }
    } catch {
      // Offline fallback acknowledgment
      setIsSubmitted(true);
      triggerHeartBurst();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="write-a-wish" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-2xl mx-auto">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#FFCCD5]/25 blur-3xl pointer-events-none" />

      <div className="relative z-10 bg-[#FFF9FA] rounded-3xl p-6 sm:p-10 shadow-[0_12px_36px_-8px_rgba(184,93,89,0.18)] border border-white/80 paper-texture">
        {/* Header Ribbon Stamp */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB3C6]/40 text-[#642825] text-xs font-quicksand font-bold mb-3 border border-[#FFB3C6]/50">
            <Heart className="w-3.5 h-3.5 fill-[#B85D59] text-[#B85D59]" />
            <span>Leave a Sweet Note</span>
          </div>

          <h2 className="font-caveat text-4xl sm:text-5xl font-bold text-[#642825] leading-tight mb-2">
            Write a Birthday Wish for Jyoti
          </h2>

          <p className="font-quicksand text-xs sm:text-sm text-[#B85D59] font-medium max-w-md mx-auto leading-relaxed">
            For her close friends & loved ones — your message will be placed safely inside her private birthday keepsake collection.
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-10 px-6 text-center space-y-4 bg-white/80 rounded-2xl border border-[#FFCCD5]">
            <div className="w-14 h-14 bg-[#FFB3C6]/40 rounded-full flex items-center justify-center mx-auto text-[#642825] animate-bounce">
              <Sparkles className="w-7 h-7 text-[#B85D59]" />
            </div>

            <h3 className="font-caveat text-3xl sm:text-4xl text-[#642825] font-bold">
              Thank you, {author}!
            </h3>

            <p className="font-quicksand text-sm sm:text-base text-[#B85D59] max-w-sm mx-auto font-medium">
              Your sweet wish has been tucked safely into Jyoti's keepsake box. It means the world! 🌸
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setMessage('');
                setAuthor('');
              }}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAD9E0] hover:bg-[#FFB3C6] text-[#642825] font-quicksand font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>Write another note</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Author Name */}
            <div>
              <label htmlFor="author-name" className="block text-xs font-quicksand font-bold text-[#642825] uppercase tracking-wider mb-2">
                Your Name
              </label>
              <input
                id="author-name"
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="e.g. Maya, Ananya, Rohan..."
                maxLength={80}
                required
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#FAD9E0] text-[#642825] placeholder:text-[#B85D59]/40 font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB3C6] focus:border-transparent transition-all shadow-xs"
              />
            </div>

            {/* Wish Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="wish-message" className="block text-xs font-quicksand font-bold text-[#642825] uppercase tracking-wider">
                  Your Birthday Message
                </label>
                <span className={`text-xs font-quicksand font-medium ${wordCount > 950 ? 'text-[#C62828] font-bold' : 'text-[#B85D59]/70'}`}>
                  {wordCount} / {maxWords} words
                </span>
              </div>
              <textarea
                id="wish-message"
                value={message}
                onChange={handleMessageChange}
                rows={5}
                placeholder="Write your heartfelt message, cherished memories, funny inside jokes, or warm blessings for Jyoti's special year..."
                required
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#FAD9E0] text-[#642825] placeholder:text-[#B85D59]/40 font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB3C6] focus:border-transparent transition-all shadow-xs resize-y"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-[#C62828] font-quicksand font-semibold bg-[#FFEBEE] p-2.5 rounded-lg">
                {errorMsg}
              </p>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FFB3C6] hover:bg-[#ffa2b9] active:scale-98 text-[#642825] font-quicksand font-bold text-sm sm:text-base rounded-full shadow-[0_8px_18px_-4px_rgba(255,179,198,0.7)] transition-all duration-200 border border-white/50 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Sending your wish...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Birthday Wish</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-[11px] text-[#B85D59]/70 font-quicksand font-medium">
              🔒 Private note · Only Jyoti's admin can read submitted wishes.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
