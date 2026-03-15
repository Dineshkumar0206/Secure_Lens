/**
 * LoginPage.js – User login form with JWT auth.
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm]     = useState({ identifier: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const isFormValid = Boolean(form.identifier.trim() && form.password.trim());

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.identifier, form.password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.grid} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>Secure<span style={styles.accent}>Lens</span></span>
        </div>

        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.sub}>Access your threat analysis dashboard</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
          <div style={styles.field}>
            <label style={styles.label}>Username or email</label>
            <input
              name="identifier"
              autoComplete="username"
              value={form.identifier}
              onChange={handleChange}
              placeholder="your_username or email"
              required
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading || !isFormValid} style={styles.btn}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ ...styles.footer, fontSize: '0.75rem' }}>
          <Link to="/forgot-password" style={{ color: '#00d4ff' }}>
            Forgot password?
          </Link>
        </p>

        <p style={styles.footer}>
          No account?{' '}
          <Link to="/register" style={{ color: '#00d4ff' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#080c18',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem', position: 'relative',
  },
  grid: {
    position: 'fixed', inset: 0,
    backgroundImage: `linear-gradient(#1e2d4508 1px, transparent 1px), linear-gradient(90deg, #1e2d4508 1px, transparent 1px)`,
    backgroundSize: '60px 60px', poInterEvents: 'none',
  },
  card: {
    position: 'relative', zIndex: 1,
    background: '#111827', border: '1px solid #1e2d45',
    borderRadius: '16px', padding: '2.5rem',
    width: '100%', maxWidth: '420px',
    display: 'flex', flexDirection: 'column', gap: '1rem',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' },
  logoIcon: { fontSize: '1.5rem', color: '#00d4ff' },
  logoText: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#e8edf5' },
  accent: { color: '#00d4ff' },
  title: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.6rem', color: '#e8edf5', letterSpacing: '-0.02em' },
  sub: { color: '#8899aa', fontSize: '0.875rem', fontFamily: "'Inter',sans-serif", marginBottom: '0.5rem' },
  errorBox: {
    background: 'rgba(255,61,90,0.08)', border: '1px solid rgba(255,61,90,0.25)',
    borderRadius: '8px', padding: '0.75rem 1rem',
    color: '#ff3d5a', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif",
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.78rem', color: '#8899aa', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" },
  input: {
    background: '#0d1220', border: '1px solid #1e2d45', borderRadius: '8px',
    padding: '0.75rem 1rem', color: '#e8edf5',
    fontSize: '0.9rem', fontFamily: "'Space Mono',monospace",
    outline: 'none', transition: 'border-color 0.2s',
  },
  btn: {
    marginTop: '0.5rem', padding: '0.85rem',
    background: '#00d4ff', color: '#000',
    border: 'none', borderRadius: '10px',
    fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700,
    fontSize: '0.95rem', cursor: 'poInter',
    boxShadow: '0 0 20px rgba(0,212,255,0.25)',
    transition: 'opacity 0.2s',
  },
  footer: { textAlign: 'center', color: '#8899aa', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" },
};





