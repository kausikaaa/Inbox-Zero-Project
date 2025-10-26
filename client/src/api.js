// src/api.js
import axios from "axios";

const API_URL = "http://localhost:5000"; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post("/api/auth/signup", userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem("token");
  }
};

// Email API functions
export const emailAPI = {
  getEmails: async () => {
    const response = await api.get("/api/emails");
    return response.data;
  },
  
  markAsRead: async (emailId) => {
    const response = await api.put(`/api/emails/${emailId}/read`);
    return response.data;
  },
  
  archiveEmail: async (emailId) => {
    const response = await api.put(`/api/emails/${emailId}/archive`);
    return response.data;
  }
};

export default api;
