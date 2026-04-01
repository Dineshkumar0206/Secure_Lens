/**
 * authService.js – Auth API calls (register, login, logout).
 */
import api from "./api";
import { setToken, setUser, clearAuth, getToken, getUser } from "../utils/auth";

/**
 * Register a new user.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 */
export const register = async (username, email, password) => {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

/**
 * Login with username and password.
 * Stores JWT token and user info in localStorage on success.
 * @param {string} username
 * @param {string} password
 */
export const login = async (identifier, password) => {
  const response = await api.post("/api/auth/login", { identifier, password });
  const { token, ...user } = response.data;
  setToken(token);
  setUser(user);
  return response.data;
};

/**
 * Login via Google OAuth ID token.
 */
export const loginWithGoogle = async (token) => {
  const response = await api.post("/api/auth/google", { token });
  const { token: jwt, ...user } = response.data;
  setToken(jwt);
  setUser(user);
  return response.data;
};

/**
 * Request a password reset link for the supplied email.
 */
export const requestPasswordReset = async (email) => {
  const response = await api.post("/api/auth/forgot-password", { email });
  return response.data;
};

/**
 * Reset a password using a token.
 */
export const resetPassword = async (token, password) => {
  const response = await api.post("/api/auth/reset-password", { token, password });
  return response.data;
};

/**
 * Logout the current user.
 * Clears token and user from localStorage.
 */
export const logout = () => {
  clearAuth();
  window.location.href = "/login";
};

/**
 * Get the current user's profile from the backend.
 */
export const getProfile = async () => {
  const response = await api.get("/api/user/profile");
  return response.data;
};

export const getAccountSettings = async () => {
  const response = await api.get("/api/user/account-settings");
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await api.put("/api/user/profile", payload);

  const storedUser = getUser();
  if (storedUser) {
    setUser({ ...storedUser, username: response.data.username, email: response.data.email });
  }

  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post("/api/user/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const deleteAccount = async (password) => {
  const response = await api.post("/api/user/account/delete", { password });
  return response.data;
};

/**
 * Check if user is authenticated (has valid token).
 */
export const isAuthenticated = () => {
  return Boolean(getToken());
};
