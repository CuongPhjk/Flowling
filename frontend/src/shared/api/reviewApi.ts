import { apiClient } from "./client";

export type ReviewGrade = "AGAIN" | "HARD" | "GOOD" | "EASY";

export interface ReviewCard {
  userVocabId: number;
  vocabularyId: number;
  term: string;
  partOfSpeech: string;
  meaningVi: string;
  phonetic?: string;
  audioUrl?: string;
  status: "LEARNING" | "MASTERED";
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  sampleSentence?: string;
  sampleTranslation?: string;
}

export interface ReviewSubmitResult {
  userVocabId: number;
  status: "LEARNING" | "MASTERED";
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewAt: string;
  xpEarned: number;
  totalXp: number;
}

export const reviewApi = {
  getDueReviews: async (limit = 20) => {
    const res = await apiClient.get<{
      success: boolean;
      data: ReviewCard[];
    }>("/v1/review/due", { params: { limit } });
    return res.data.data;
  },

  submitReview: async (userVocabId: number, grade: ReviewGrade) => {
    const res = await apiClient.post<{
      success: boolean;
      data: ReviewSubmitResult;
    }>(`/v1/review/${userVocabId}`, { grade });
    return res.data.data;
  },
};
