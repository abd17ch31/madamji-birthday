import { QuizQuestion } from '../types';

/** Questions for the birthday gate. */
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'where did we met first?',
    options: ['In a PUBG game', 'On a late-night terrace walk', 'On a Tinder match', 'On a phone call'],
    correctIndex: 0,
    hint: 'You were my Piro Pilayer'
  },
  {
    id: 2,
    question: "What is the real name of Jyoti?",
    options: ['Chimkin', 'Kuchupuchu', 'Billi', 'All of the above'],
    correctIndex: 3,
    hint: 'Oooh... its going to be hard'
  },
  {
    id: 3,
    question: 'What is your favourite food?',
    options: ['Momo', 'Chowmin', 'Mera sir', 'Parathe'],
    correctIndex: 3,
    hint: 'Guess this in one attempt'
  },
  {
    id: 4,
    question: 'Who is wrong when you make a mistake?',
    options: ['Me', 'My favorite person, Jyoti', 'The kindest person, Jyoti', 'Jyoti - all of the above'],
    correctIndex: 3,
    hint: 'Only one answer includes everything.'
  }
];
