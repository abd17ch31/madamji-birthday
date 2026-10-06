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
      "Whenever the world gets noisy, you are the voice of calm that brings me right back to earth. You have this rare, quiet wisdom — never telling me what I want to hear just to make things easy, but gently pointing me toward who I truly want to be.",
      "You've been my advisor in the moments where I couldn't see past the fog, my sanity check when I was overthinking, and my favorite partner in figuring life out step by step.",
      "Having you by my side has changed the way I think, the way I listen, and the way I care. You don't just share my days; you shape my entire journey."
    ]
  },
  beautySection: {
    heading: "In all your gentle beauty",
    paragraphs: [
      "There is a warmth in your eyes that makes any room feel like home. It's the way your face lights up right before you burst into that crinkly-eyed laughter, and the quiet grace you carry without ever trying to prove anything to anyone.",
      "I love the subtle details: the soft tilt of your head when you're deeply focused, the effortless glow of your skin in the afternoon light, and how even on ordinary, tired days, you are the most captivating person in my sight.",
      "Your beauty is honest, tender, and uniquely yours."
    ]
  },
  loveSection: {
    heading: "To my favorite person on earth",
    dateStamp: "On your birthday, and every day that follows",
    paragraphs: [
      "Happy Birthday, my Jyoti. If there is one thing I know with complete certainty, it is that meeting you rewired the meaning of peace for me.",
      "Loving you is not complicated or grandiloquent. It lives in the small, sacred corners of our ordinary days: sharing quiet morning thoughts, listening to your stories about work and friends, feeling your head rest against my shoulder after a long day, and catching each other's glances across a crowded room.",
      "You make me feel safe to be vulnerable, ambitious to grow, and endlessly grateful just to exist at the same time as you. On this birthday, I want to promise you patience through the uncertain days, deep appreciation for the quiet ones, and unwavering celebration of all the joy, dreams, and milestones ahead.",
      "You are my moon — gentle, steady, and lighting up my whole sky.",
      "Happy Birthday, Jyoti. I love you endlessly."
    ],
    signature: "Always yours, with all my heart ❤️"
  },
  closingText: "May this year be as sweet, gentle, and radiant as you are to everyone lucky enough to know you."
};
