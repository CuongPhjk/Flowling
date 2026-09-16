import { apiClient } from "./client";
import {
  ContentDetail,
  ContentSummary,
  PageResult,
  TranscriptSegment,
} from "./contentApi";

export interface AdminStats {
  totalContents: number;
  draftCount: number;
  publishedCount: number;
  articlesCount: number;
  podcastsCount: number;
  videosCount: number;
}

export interface CreateContentPayload {
  type: "ARTICLE" | "PODCAST" | "VIDEO";
  title: string;
  slug?: string;
  description: string;
  thumbnailUrl: string;
  mediaUrl?: string;
  durationSeconds?: number;
  difficulty?: "EASY" | "INTERMEDIATE" | "ADVANCED";
  category?: string;
  status?: "DRAFT" | "PUBLISHED";
  englishBody?: string;
  vietnameseBody?: string;
  transcriptSegments?: Partial<TranscriptSegment>[];
}

export const adminApi = {
  getStats: async () => {
    const res = await apiClient.get<{
      success: boolean;
      data: AdminStats;
    }>("/v1/admin/stats");
    return res.data.data;
  },

  listContents: async (params?: {
    status?: string;
    type?: string;
    keyword?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
  }) => {
    const res = await apiClient.get<{
      success: boolean;
      data: PageResult<ContentSummary>;
    }>("/v1/admin/contents", { params });
    return res.data.data;
  },

  createContent: async (payload: CreateContentPayload) => {
    const res = await apiClient.post<{
      success: boolean;
      data: ContentDetail;
    }>("/v1/admin/contents", payload);
    return res.data.data;
  },

  updateContent: async (id: number, payload: Partial<CreateContentPayload>) => {
    const res = await apiClient.put<{
      success: boolean;
      data: ContentDetail;
    }>(`/v1/admin/contents/${id}`, payload);
    return res.data.data;
  },

  togglePublish: async (id: number) => {
    const res = await apiClient.put<{
      success: boolean;
      data: ContentSummary;
    }>(`/v1/admin/contents/${id}/publish`);
    return res.data.data;
  },

  updateTranscripts: async (
    id: number,
    segments: Partial<TranscriptSegment>[]
  ) => {
    const res = await apiClient.put<{
      success: boolean;
      data: TranscriptSegment[];
    }>(`/v1/admin/contents/${id}/transcripts`, segments);
    return res.data.data;
  },

  deleteContent: async (id: number) => {
    const res = await apiClient.delete<{ success: boolean }>(
      `/v1/admin/contents/${id}`
    );
    return res.data.success;
  },
};
