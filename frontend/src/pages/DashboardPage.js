/**
 * DashboardPage.js – Overview with scan statistics and recent activity.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import ThreatBadge from '../components/ThreatBadge';
import Loader from '../components/Loader';
import { getDashboardStats, getScanHistory } from '../services/scanService';
import { getUser } from '../utils/auth';

export default function DashboardPage() {
  const [stats, setStats]     = useState(null);
  const [recent, setRecent]   = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    async function load() {
      try {
        const [s, h] = await Promise.all([getDashboardStats(), getScanHistory()]);
        setStats(s);
        setRecent(h.slice(0, 5)); // Show last 5
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>

        {/* Page header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.pageSub}>
              Welcome back, <span style={{ color: 'var(--accent-cyan)' }}>{user?.username}</span>
            </p>
          </div>
          <Link to="/scanner" style={styles.scanBtn}>+ New Scan</Link>
        </div>

        {loading ? <Loader message="Loading dashboard..." /> : (
          <>
            {/* Stats grid */}
            <div style={styles.statsGrid}>
              <StatCard label="Total Scans"      value={stats?.totalScans}      icon="🔍" accent="var(--accent-cyan)"  sublabel="All time" />
              <StatCard label="Safe Links"        value={stats?.safeLinks}        icon="✓"  accent="var(--safe-color)"  sublabel="No threats found" />
              <StatCard label="Suspicious"        value={stats?.suspiciousLinks}  icon="⚠"  accent="var(--suspicious-color)"  sublabel="Needs caution" />
              <StatCard label="Phishing Detected" value={stats?.phishingDetected} icon="🎣" accent="var(--phishing-color)"  sublabel="Blocked threats" />
            </div>

            {/* Recent scans */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Recent Scans</h2>
                <Link to="/history" style={styles.viewAll}>View all →</Link>
              </div>

              {recent.length === 0 ? (
                <div style={styles.empty}>
                  <span style={{ fontSize: '2rem' }}>🔍</span>
                  <p>No scans yet. <Link to="/scanner" style={{ color: 'var(--accent-cyan)' }}>Scan your first URL</Link></p>
                </div>
              ) : (
                <div style={styles.recentList}>
                  {recent.map((scan) => (
                    <div key={scan.id} style={styles.recentRow}>
                      <div style={styles.recentLeft}>
                        <ThreatBadge level={scan.threatLevel} />
                        <span style={styles.recentUrl}>{scan.url}</span>
                      </div>
                      <div style={styles.recentRight}>
                        <span style={styles.recentScore}>
                          {scan.threatScore}<span style={{ color: '#4a5568', fontSize: '0.7rem' }}>/100</span>
                        </span>
                        <span style={styles.recentDate}>
                          {new Date(scan.scannedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div style={styles.quickActions}>
              <Link to="/scanner" style={styles.actionCard}>
                <span style={{ fontSize: '1.5rem' }}>⚡</span>
                <span style={styles.actionLabel}>Scan a URL</span>
                <span style={styles.actionSub}>Analyze any link for threats</span>
              </Link>
              <Link to="/history" style={styles.actionCard}>
                <span style={{ fontSize: '1.5rem' }}>🗂</span>
                <span style={styles.actionLabel}>View History</span>
                <span style={styles.actionSub}>All your past scans</span>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' },
  pageSub: { color: 'var(--text-secondary)', fontFamily: "'Inter',sans-serif", fontSize: '0.9rem', marginTop: '0.25rem' },
  scanBtn: {
    padding: '0.6rem 1.5rem',
    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
    color: '#040c18',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 700,
    fontFamily: "'Space Grotesk',sans-serif",
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    boxShadow: '0 10px 25px rgba(0,212,255,0.3)',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  section: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' },
  viewAll: { color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '2rem', color: 'var(--text-secondary)', fontFamily: "'Inter',sans-serif", fontSize: '0.9rem' },
  recentList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  recentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.85rem 1rem',
    background: 'var(--bg-secondary)',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    flexWrap: 'wrap',
  },
  recentLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 },
  recentUrl: { fontFamily: "'Space Mono',monospace", fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  recentRight: { display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 },
  recentScore: { fontFamily: "'Space Mono',monospace", fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 },
  recentDate: { fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Inter',sans-serif" },
  quickActions: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  actionCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textDecoration: 'none',
    transition: 'border-color 0.2s',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)',
  },
  actionLabel: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' },
  actionSub: { fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: "'Inter',sans-serif" },
};





