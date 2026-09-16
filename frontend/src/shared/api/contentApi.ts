import { apiClient } from "./client";

export interface ContentSummary {
  id: number;
  type: "ARTICLE" | "PODCAST" | "VIDEO";
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  mediaUrl?: string;
  durationSeconds: number;
  difficulty: "EASY" | "INTERMEDIATE" | "ADVANCED";
  category: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt?: string;
  createdAt: string;
  isSaved?: boolean;
  progressPercentage?: number;
}

export interface ArticleDetail {
  englishBody: string;
  vietnameseBody: string;
}

export interface TranscriptSegment {
  id: number;
  startMs: number;
  endMs: number;
  englishText: string;
  vietnameseText: string;
  position: number;
}

export interface ContentDetail extends ContentSummary {
  article?: ArticleDetail;
  transcriptSegments?: TranscriptSegment[];
  lastPositionSeconds?: number;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export const contentApi = {
  getFeed: async (params?: {
    type?: string;
    difficulty?: string;
    category?: string;
    keyword?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
  }) => {
    const res = await apiClient.get<{
      success: boolean;
      data: PageResult<ContentSummary>;
    }>("/v1/feed", { params });
    return res.data.data;
  },

  getContentBySlug: async (slug: string) => {
    const res = await apiClient.get<{
      success: boolean;
      data: ContentDetail;
    }>(`/v1/contents/${slug}`);
    return res.data.data;
  },
};
