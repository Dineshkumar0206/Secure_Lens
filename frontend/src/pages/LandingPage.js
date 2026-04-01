/**
 * LandingPage.js – Public hero page for SecureLens.
 * Shows branding, feature highlights, and CTA buttons.
 */
import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🔒', title: 'HTTPS Validation', desc: 'Verify encryption on every link before you click.' },
  { icon: '🎣', title: 'Phishing Detection', desc: 'Multi-layer heuristics catch sophisticated phishing attacks.' },
  { icon: '⚡', title: 'Instant Analysis', desc: 'Real-time results in under a second.' },
  { icon: '📊', title: 'Threat Scoring', desc: 'Precise 0–100 risk score with detailed flag breakdown.' },
  { icon: '🗂', title: 'Scan History', desc: 'Full audit trail of every URL you have analyzed.' },
  { icon: '🛡', title: 'Domain Mismatch', desc: 'Detect spoofed brand subdomains and redirect tricks.' },
];

export default function LandingPage() {
  return (
    <div style={styles.page}>
      {/* Background grid */}
      <div style={styles.grid} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>Secure<span style={styles.accent}>Lens</span></span>
        </div>
        <div style={styles.headerRight}>
          <Link to="/login"    style={styles.headerLink}>Sign in</Link>
          <Link to="/register" style={styles.cta}>Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <main style={styles.hero}>
        <div style={styles.heroTag}>
          <span style={styles.heroDot} />
          THREAT INTELLIGENCE PLATFORM
        </div>
        <h1 style={styles.heroTitle}>
          Detect Phishing.<br />
          <span style={styles.accent}>Stay Secure.</span>
        </h1>
        <p style={styles.heroSub}>
          SecureLens analyzes any URL in real-time using advanced heuristics—
          HTTPS checks, keyword detection, IP analysis, domain spoofing, and more.
        </p>
        <div style={styles.heroCtas}>
          <Link to="/register" style={styles.primaryBtn}>Start Scanning Free →</Link>
          <Link to="/login"    style={styles.ghostBtn}>Sign In</Link>
        </div>

        {/* Fake URL bar demo */}
        <div style={styles.demoBar}>
          <span style={styles.demoProtocol}>HTTP</span>
          <span style={styles.demoUrl}>paypal-secure-login.verify-account.tk/update?ref=8829</span>
          <span style={styles.demoBadge}>⚠ PHISHING</span>
        </div>
      </main>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Detection Engine</h2>
        <p style={styles.sectionSub}>Seven independent checks run in parallel on every URL</p>
        <div style={styles.featureGrid}>
          {features.map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section style={styles.ctaStrip}>
        <span style={styles.ctaStripText}>Ready to protect yourself?</span>
        <Link to="/register" style={styles.primaryBtn}>Create Free Account</Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span>© 2024 SecureLens · Intelligent Threat Analysis</span>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#080c18', color: '#e8edf5', position: 'relative', overflow: 'hidden' },
  grid: {
    position: 'fixed', inset: 0, zIndex: 0,
    backgroundImage: `linear-gradient(#1e2d4508 1px, transparent 1px), linear-gradient(90deg, #1e2d4508 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  header: {
    position: 'relative', zIndex: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.25rem 3rem',
    borderBottom: '1px solid #1e2d45',
    background: 'rgba(8,12,24,0.8)',
    backdropFilter: 'blur(12px)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoIcon: { fontSize: '1.6rem', color: '#00d4ff' },
  logoText: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#e8edf5', letterSpacing: '-0.02em' },
  accent: { color: '#00d4ff' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  headerLink: { color: '#8899aa', textDecoration: 'none', fontSize: '0.9rem', fontFamily: "'Inter',sans-serif" },
  cta: {
    padding: '0.5rem 1.25rem', borderRadius: '8px',
    background: '#00d4ff', color: '#000',
    textDecoration: 'none', fontWeight: 700,
    fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem',
    letterSpacing: '0.02em',
  },
  hero: {
    position: 'relative', zIndex: 1,
    maxWidth: '760px', margin: '0 auto',
    padding: '7rem 2rem 5rem',
    textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
  },
  heroTag: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.35rem 0.9rem', borderRadius: '99px',
    border: '1px solid #1e2d45',
    fontFamily: "'Space Mono',monospace", fontSize: '0.7rem',
    color: '#00d4ff', letterSpacing: '0.1em',
  },
  heroDot: { width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 8px #00d4ff' },
  heroTitle: {
    fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800,
    fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.05,
    letterSpacing: '-0.03em', color: '#e8edf5',
  },
  heroSub: { fontSize: '1.05rem', color: '#8899aa', maxWidth: '540px', lineHeight: 1.7, fontFamily: "'Inter',sans-serif" },
  heroCtas: { display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' },
  primaryBtn: {
    padding: '0.75rem 2rem', borderRadius: '10px',
    background: '#00d4ff', color: '#000',
    textDecoration: 'none', fontWeight: 700,
    fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.95rem',
    boxShadow: '0 0 24px rgba(0,212,255,0.3)',
    display: 'inline-block',
  },
  ghostBtn: {
    padding: '0.75rem 2rem', borderRadius: '10px',
    border: '1px solid #2a3f5f', color: '#8899aa',
    textDecoration: 'none', fontFamily: "'Inter',sans-serif",
    fontSize: '0.9rem', display: 'inline-block',
  },
  demoBar: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    background: '#111827', border: '1px solid #1e2d45',
    borderRadius: '10px', padding: '0.85rem 1.25rem',
    maxWidth: '600px', width: '100%',
    fontFamily: "'Space Mono',monospace", fontSize: '0.78rem',
    marginTop: '1rem',
  },
  demoProtocol: { color: '#ff3d5a', fontWeight: 700, letterSpacing: '0.05em', flexShrink: 0 },
  demoUrl: { color: '#4a5568', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  demoBadge: { color: '#ff3d5a', fontWeight: 700, flexShrink: 0 },
  features: { position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem' },
  sectionTitle: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' },
  sectionSub: { color: '#8899aa', textAlign: 'center', marginBottom: '3rem', fontFamily: "'Inter',sans-serif" },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' },
  featureCard: {
    background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px',
    padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
  },
  featureIcon: { fontSize: '1.75rem' },
  featureTitle: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#e8edf5' },
  featureDesc: { color: '#8899aa', fontSize: '0.875rem', lineHeight: 1.6, fontFamily: "'Inter',sans-serif" },
  ctaStrip: {
    position: 'relative', zIndex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem',
    padding: '4rem 2rem', borderTop: '1px solid #1e2d45', borderBottom: '1px solid #1e2d45',
    background: 'rgba(0,212,255,0.03)',
  },
  ctaStripText: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#e8edf5' },
  footer: { position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem', color: '#4a5568', fontSize: '0.8rem', fontFamily: "'Inter',sans-serif" },
};





