export interface Wish {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
}

export interface ImageSlot {
  id: string;
  title: string;
  description: string;
  aspectRatio: string;
  defaultUrl: string;
  currentUrl: string;
}

export interface PlacedSticker {
  id: string;
  type: string;
  category: 'hearts' | 'stars' | 'moon' | 'flowers' | 'cats' | 'sparkles';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  rotation: number;
  scale: number;
  pageIndex: number;
}
