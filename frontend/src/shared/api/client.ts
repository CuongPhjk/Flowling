import axios from "axios";

const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const defaultBaseUrl = isLocalhost
  ? "http://localhost:8080/api"
  : "https://flowling.onrender.com/api";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;

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
