/**
 * auth.js – Helpers for JWT token management in localStorage.
 */

const TOKEN_KEY = 'securelens_token';
const USER_KEY  = 'securelens_user';

/** Persist JWT token */
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

/** Retrieve JWT token */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/** Remove JWT token (logout) */
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

/** Persist user object */
export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));

/** Retrieve user object */
export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

/** Clear all auth data */
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/** Check if user is authenticated */
export const isAuthenticated = () => !!getToken();
