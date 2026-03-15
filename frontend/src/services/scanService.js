/**
 * scanService.js – URL scanning and history API calls.
 */
import api from './api';

/**
 * Submit a URL for threat analysis.
 * @param {string} url – the URL to analyze
 * @returns {Promise<ScanResponse>}
 */
export const scanUrl = async (url) => {
  const response = await api.post('/api/scan/url', { url });
  return response.data;
};

/**
 * Get the authenticated user's full scan history.
 * @returns {Promise<ScanResponse[]>}
 */
export const getScanHistory = async () => {
  const response = await api.get('/api/scan/history');
  return response.data;
};

/**
 * Get dashboard stats (total scans, phishing, safe, suspicious).
 * @returns {Promise<DashboardStats>}
 */
export const getDashboardStats = async () => {
  const response = await api.get('/api/scan/stats');
  return response.data;
};
