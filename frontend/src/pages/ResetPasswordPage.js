import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import PasswordField from '../components/PasswordField';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = password.length >= 8 && password === confirm && token.trim().length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) {
      setError('Passwords must match and be at least 8 characters.');
      return;
    }

    setError('');
    setStatus('');
    setLoading(true);
    try {
      const response = await resetPassword(token, password);
      setStatus(response?.message || 'Password reset successfully.');
      navigate('/login', { state: { message: 'Password updated. You can sign in now.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.grid} />

      <div style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>Secure<span style={styles.accent}>Lens</span></span>
        </div>

        <h1 style={styles.title}>Set a new password</h1>
        <p style={styles.sub}>
          Use the reset token you received in your email to choose a new password.
        </p>

        {status && <div style={styles.successBox}>{status}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
          <div style={styles.field}>
            <label style={styles.label}>Reset token</label>
            <input
              name="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="token from email"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>New password</label>
            <PasswordField
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm password</label>
            <PasswordField
              name="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading || !isFormValid} style={styles.btn}>
            {loading ? 'Updating password…' : 'Update password'}
          </button>
        </form>

        <p style={styles.footer}>
          Remembered it?{' '}
          <Link to="/login" style={{ color: '#00d4ff' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#080c18',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage:
      "linear-gradient(#1e2d4508 1px, transparent 1px), linear-gradient(90deg, #1e2d4508 1px, transparent 1px)",
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  logoIcon: { fontSize: '1.5rem', color: '#00d4ff' },
  logoText: {
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 800,
    fontSize: '1.2rem',
    color: '#e8edf5',
  },
  accent: { color: '#00d4ff' },
  title: {
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 800,
    fontSize: '1.6rem',
    color: '#e8edf5',
    letterSpacing: '-0.02em',
  },
  sub: {
    color: '#8899aa',
    fontSize: '0.9rem',
    fontFamily: "'Outfit',sans-serif",
    marginBottom: '0.5rem',
  },
  successBox: {
    background: 'rgba(0,212,255,0.08)',
    border: '1px solid rgba(0,212,255,0.25)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#00d4ff',
    fontSize: '0.85rem',
  },
  errorBox: {
    background: 'rgba(255,61,90,0.08)',
    border: '1px solid rgba(255,61,90,0.25)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#ff3d5a',
    fontSize: '0.85rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: {
    fontSize: '0.78rem',
    color: '#8899aa',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontFamily: "'Outfit',sans-serif",
  },
  input: {
    background: '#0d1220',
    border: '1px solid #1e2d45',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#e8edf5',
    fontSize: '0.9rem',
    fontFamily: "'JetBrains Mono',monospace",
    outline: 'none',
  },
  btn: {
    marginTop: '0.5rem',
    padding: '0.85rem',
    background: '#00d4ff',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(0,212,255,0.25)',
  },
  footer: {
    textAlign: 'center',
    color: '#8899aa',
    fontSize: '0.85rem',
    fontFamily: "'Outfit',sans-serif",
  },
};
