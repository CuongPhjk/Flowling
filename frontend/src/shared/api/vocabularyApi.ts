import { apiClient } from "./client";
import { PageResult } from "./contentApi";

export interface VocabContext {
  id: number;
  contentId?: number;
  contentTitle?: string;
  sentence: string;
  translation?: string;
  createdAt: string;
}

export interface UserVocab {
  id: number;
  vocabularyId: number;
  term: string;
  partOfSpeech: string;
  meaningVi: string;
  phonetic?: string;
  audioUrl?: string;
  status: "LEARNING" | "MASTERED";
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: string;
  lastReviewedAt?: string;
  createdAt: string;
  encounterCount: number;
  contexts: VocabContext[];
}

export interface SaveVocabPayload {
  term: string;
  partOfSpeech?: string;
  meaningVi?: string;
  phonetic?: string;
  audioUrl?: string;
  contentId?: number;
  sentence?: string;
  translation?: string;
}

export const vocabularyApi = {
  lookup: async (term: string) => {
    const res = await apiClient.get<{ success: boolean; data: any }>(
      "/v1/vocabulary/lookup",
      { params: { term } }
    );
    return res.data.data;
  },

  saveWord: async (payload: SaveVocabPayload) => {
    const res = await apiClient.post<{
      success: boolean;
      data: UserVocab;
    }>("/v1/vocabulary", payload);
    return res.data.data;
  },

  getWordBank: async (params?: {
    status?: "LEARNING" | "MASTERED";
    query?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
  }) => {
    const res = await apiClient.get<{
      success: boolean;
      data: PageResult<UserVocab>;
    }>("/v1/vocabulary", { params });
    return res.data.data;
  },

  deleteWord: async (id: number) => {
    const res = await apiClient.delete<{ success: boolean }>(
      `/v1/vocabulary/${id}`
    );
    return res.data.success;
  },
};
