import { apiClient } from "./client";
import { ContentSummary, PageResult } from "./contentApi";

export interface ProgressItem {
  id: number;
  content: ContentSummary;
  progressPercentage: number;
  lastPositionSeconds: number;
  isCompleted: boolean;
  updatedAt: string;
}

export const progressApi = {
  updateProgress: async (
    contentId: number,
    payload: {
      progressPercentage: number;
      lastPositionSeconds: number;
      isCompleted?: boolean;
    }
  ) => {
    const res = await apiClient.post<{
      success: boolean;
      data: ProgressItem;
    }>(`/v1/progress/${contentId}`, payload);
    return res.data.data;
  },

  getContinue: async () => {
    const res = await apiClient.get<{
      success: boolean;
      data: ProgressItem | null;
    }>("/v1/progress/continue");
    return res.data.data;
  },

  getHistory: async (page = 0, size = 20) => {
    const res = await apiClient.get<{
      success: boolean;
      data: PageResult<ProgressItem>;
    }>("/v1/progress/history", { params: { page, size } });
    return res.data.data;
  },

  toggleSave: async (contentId: number) => {
    const res = await apiClient.post<{
      success: boolean;
      data: { isSaved: boolean };
    }>(`/v1/saved/${contentId}`);
    return res.data.data;
  },

  getSaved: async (page = 0, size = 20) => {
    const res = await apiClient.get<{
      success: boolean;
      data: PageResult<ContentSummary>;
    }>("/v1/saved", { params: { page, size } });
    return res.data.data;
  },
};
