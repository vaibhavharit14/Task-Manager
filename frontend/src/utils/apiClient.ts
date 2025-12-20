import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE && import.meta.env.PROD) {
  console.error("❌ CRITICAL ERROR: VITE_API_URL is not defined! Your Vercel build is defaulting to localhost. Please set VITE_API_URL in Vercel settings and REDEPLOY.");
}

export const API_URL = `${API_BASE || "http://localhost:5000"}/api`;

console.log("🚀 Active Backend URL:", API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;