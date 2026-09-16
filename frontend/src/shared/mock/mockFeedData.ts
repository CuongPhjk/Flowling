/* ==========================================================================
   EnglishFlow / Flowling - Mock Feed Data
   ========================================================================== */

export interface FeedItem {
  id: string;
  type: 'ARTICLE' | 'PODCAST' | 'VIDEO';
  title: string;
  teaser: string;
  category: string;
  categorySlug: 'science' | 'psychology' | 'environment' | 'tech' | 'culture' | 'economy' | 'health' | 'society' | 'education';
  duration: string;
  thumbnail: string;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags: string[];
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
}

export interface UserProfile {
  name: string;
  avatar: string;
  streakDays: number;
  streakWeek: { day: string; completed: boolean }[];
  dueReviewCount: number;
}

export interface InProgressContent {
  id: string;
  type: 'ARTICLE' | 'PODCAST' | 'VIDEO';
  title: string;
  durationMeta: string;
  progressPercent: number;
  coverImage: string;
  quote: string;
}

export interface WordOfTheDay {
  word: string;
  ipa: string;
  pos: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  highlightWord: string;
}

export interface ReviewWord {
  id: string;
  word: string;
  ipa: string;
  pos: string;
  meaning: string;
  contextSentence: string;
}

export const MOCK_USER: UserProfile = {
  name: 'Minh',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  streakDays: 7,
  streakWeek: [
    { day: 'T2', completed: true },
    { day: 'T3', completed: true },
    { day: 'T4', completed: true },
    { day: 'T5', completed: true },
    { day: 'T6', completed: true },
    { day: 'T7', completed: true },
    { day: 'CN', completed: true },
  ],
  dueReviewCount: 12,
};

export const MOCK_IN_PROGRESS: InProgressContent = {
  id: 'podcast-dream',
  type: 'PODCAST',
  title: 'Why Do We Dream?',
  durationMeta: '🎧 Podcast · 5 phút',
  progressPercent: 62,
  coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  quote: 'Curiosity takes you further.',
};

export const MOCK_WORD_OF_THE_DAY: WordOfTheDay = {
  word: 'perspective',
  ipa: '/pərˈspektɪv/',
  pos: 'noun',
  vietnameseMeaning: 'góc nhìn, quan điểm',
  exampleSentence: 'Travel gives you a fresh perspective on life and everyday problems.',
  highlightWord: 'perspective',
};

export const MOCK_FEED_ITEMS: FeedItem[] = [
  {
    id: 'art-mars',
    type: 'ARTICLE',
    title: 'Could Humans Really Live on Mars?',
    teaser: 'Explore the extreme atmospheric barriers, cosmic radiation shields, and subsurface ice reserves required to establish self-sustaining human habitats.',
    category: 'Khoa học',
    categorySlug: 'science',
    duration: '5 phút đọc',
    thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    likes: 1240,
    isLiked: false,
    isBookmarked: false,
    tags: ['Khoa học', 'Không gian', 'Khám phá'],
    difficulty: 'Intermediate',
  },
  {
    id: 'pod-habits',
    type: 'PODCAST',
    title: 'The Power of Small Habits',
    teaser: 'How tiny 1% incremental improvements compound over months to completely reshape your neural circuitry and personal trajectory.',
    category: 'Tâm lý',
    categorySlug: 'psychology',
    duration: '8 phút nghe',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    likes: 2430,
    isLiked: true,
    isBookmarked: true,
    tags: ['Tâm lý', 'Bản thân', 'Thói quen'],
    difficulty: 'Easy',
  },
  {
    id: 'vid-ocean',
    type: 'VIDEO',
    title: 'Why the Ocean Matters More Than the Amazon Rainforest',
    teaser: 'Marine phytoplankton produce more than 50% of the planet’s oxygen while acting as the primary carbon sponge of our biosphere.',
    category: 'Môi trường',
    categorySlug: 'environment',
    duration: '4:31',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    likes: 3120,
    isLiked: false,
    isBookmarked: false,
    tags: ['Môi trường', 'Thiên nhiên', 'Khí hậu'],
    difficulty: 'Intermediate',
  },
  {
    id: 'art-flow',
    type: 'ARTICLE',
    title: 'The Psychology of Flow State: Deep Work in Practice',
    teaser: 'Discover the optimal cognitive sweet spot where distraction evaporates, time slows down, and complex creative challenges become exhilarating.',
    category: 'Tâm lý',
    categorySlug: 'psychology',
    duration: '6 phút đọc',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    likes: 980,
    isLiked: false,
    isBookmarked: false,
    tags: ['Tâm lý', 'Hiệu suất', 'Tập trung'],
    difficulty: 'Advanced',
  },
  {
    id: 'pod-ai-future',
    type: 'PODCAST',
    title: 'How Generative AI is Reshaping Creative Industries',
    teaser: 'From dynamic soundscapes to procedural writing: Are automated linguistic models expanding human capability or redefining authorship?',
    category: 'Công nghệ',
    categorySlug: 'tech',
    duration: '11 phút nghe',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    likes: 1850,
    isLiked: false,
    isBookmarked: false,
    tags: ['Công nghệ', 'AI', 'Tương lai'],
    difficulty: 'Intermediate',
  },
  {
    id: 'vid-kyoto',
    type: 'VIDEO',
    title: 'The Architecture of Ancient Kyoto: Harmony with Silence',
    teaser: 'A meditative visual exploration of Japanese timber craft, Zen stone gardens, and centuries-old architectural mindfulness.',
    category: 'Văn hóa',
    categorySlug: 'culture',
    duration: '7:15',
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    likes: 4210,
    isLiked: true,
    isBookmarked: true,
    tags: ['Văn hóa', 'Kiến trúc', 'Nhật Bản'],
    difficulty: 'Easy',
  },
];

export const MOCK_TOPICS = [
  { id: 'tech', label: 'Công nghệ', icon: '💻', slug: 'tech' },
  { id: 'science', label: 'Khoa học', icon: '🔬', slug: 'science' },
  { id: 'psychology', label: 'Tâm lý', icon: '🧠', slug: 'psychology' },
  { id: 'health', label: 'Sức khỏe', icon: '❤️', slug: 'health' },
  { id: 'environment', label: 'Môi trường', icon: '🌿', slug: 'environment' },
  { id: 'society', label: 'Xã hội', icon: '👥', slug: 'society' },
  { id: 'culture', label: 'Văn hóa', icon: '🎭', slug: 'culture' },
  { id: 'economy', label: 'Kinh tế', icon: '📈', slug: 'economy' },
  { id: 'education', label: 'Giáo dục', icon: '🎓', slug: 'education' },
] as const;

export const MOCK_REVIEW_CARDS: ReviewWord[] = [
  {
    id: 'word-1',
    word: 'remarkable',
    ipa: '/rɪˈmɑːrkəbl/',
    pos: 'adjective',
    meaning: 'đáng chú ý, phi thường, xuất sắc',
    contextSentence: 'She made a remarkable recovery after the operation.',
  },
  {
    id: 'word-2',
    word: 'consistent',
    ipa: '/kənˈsɪstənt/',
    pos: 'adjective',
    meaning: 'nhất quán, kiên định, trước sau như một',
    contextSentence: 'Small efforts repeated consistently create monumental results.',
  },
  {
    id: 'word-3',
    word: 'inevitable',
    ipa: '/ɪnˈevɪtəbl/',
    pos: 'adjective',
    meaning: 'không thể tránh khỏi, tất yếu',
    contextSentence: 'Change is inevitable; personal growth is intentional.',
  },
];
