/**
 * RegisterPage.js – New user registration form.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data || {}).join(' · ')
        || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text',     placeholder: 'john_doe' },
    { name: 'email',    label: 'Email',    type: 'email',    placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { name: 'confirm',  label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.grid} />
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>Secure<span style={styles.accent}>Lens</span></span>
        </div>

        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.sub}>Start detecting phishing threats today</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                style={styles.input}
              />
            </div>
          ))}

          {/* Password strength hint */}
          {form.password && (
            <div style={styles.strengthRow}>
              {['Weak','Fair','Good','Strong'].map((lvl, i) => {
                const active = form.password.length > i * 3;
                const colors = ['#ff3d5a','#ff8c42','#ffcc00','#00ff88'];
                return (
                  <div key={i} style={{
                    height: 3, flex: 1, borderRadius: 2,
                    background: active ? colors[i] : '#1e2d45',
                    transition: 'background 0.3s',
                  }} />
                );
              })}
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00d4ff' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#080c18', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' },
  grid: { position: 'fixed', inset: 0, backgroundImage: `linear-gradient(#1e2d4508 1px, transparent 1px), linear-gradient(90deg, #1e2d4508 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' },
  card: { position: 'relative', zIndex: 1, background: '#111827', border: '1px solid #1e2d45', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' },
  logoIcon: { fontSize: '1.5rem', color: '#00d4ff' },
  logoText: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#e8edf5' },
  accent: { color: '#00d4ff' },
  title: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.6rem', color: '#e8edf5', letterSpacing: '-0.02em' },
  sub: { color: '#8899aa', fontSize: '0.875rem', fontFamily: "'Inter',sans-serif", marginBottom: '0.5rem' },
  errorBox: { background: 'rgba(255,61,90,0.08)', border: '1px solid rgba(255,61,90,0.25)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ff3d5a', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.78rem', color: '#8899aa', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" },
  input: { background: '#0d1220', border: '1px solid #1e2d45', borderRadius: '8px', padding: '0.75rem 1rem', color: '#e8edf5', fontSize: '0.9rem', fontFamily: "'Space Mono',monospace", outline: 'none' },
  strengthRow: { display: 'flex', gap: '4px', marginTop: '-0.25rem' },
  btn: { marginTop: '0.5rem', padding: '0.85rem', background: '#00d4ff', color: '#000', border: 'none', borderRadius: '10px', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,212,255,0.25)' },
  footer: { textAlign: 'center', color: '#8899aa', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" },
};





