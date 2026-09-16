export type ContentType = "ARTICLE" | "PODCAST" | "VIDEO";
export type Difficulty = "Easy" | "Intermediate" | "Advanced";
export interface Paragraph {
  en: string;
  vi: string;
}
export interface Segment {
  id: string;
  startMs: number;
  endMs: number;
  englishText: string;
  vietnameseText: string;
  position: number;
}
export interface Content {
  id: string;
  slug: string;
  title: string;
  teaser: string;
  type: ContentType;
  category: string;
  difficulty: Difficulty;
  thumbnail: string;
  duration: number;
  likes: number;
  author: string;
  publishedAt: number;
  status: "DRAFT" | "PUBLISHED";
  paragraphs: Paragraph[];
  segments: Segment[];
  mediaUrl: string;
}
export interface Vocabulary {
  id: string;
  word: string;
  ipa: string;
  pos: string;
  meaning: string;
}
export interface UserVocabulary {
  id: string;
  vocabularyId: string;
  status: "LEARNING" | "MASTERED";
  ease: number;
  interval: number;
  repetitions: number;
  nextReviewAt: number;
  createdAt: number;
}
export interface VocabularyContext {
  id: string;
  userVocabularyId: string;
  contentId: string;
  sentence: string;
  translation: string;
  note: string;
  createdAt: number;
  startMs?: number;
  endMs?: number;
}
export interface Progress {
  contentId: string;
  percent: number;
  position: number;
  seconds: number;
  updatedAt: number;
  rewarded: boolean;
}
export interface Profile {
  name: string;
  email: string;
  avatar: string;
  xp: number;
  streak: number;
  activity: Record<string, number>;
  speed: number;
  theme: "light" | "dark";
  reading: "English" | "Bilingual";
}
export interface PersonalData {
  profile: Profile;
  saved: string[];
  liked: string[];
  words: UserVocabulary[];
  contexts: VocabularyContext[];
  progress: Progress[];
  sentences: { contentId: string; segmentId: string }[];
  snoozeUntil: number;
  reviewsToday: Record<string, number>;
}
export interface Account {
  id: string;
  email: string;
  passwordHash: string;
  role: "USER" | "ADMIN";
  data: PersonalData;
}
export interface DemoState {
  version: 1;
  contents: Content[];
  vocabulary: Vocabulary[];
  accounts: Account[];
  currentAccountId: string | null;
}
export type Grade = "AGAIN" | "HARD" | "GOOD" | "EASY";
