import React, { useState, useRef, forwardRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useImages } from '../context/ImageContext';
import { PlacedSticker } from '../types';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import {
  FaMoon,
} from 'react-icons/fa6';
import cat1 from '../assets/cat stickers/cat 1.png';
import cat2 from '../assets/cat stickers/cat 2.png';
import cat3 from '../assets/cat stickers/cat 3.png';
import cat4 from '../assets/cat stickers/cat 4.png';
import cat5 from '../assets/cat stickers/cat 5.png';
import cat6 from '../assets/cat stickers/cat 6.png';
import cat7 from '../assets/cat stickers/cat 7.png';
import cat8 from '../assets/cat stickers/cat 8.png';
import cat9 from '../assets/cat stickers/cat 9.png';

const STICKER_PALETTE = [
  { id: 'cat_1', category: 'cats' as const, label: 'Cat 1', image: cat1 },
  { id: 'cat_2', category: 'cats' as const, label: 'Cat 2', image: cat2 },
  { id: 'cat_3', category: 'cats' as const, label: 'Cat 3', image: cat3 },
  { id: 'cat_4', category: 'cats' as const, label: 'Cat 4', image: cat4 },
  { id: 'cat_5', category: 'cats' as const, label: 'Cat 5', image: cat5 },
  { id: 'cat_6', category: 'cats' as const, label: 'Cat 6', image: cat6 },
  { id: 'cat_7', category: 'cats' as const, label: 'Cat 7', image: cat7 },
  { id: 'cat_8', category: 'cats' as const, label: 'Cat 8', image: cat8 },
  { id: 'cat_9', category: 'cats' as const, label: 'Cat 9', image: cat9 },
];

// Helper component for single page wrapper with forwardRef as required by react-pageflip
const FlipPage = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full h-full bg-[#FFFDFE] p-4 sm:p-6 flex flex-col justify-between select-none shadow-sm relative overflow-hidden border border-[#FAD9E0]/70 ${className}`}
      >
        {children}
      </div>
    );
  }
);
FlipPage.displayName = 'FlipPage';

