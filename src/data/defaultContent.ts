import welcomeImg from '../assets/images/jyoti_welcome_portrait_1791303224848.jpg';
import roleImg from '../assets/images/jyoti_role_portrait_1791303246072.jpg';
import beautyImg from '../assets/images/jyoti_beauty_portrait_1791303259389.jpg';
import dateImg from '../assets/images/memory_photo_date_1791303272565.jpg';
import sunsetImg from '../assets/images/memory_photo_sunset_1791303283893.jpg';
import starsImg from '../assets/images/memory_photo_stars_1791303295857.jpg';
import { ImageSlot } from '../types';

export const initialImageSlots: ImageSlot[] = [
  {
    id: 'welcome_portrait',
    title: 'Welcome Polaroid Photo',
    description: 'Large portrait image with polaroid frame in Section 1 (Welcome)',
    aspectRatio: '3:4',
    defaultUrl: welcomeImg,
    currentUrl: welcomeImg,
  },
  {
    id: 'role_portrait',
    title: 'Role in My Life Portrait',
    description: 'Framed portrait photo in Section 3 (Advisor & Life Shaper)',
    aspectRatio: '3:4',
    defaultUrl: roleImg,
    currentUrl: roleImg,
  },
  {
    id: 'beauty_portrait',
    title: 'Her Beauty Portrait',
    description: 'Torn-paper / polaroid photo in Section 4 (Her Beauty)',
    aspectRatio: '4:3',
    defaultUrl: beautyImg,
    currentUrl: beautyImg,
  },
  {
    id: 'flipbook_cover',
    title: 'Memory Book Cover Photo',
    description: 'Cover polaroid image on Section 8 (Flipbook Cover)',
    aspectRatio: '4:3',
    defaultUrl: dateImg,
    currentUrl: dateImg,
  },
  {
    id: 'flipbook_page_1',
    title: 'Memory Book Page 1 Photo',
    description: 'First memory moment inside the flipbook',
    aspectRatio: '4:3',
    defaultUrl: dateImg,
    currentUrl: dateImg,
  },
  {
    id: 'flipbook_page_2',
    title: 'Memory Book Page 2 Photo',
    description: 'Second memory moment (Sunset walk / laughs)',
    aspectRatio: '4:3',
    defaultUrl: sunsetImg,
    currentUrl: sunsetImg,
  },
  {
    id: 'flipbook_page_3',
    title: 'Memory Book Page 3 Photo',
    description: 'Third memory moment (Stargazing & dreams)',
    aspectRatio: '4:3',
    defaultUrl: starsImg,
    currentUrl: starsImg,
  },
  {
    id: 'flipbook_back',
    title: 'Memory Book Back Cover Photo',
    description: 'Final sweet closing photo on the memory album',
    aspectRatio: '3:4',
    defaultUrl: welcomeImg,
    currentUrl: welcomeImg,
  }
];

export const defaultLetters = {
  roleSection: {
    heading: "The person who shapes my world",
    paragraphs: [
      "You have always been there for me, no matter what happened. Whenever I had to make a tough decision in life, I always looked towards you, and you were always there to support me and stand by me. You have supported me through so many things, and I honestly don’t know what I would have done without you. I promise I’ll always be thankful for all the support you’ve given me, and I’ll always be grateful to have you by my side."
    ]
  },
  beautySection: {
    heading: "In all your gentle beauty",
    paragraphs: [
      "As beautiful as you are on the outside, your heart is so much more beautiful. I love the way you care for animals, notice the little things, and always have a soft spot for things and people that most would simply overlook. In a world where so many people pretend to be someone they’re not, you are one of the few people who feels completely real. You have this kindness in you that never feels forced, and that’s what makes you even more beautiful to me.",
      "It’s not just your face that makes you special. It’s the heart behind it, the way you care, the little things you do without even realizing, and the person you are when no one is watching."

    ]
  },
  loveSection: {
  heading: "To my favorite person on earth",
  dateStamp: "On your birthday, and every day that follows",
  paragraphs: [
    "Happy Birthday, my Jyoti. If there is one thing I feel every time I look at you, it is how proud I am of the person you have become. I’m proud of your heart, your kindness, the way you care for others, and even the little things you do that you probably don’t think twice about.",
    "I’m proud of you for everything you’ve faced, for the way you keep going even when things aren’t easy, and for all the dreams you carry in your heart. Watching you grow, learn, and become a better version of yourself makes me genuinely happy. I hope you always know that I’ll be there to celebrate your little wins, your biggest achievements, and everything in between.",
    "You deserve all the happiness, love, peace, and success in the world. I hope this year brings you closer to everything you dream about. Never forget how special you are and how many reasons there are to be proud of you.",
    "I’ll always be proud to call you mine, and I’ll always be cheering for you, no matter where life takes us.",
    "Happy Birthday, Jyoti. ❤️ I love you, and I’m so, so proud of you."
  ],
  signature: "Always yours, with all my heart ❤️"
},
closingText: "May this year bring you all the happiness, love, and success you deserve, and may you always have reasons to smile and be proud of yourself."
};
