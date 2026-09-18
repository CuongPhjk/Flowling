import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface GoogleLoginPayload {
  credential: string;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  currentStreak: number;
  totalXp: number;
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  currentStreak: number;
  totalXp: number;
}

export interface UserProfileResponse extends AuthUser {
  learningWordsCount: number;
  masteredWordsCount: number;
  completedContentsCount: number;
  savedContentsCount: number;
  createdAt: string;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await apiClient.post<{ success: boolean; data: AuthResponse }>(
      "/v1/auth/login",
      payload
    );
    if (res.data.data.token) {
      localStorage.setItem("flowling_jwt_token", res.data.data.token);
    }
    return res.data.data;
  },

  register: async (payload: RegisterPayload) => {
    const res = await apiClient.post<{ success: boolean; data: AuthResponse }>(
      "/v1/auth/register",
      payload
    );
    if (res.data.data.token) {
      localStorage.setItem("flowling_jwt_token", res.data.data.token);
    }
    return res.data.data;
  },

  googleLogin: async (payload: GoogleLoginPayload) => {
    const res = await apiClient.post<{ success: boolean; data: AuthResponse }>(
      "/v1/auth/google",
      payload,
    );
    if (res.data.data.token) {
      localStorage.setItem("flowling_jwt_token", res.data.data.token);
    }
    return res.data.data;
  },

  getMe: async () => {
    const res = await apiClient.get<{
      success: boolean;
      data: UserProfileResponse;
    }>("/v1/auth/me");
    return res.data.data;
  },

  logout: () => {
    localStorage.removeItem("flowling_jwt_token");
  },
};