export const SectionMemoriesFlipbook: React.FC = () => {
  const { getImageUrl } = useImages();
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [wigglingStickerId, setWigglingStickerId] = useState<string | null>(null);

  // Sticker interaction active flag (disables page flipping during any sticker action)
  const [isStickerActive, setIsStickerActive] = useState(false);

  // Responsive dimensions for HTMLFlipBook
  const [bookDimensions, setBookDimensions] = useState({ width: 340, height: 480 });

  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        // Mobile portrait single page mode
        setBookDimensions({ width: Math.min(screenWidth - 32, 330), height: 460 });
      } else if (screenWidth < 1024) {
        setBookDimensions({ width: 360, height: 490 });
      } else {
        setBookDimensions({ width: 380, height: 500 });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initial placed stickers with positions on pages
  const [stickers, setStickers] = useState<PlacedSticker[]>([
    { id: 's1', type: 'cat_1', category: 'cats', x: 76, y: 14, rotation: 12, scale: 1.2, pageIndex: 0 },
    { id: 's2', type: 'cat_2', category: 'cats', x: 18, y: 80, rotation: -8, scale: 1, pageIndex: 0 },
    { id: 's3', type: 'cat_3', category: 'cats', x: 80, y: 22, rotation: 15, scale: 1.1, pageIndex: 1 },
    { id: 's4', type: 'cat_4', category: 'cats', x: 74, y: 78, rotation: -5, scale: 1, pageIndex: 2 },
    { id: 's5', type: 'cat_5', category: 'cats', x: 18, y: 16, rotation: 8, scale: 1.2, pageIndex: 3 },
    { id: 's6', type: 'cat_6', category: 'cats', x: 78, y: 82, rotation: -12, scale: 1.1, pageIndex: 4 },
  ]);

  // Dragging state with 200ms long-press resolution
  const [activeDragStickerId, setActiveDragStickerId] = useState<string | null>(null);
  const longPressTimerRef = useRef<any>(null);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0, stickerX: 0, stickerY: 0 });
  const containerRectRef = useRef<DOMRect | null>(null);

  const handlePageFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const nextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  // Sticker Wiggle on Tap
  const triggerStickerWiggle = (id: string) => {
    setWigglingStickerId(id);
    setTimeout(() => setWigglingStickerId(null), 450);
  };

  // Add new sticker to current page
  const addStickerToPage = (typeId: string, category: PlacedSticker['category']) => {
    const newSticker: PlacedSticker = {
      id: `stk_${Date.now()}`,
      type: typeId,
      category,
      x: 45 + (Math.random() * 20 - 10),
      y: 45 + (Math.random() * 20 - 10),
      rotation: Math.floor(Math.random() * 30 - 15),
      scale: 1.1,
      pageIndex: currentPage,
    };
    setStickers(prev => [...prev, newSticker]);
    triggerStickerWiggle(newSticker.id);
  };

  // Long-press or Grip-dot drag initiation
  const startStickerDrag = (e: React.MouseEvent | React.TouchEvent, sticker: PlacedSticker, isGripDot = false) => {
    e.stopPropagation();
    setIsStickerActive(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const pageElement = (e.target as HTMLElement).closest('.flip-page-container');
    if (pageElement) {
      containerRectRef.current = pageElement.getBoundingClientRect();
    }

    dragStartPosRef.current = {
      x: clientX,
      y: clientY,
      stickerX: sticker.x,
      stickerY: sticker.y,
    };

    if (isGripDot) {
      // Immediate drag mode via visible fallback grip dot
      isDraggingRef.current = true;
      setActiveDragStickerId(sticker.id);
    } else {
      // 200ms long-press hold to distinguish from page flip swipe
      longPressTimerRef.current = setTimeout(() => {
        isDraggingRef.current = true;
        setActiveDragStickerId(sticker.id);
        triggerStickerWiggle(sticker.id);
      }, 200);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current || !activeDragStickerId || !containerRectRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = ((clientX - dragStartPosRef.current.x) / containerRectRef.current.width) * 100;
    const dy = ((clientY - dragStartPosRef.current.y) / containerRectRef.current.height) * 100;

    setStickers(prev =>
      prev.map(s => {
        if (s.id === activeDragStickerId) {
          const newX = Math.max(5, Math.min(92, dragStartPosRef.current.stickerX + dx));
          const newY = Math.max(5, Math.min(92, dragStartPosRef.current.stickerY + dy));
          return { ...s, x: newX, y: newY };
        }
        return s;
      })
    );
  };

  const stopStickerDrag = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!isDraggingRef.current && activeDragStickerId) {
      triggerStickerWiggle(activeDragStickerId);
    }
    isDraggingRef.current = false;
    setActiveDragStickerId(null);
    setIsStickerActive(false);
  };

  // Render a placed sticker
  const renderStickerItem = (s: PlacedSticker) => {
    const paletteItem = STICKER_PALETTE.find(p => p.id === s.type) || STICKER_PALETTE[0];
    const isWiggling = wigglingStickerId === s.id;
    const isActiveDrag = activeDragStickerId === s.id;

    return (
      <div
        key={s.id}
        onMouseDown={e => startStickerDrag(e, s)}
        onTouchStart={e => startStickerDrag(e, s)}
        onMouseEnter={() => setIsStickerActive(true)}
        onMouseLeave={() => {
          if (!isDraggingRef.current) {
            setIsStickerActive(false);
          }
        }}
        onClick={e => {
          e.stopPropagation();
          triggerStickerWiggle(s.id);
        }}
        style={{
          left: `${s.x}%`,
          top: `${s.y}%`,
          transform: `translate(-50%, -50%) rotate(${s.rotation}deg) scale(${isActiveDrag ? s.scale * 1.25 : s.scale})`,
          zIndex: isActiveDrag ? 40 : 25,
          touchAction: 'none',
        }}
        className={`absolute select-none cursor-grab active:cursor-grabbing group transition-transform ${
          isWiggling ? 'animate-wiggle' : ''
        }`}
      >
        <div
          className={`p-2 bg-white/95 rounded-full shadow-md border border-[#FAD9E0] flex items-center justify-center ${
            isActiveDrag ? 'ring-2 ring-[#FFB3C6]' : ''
          }`}
        >
          <img
            src={paletteItem.image}
            alt={`${paletteItem.label} sticker`}
            draggable={false}
            className="w-12 h-12 object-contain drop-shadow-sm transition-transform pointer-events-none select-none"
          />

          {/* Fallback visible grip dot in corner for instant drag */}
          <div
            onMouseDown={e => startStickerDrag(e, s, true)}
            onTouchStart={e => startStickerDrag(e, s, true)}
            title="Drag sticker"
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#B85D59] rounded-full border border-white flex items-center justify-center opacity-80 group-hover:opacity-100 shadow-xs cursor-move z-10"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    );
  };

  // Image URLs
  const coverImg = getImageUrl('flipbook_cover');
  const page1Img = getImageUrl('flipbook_page_1');
  const page2Img = getImageUrl('flipbook_page_2');
  const page3Img = getImageUrl('flipbook_page_3');
  const backImg = getImageUrl('flipbook_back');

  return (
    <section
      id="our-memories"
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseUp={stopStickerDrag}
      onTouchEnd={stopStickerDrag}
      className="relative py-16 sm:py-24 px-3 sm:px-6 max-w-5xl mx-auto select-none"
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFB3C6]/40 text-[#642825] text-xs font-quicksand font-bold mb-3 border border-[#FFB3C6]/50">
          <FaMoon className="text-[#E8B86D] text-xs" />
          <span>Chapter IV · Keepsake Album</span>
        </div>

        <h2 className="font-caveat text-4xl sm:text-5xl md:text-6xl font-bold text-[#642825] leading-tight mb-2">
          Our Cherished Moments
        </h2>

        <p className="font-quicksand text-xs sm:text-sm text-[#B85D59] font-medium max-w-md mx-auto">
          Swipe or drag the page corners to flip through our memories. Drag stickers using the grip dot or hold to move them! 🌸
        </p>
      </div>

      {/* Flipbook Container */}
      <div className="flex flex-col items-center justify-center relative">
        <div className="p-3 sm:p-6 bg-[#FAD9E0]/40 rounded-3xl border border-white/60 shadow-xl backdrop-blur-xs flex items-center justify-center max-w-full overflow-hidden">
          {/* @ts-ignore */}
          <HTMLFlipBook
            ref={bookRef}
            width={bookDimensions.width}
            height={bookDimensions.height}
            size="fixed"
            minWidth={280}
            maxWidth={420}
            minHeight={420}
            maxHeight={560}
            maxShadowOpacity={0.4}
            showCover={true}
            mobileScrollSupport={true}
            useMouseEvents={!isStickerActive}
            onFlip={handlePageFlip}
            className="shadow-2xl rounded-2xl overflow-hidden"
          >
            {/* Page 0: Cover */}
            <FlipPage className="flip-page-container bg-gradient-to-br from-[#FFF5F7] to-[#FFEBEF]">
              <div className="text-center pt-2">
                <span className="text-[11px] uppercase tracking-widest text-[#B85D59]/70 font-quicksand font-bold">
                  Memory Book · Volume I
                </span>
                <h3 className="font-caveat text-3xl sm:text-4xl text-[#642825] font-bold mt-1">
                  For Jyoti, With Love
                </h3>
              </div>

              {/* Cover Polaroid */}
              <div className="p-2.5 bg-white rounded-xl shadow-md border border-[#FAD9E0] my-auto rotate-1">
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#FAD9E0]/50">
                  <img
                    src={coverImg}
                    alt="Memory cover"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="font-caveat text-xl text-[#642825] font-bold">
                    The Story of Us 🌙
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#B85D59]/80 font-quicksand pt-2 border-t border-[#FAD9E0]">
                <span>Tap or drag edge to open →</span>
                <span className="font-bold">Cover</span>
              </div>

              {stickers.filter(s => s.pageIndex === 0).map(renderStickerItem)}
            </FlipPage>

            {/* Page 1: Memory 1 */}
            <FlipPage className="flip-page-container">
              <div className="flex items-center justify-between border-b border-[#FAD9E0] pb-2">
                <span className="text-xs font-quicksand font-bold text-[#642825]">
                  Our Little Coffee Dates
                </span>
                <span className="text-xs text-[#B85D59]/60 font-quicksand">01</span>
              </div>

              <div className="p-2 bg-white rounded-xl shadow-sm border border-[#FAD9E0] my-auto">
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#FAD9E0]/40">
                  <img
                    src={page1Img}
                    alt="Coffee date"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <p className="font-quicksand text-xs sm:text-sm text-[#642825] leading-relaxed text-center px-1">
                "Where hours feel like minutes, and even the simplest afternoon coffee tastes sweeter across from you."
              </p>

              <div className="text-right text-[11px] text-[#B85D59]/60 font-quicksand">
                Page 1
              </div>

              {stickers.filter(s => s.pageIndex === 1).map(renderStickerItem)}
            </FlipPage>

            {/* Page 2: Memory 2 */}
            <FlipPage className="flip-page-container">
              <div className="flex items-center justify-between border-b border-[#FAD9E0] pb-2">
                <span className="text-xs font-quicksand font-bold text-[#642825]">
                  Golden Hour Walks
                </span>
                <span className="text-xs text-[#B85D59]/60 font-quicksand">02</span>
              </div>

              <div className="p-2 bg-white rounded-xl shadow-sm border border-[#FAD9E0] my-auto -rotate-1">
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#FAD9E0]/40">
                  <img
                    src={page2Img}
                    alt="Sunset walk"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <p className="font-quicksand text-xs sm:text-sm text-[#642825] leading-relaxed text-center px-1">
                "Catching sunsets, laughing at random thoughts, and realizing that home isn't a place — it's you."
              </p>

              <div className="text-right text-[11px] text-[#B85D59]/60 font-quicksand">
                Page 2
              </div>

              {stickers.filter(s => s.pageIndex === 2).map(renderStickerItem)}
            </FlipPage>

            {/* Page 3: Memory 3 */}
            <FlipPage className="flip-page-container">
              <div className="flex items-center justify-between border-b border-[#FAD9E0] pb-2">
                <span className="text-xs font-quicksand font-bold text-[#642825]">
                  Under the Quiet Sky
                </span>
                <span className="text-xs text-[#B85D59]/60 font-quicksand">03</span>
              </div>

              <div className="p-2 bg-white rounded-xl shadow-sm border border-[#FAD9E0] my-auto rotate-1">
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#FAD9E0]/40">
                  <img
                    src={page3Img}
                    alt="Stargazing"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <p className="font-quicksand text-xs sm:text-sm text-[#642825] leading-relaxed text-center px-1">
                "Talking about dreams, stars, and making promises for all the quiet tomorrows yet to come."
              </p>

              <div className="text-right text-[11px] text-[#B85D59]/60 font-quicksand">
                Page 3
              </div>

              {stickers.filter(s => s.pageIndex === 3).map(renderStickerItem)}
            </FlipPage>

            {/* Page 4: Back Cover */}
            <FlipPage className="flip-page-container bg-gradient-to-br from-[#FFEBEF] to-[#FFF5F7]">
              <div className="text-center pt-2">
                <FaMoon className="w-6 h-6 text-[#E8B86D] mx-auto mb-1 animate-moon" />
                <h3 className="font-caveat text-3xl text-[#642825] font-bold">
                  To Many More Chapters
                </h3>
              </div>

              <div className="p-2.5 bg-white rounded-xl shadow-md border border-[#FAD9E0] my-auto">
                <div className="aspect-[3/4] w-full max-h-[190px] rounded-lg overflow-hidden bg-[#FAD9E0]/50">
                  <img
                    src={backImg}
                    alt="Memory back"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="font-caveat text-2xl text-[#642825] font-bold">
                  Forever and always ❤️
                </p>
                <p className="text-[11px] text-[#B85D59]/70 font-quicksand font-medium">
                  Jyoti's Keepsake
                </p>
              </div>

              {stickers.filter(s => s.pageIndex === 4).map(renderStickerItem)}
            </FlipPage>
          </HTMLFlipBook>
        </div>

        {/* Flipbook Navigation Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={prevPage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAD9E0] text-[#642825] font-quicksand font-bold text-xs shadow-xs border border-[#FAD9E0] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Page</span>
          </button>

          <span className="text-xs font-quicksand font-bold text-[#642825]">
            Page {currentPage + 1}
          </span>

          <button
            onClick={nextPage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAD9E0] text-[#642825] font-quicksand font-bold text-xs shadow-xs border border-[#FAD9E0] transition-colors cursor-pointer"
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Draggable Cat Sticker Palette Tray */}
      <div className="mt-8 bg-white/90 rounded-2xl p-4 max-w-xl mx-auto border border-[#FFCCD5] shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 text-xs font-quicksand font-bold text-[#642825]">
            <Sparkles className="w-4 h-4 text-[#E8B86D]" />
            <span>Cat Sticker Tray · Tap to stick onto this page</span>
          </div>
          <span className="text-[11px] text-[#B85D59]/70 font-quicksand">
            Drag with grip dot or long-press
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {STICKER_PALETTE.map(p => {
            return (
              <button
                key={p.id}
                onClick={() => addStickerToPage(p.id, p.category)}
                title={`Add ${p.label} sticker to page`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8F9] hover:bg-[#FFB3C6]/30 active:scale-95 rounded-xl border border-[#FAD9E0] text-xs font-quicksand font-semibold text-[#642825] transition-all cursor-pointer shadow-2xs"
              >
                <img src={p.image} alt={`${p.label} sticker`} className="w-8 h-8 object-contain" />
                <span>{p.label}</span>
                <Plus className="w-3 h-3 text-[#B85D59]/60" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
