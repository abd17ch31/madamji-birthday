import { QuizQuestion } from '../types';

/**
 * Quiz Questions for the birthday gate.
 * The user can easily edit questions, options, and correctIndex here.
 */
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Where was our very first unforgettable conversation under the stars?",
    options: [
      "At the cozy corner coffee shop",
      "During that quiet late-night terrace walk",
      "While waiting in line in the rain",
      "Over an accidental three-hour phone call"
    ],
    correctIndex: 1,
    hint: "Think about the gentle breeze and looking up at the sky together 🌙"
  },
  {
    id: 2,
    question: "What is Jyoti's absolute signature comfort order whenever we go out?",
    options: [
      "Iced vanilla latte with extra sweetness",
      "Hot chamomile tea and warm chocolate chip cookies",
      "Spicy noodles and iced peach tea",
      "Crispy butter croissants and matcha"
    ],
    correctIndex: 0,
    hint: "It always brings that cute little sweet tooth smile ☕"
  },
  {
    id: 3,
    question: "What is the secret superpower you have that calms my mind instantly?",
    options: [
      "Your infectious, soft laugh that fills the whole room",
      "The way you give gentle, unfiltered life advice",
      "Your warm hand holding mine when everything feels heavy",
      "All of the above — effortlessly, every single day"
    ],
    correctIndex: 3,
    hint: "Every single part of who you are brings light ✨"
  },
  {
    id: 4,
    question: "Who is the brightest, kindest, and most special birthday girl in the universe?",
    options: [
      "Jyoti (my guiding moon & my forever favorite)",
      "Jyoti (the smartest advisor in my life)",
      "Jyoti (the most beautiful soul inside and out)",
      "Jyoti (all of this and so much more ❤️)"
    ],
    correctIndex: 3,
    hint: "There is only one true answer for my favorite person in the world 🌸"
  }
];
