// utils/helpers.js
// ─────────────────────────────────────────────────────
// Shared utility functions used across the frontend.
// ─────────────────────────────────────────────────────

/**
 * Format a date string into a human-readable format.
 * @param {string} dateString - ISO date string from the API
 * @returns {string} e.g. "Mar 15, 2024 · 14:32"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }) + ' · ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
};

/**
 * Truncate a URL for display in compact contexts.
 * @param {string} url
 * @param {number} maxLen
 * @returns {string}
 */
export const truncateUrl = (url, maxLen = 60) => {
  if (!url) return '';
  return url.length > maxLen ? url.slice(0, maxLen) + '…' : url;
};

/**
 * Returns CSS class name and label for a given threat level.
 * @param {string} level - "SAFE" | "SUSPICIOUS" | "PHISHING"
 */
export const getThreatMeta = (level) => {
  switch (level) {
    case 'SAFE':       return { cls: 'safe',       label: 'Safe',       emoji: '✅' };
    case 'SUSPICIOUS': return { cls: 'suspicious', label: 'Suspicious', emoji: '⚠️' };
    case 'PHISHING':   return { cls: 'phishing',   label: 'Phishing',   emoji: '🚨' };
    default:           return { cls: 'safe',       label: 'Unknown',    emoji: '❓' };
  }
};

/**
 * Returns a colour for a numeric threat score (0–100).
 * @param {number} score
 * @returns {string} CSS color
 */
export const scoreColor = (score) => {
  if (score <= 30) return '#00e676';
  if (score <= 65) return '#ffab00';
  return '#ff3d57';
};

/**
 * Extract a readable domain from a full URL.
 * @param {string} url
 */
export const getDomain = (url) => {
  try {
    return new URL(url.startsWith('http') ? url : 'http://' + url).hostname;
  } catch {
    return url;
  }
};
