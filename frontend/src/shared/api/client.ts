import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const API_BASE_URL = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, "")}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("flowling_jwt_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Failed to read token from localStorage", err);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Clear token if expired
      // localStorage.removeItem("flowling_jwt_token");
    }
    return Promise.reject(error);
  }
);
