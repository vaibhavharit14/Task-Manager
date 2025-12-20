import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_URL = `${API_BASE}/api`;

console.log("Current API URL:", API_URL);

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