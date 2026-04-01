/**
 * ScannerPage.js – URL input form + real-time threat analysis results display.
 */
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ThreatBadge from '../components/ThreatBadge';
import ThreatMeter from '../components/ThreatMeter';
import Loader from '../components/Loader';
import { scanUrl } from '../services/scanService';

export default function ScannerPage() {
  const [url, setUrl]         = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await scanUrl(url.trim());
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  const exampleUrls = [
    'https://www.google.com',
    'http://paypal-secure-login.verify-account.tk/update',
    'https://amazon.com.fake-store.xyz/login',
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>

        {/* Page header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>URL Scanner</h1>
          <p style={styles.pageSub}>Paste any URL below to analyze it for phishing and web threats</p>
        </div>

        {/* Scanner input */}
        <form onSubmit={handleScan} style={styles.scanForm}>
          <div style={styles.inputRow}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔍</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/path?query=value"
                style={styles.input}
                disabled={loading}
              />
              {url && (
                <button type="button" onClick={handleClear} style={styles.clearBtn}>✕</button>
              )}
            </div>
            <button type="submit" disabled={loading || !url.trim()} style={styles.analyzeBtn}>
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
          </div>

          {/* Quick example URLs */}
          <div style={styles.examples}>
            <span style={styles.examplesLabel}>Try:</span>
            {exampleUrls.map((u, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setUrl(u)}
                style={styles.exampleChip}
              >
                {u.length > 45 ? u.slice(0, 45) + '…' : u}
              </button>
            ))}
          </div>
        </form>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div style={styles.loadingCard}>
            <Loader message="Running threat analysis…" />
            <div style={styles.loadingSteps}>
              {['HTTPS check', 'Keyword scan', 'Domain analysis', 'IP detection', 'Scoring'].map((step, i) => (
                <div key={i} style={styles.loadingStep}>
                  <span style={{ ...styles.stepDot, animationDelay: `${i * 0.2}s` }} />
                  {step}
                </div>
              ))}
            </div>
            <style>{`
              @keyframes blink { 0%,100%{opacity:0.2} 50%{opacity:1} }
            `}</style>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div style={styles.resultCard}>

            {/* Result header */}
            <div style={styles.resultHeader}>
              <div style={styles.resultHeaderLeft}>
                <ThreatBadge level={result.threatLevel} size="lg" />
                <div style={styles.resultUrlBlock}>
                  <span style={styles.resultUrlLabel}>ANALYZED URL</span>
                  <span style={styles.resultUrl}>{result.url}</span>
                </div>
              </div>
              <ThreatMeter score={result.threatScore} />
            </div>

            {/* Security checks grid */}
            <div style={styles.checksGrid}>
              {[
                { label: 'HTTPS Secure',         ok: result.hasHttps,              icon: '🔒' },
                { label: 'No Suspicious Keywords',ok: !result.hasSuspiciousKeywords,icon: '🔤' },
                { label: 'Domain-based URL',      ok: !result.isIpBased,            icon: '🌐' },
                { label: 'Normal URL Length',     ok: !result.isLongUrl,            icon: '📏' },
                { label: 'No Domain Mismatch',    ok: !result.hasDomainMismatch,    icon: '🏷' },
              ].map(({ label, ok, icon }) => (
                <div key={label} style={{
                  ...styles.checkItem,
                  borderColor: ok ? 'rgba(0,255,136,0.2)' : 'rgba(255,61,90,0.2)',
                  background:  ok ? 'rgba(0,255,136,0.04)' : 'rgba(255,61,90,0.04)',
                }}>
                  <span>{icon}</span>
                  <span style={styles.checkLabel}>{label}</span>
                  <span style={{ color: ok ? '#00ff88' : '#ff3d5a', fontWeight: 700, marginLeft: 'auto', fontSize: '0.8rem' }}>
                    {ok ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              ))}
            </div>

            {/* Flags / findings */}
            <div style={styles.flagsSection}>
              <h3 style={styles.flagsTitle}>Detection Flags</h3>
              <div style={styles.flagsList}>
                {result.flags?.map((flag, i) => (
                  <div key={i} style={{
                    ...styles.flagItem,
                    borderLeftColor:
                      flag.includes('🔴') ? '#ff3d5a' :
                      flag.includes('✅') ? '#00ff88' : '#ff8c42',
                  }}>
                    <span style={styles.flagText}>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scan ID + timestamp */}
            <div style={styles.resultMeta}>
              <span>Scan ID: <span style={styles.mono}>{result.id}</span></span>
              <span>Scanned: <span style={styles.mono}>
                {result.scannedAt ? new Date(result.scannedAt).toLocaleString() : new Date().toLocaleString()}
              </span></span>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' },
  main: { maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' },
  pageHeader: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  pageTitle: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' },
  pageSub: { color: 'var(--text-secondary)', fontFamily: "'Inter',sans-serif", fontSize: '0.9rem' },

  scanForm: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  inputRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  inputWrapper: {
    flex: 1, minWidth: '260px',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px',
    padding: '0 1rem',
  },
  inputIcon: { fontSize: '0.9rem', flexShrink: 0, color: 'var(--text-secondary)' },
  input: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: 'var(--text-primary)', fontFamily: "'Space Mono',monospace", fontSize: '0.85rem',
    padding: '0.85rem 0',
  },
  clearBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.25rem' },
  analyzeBtn: {
    padding: '0 2rem',
    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
    color: '#040c18',
    border: 'none',
    borderRadius: '10px',
    fontFamily: "'Space Grotesk',sans-serif",
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(0,212,255,0.25)',
    whiteSpace: 'nowrap',
    minHeight: '50px',
  },
  examples: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' },
  examplesLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Inter',sans-serif", marginRight: '0.25rem' },
  exampleChip: {
    padding: '0.3rem 0.75rem', borderRadius: '99px',
    border: '1px solid var(--border)', background: 'transparent',
    color: 'var(--text-secondary)', fontSize: '0.72rem', cursor: 'pointer',
    fontFamily: "'Space Mono',monospace",
  },

  errorBox: {
    background: 'rgba(255,61,90,0.08)',
    border: '1px solid rgba(255,61,90,0.25)',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
    color: 'var(--phishing-color)',
    fontSize: '0.875rem',
    fontFamily: "'Inter',sans-serif",
  },

  loadingCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  loadingSteps: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' },
  loadingStep: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: "'Space Mono',monospace" },
  stepDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block', animation: 'blink 1.4s ease-in-out infinite' },

  resultCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
    animation: 'fadeIn 0.4s ease',
  },
  resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' },
  resultHeaderLeft: { display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 },
  resultUrlBlock: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  resultUrlLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    fontFamily: "'Inter',sans-serif",
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  resultUrl: { fontFamily: "'Space Mono',monospace", fontSize: '0.82rem', color: 'var(--text-secondary)', wordBreak: 'break-all' },

  checksGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.82rem',
    fontFamily: "'Inter',sans-serif",
    color: 'var(--text-secondary)',
  },
  checkLabel: { flex: 1 },

  flagsSection: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  flagsTitle: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' },
  flagsList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  flagItem: { borderLeft: '3px solid', padding: '0.6rem 1rem', background: 'var(--bg-secondary)', borderRadius: '0 6px 6px 0' },
  flagText: { fontSize: '0.83rem', color: 'var(--text-secondary)', fontFamily: "'Inter',sans-serif" },

  resultMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border)',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontFamily: "'Inter',sans-serif",
  },
  mono: { fontFamily: "'Space Mono',monospace", color: 'var(--text-secondary)' },
};





