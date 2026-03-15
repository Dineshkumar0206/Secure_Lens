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
              Welcome back, <span style={{ color: '#00d4ff' }}>{user?.username}</span>
            </p>
          </div>
          <Link to="/scanner" style={styles.scanBtn}>+ New Scan</Link>
        </div>

        {loading ? <Loader message="Loading dashboard..." /> : (
          <>
            {/* Stats grid */}
            <div style={styles.statsGrid}>
              <StatCard label="Total Scans"      value={stats?.totalScans}      icon="🔍" accent="#00d4ff"  sublabel="All time" />
              <StatCard label="Safe Links"        value={stats?.safeLinks}        icon="✓"  accent="#00ff88"  sublabel="No threats found" />
              <StatCard label="Suspicious"        value={stats?.suspiciousLinks}  icon="⚠"  accent="#ff8c42"  sublabel="Needs caution" />
              <StatCard label="Phishing Detected" value={stats?.phishingDetected} icon="🎣" accent="#ff3d5a"  sublabel="Blocked threats" />
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
                  <p>No scans yet. <Link to="/scanner" style={{ color: '#00d4ff' }}>Scan your first URL</Link></p>
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
  page: { minHeight: '100vh', background: '#080c18', color: '#e8edf5' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.75rem', color: '#e8edf5', letterSpacing: '-0.02em' },
  pageSub: { color: '#8899aa', fontFamily: "'Inter',sans-serif", fontSize: '0.9rem', marginTop: '0.25rem' },
  scanBtn: { padding: '0.6rem 1.5rem', background: '#00d4ff', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', whiteSpace: 'nowrap' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  section: { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#e8edf5' },
  viewAll: { color: '#00d4ff', textDecoration: 'none', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif" },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '2rem', color: '#8899aa', fontFamily: "'Inter',sans-serif", fontSize: '0.9rem' },
  recentList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  recentRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', background: '#0d1220', borderRadius: '8px', border: '1px solid #1e2d45', flexWrap: 'wrap' },
  recentLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 },
  recentUrl: { fontFamily: "'Space Mono',monospace", fontSize: '0.78rem', color: '#8899aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  recentRight: { display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 },
  recentScore: { fontFamily: "'Space Mono',monospace", fontSize: '0.85rem', color: '#e8edf5', fontWeight: 700 },
  recentDate: { fontSize: '0.75rem', color: '#4a5568', fontFamily: "'Inter',sans-serif" },
  quickActions: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  actionCard: { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textDecoration: 'none', transition: 'border-color 0.2s' },
  actionLabel: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#e8edf5' },
  actionSub: { fontSize: '0.8rem', color: '#8899aa', fontFamily: "'Inter',sans-serif" },
};





