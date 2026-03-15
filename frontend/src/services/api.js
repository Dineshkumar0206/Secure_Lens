/**
 * api.js – Axios instance pre-configured for the SecureLens backend.
 *
 * The backend runs on port 8090.
 * The frontend may run on 3000 OR 3001 — this file always targets the backend directly
 * so the CRA proxy setting doesn't matter.
 */

import axios from "axios";
import { getToken, clearAuth } from "../utils/auth";

// Always target backend directly
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8090";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true, // required for CORS with credentials
});

// ── Request Interceptor: inject JWT token ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ── Response Interceptor: handle 401 Unauthorized ─────────────────
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
