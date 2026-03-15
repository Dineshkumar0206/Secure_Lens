/**
 * HistoryPage.js – Full scan history with filtering and sorting.
 */
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ThreatBadge from '../components/ThreatBadge';
import Loader from '../components/Loader';
import { getScanHistory } from '../services/scanService';

const FILTERS = ['ALL', 'SAFE', 'SUSPICIOUS', 'PHISHING'];

export default function HistoryPage() {
  const [scans, setScans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('ALL');
  const [search, setSearch]   = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getScanHistory()
      .then(setScans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = scans.filter((s) => {
    const matchFilter = filter === 'ALL' || s.threatLevel === filter;
    const matchSearch = s.url.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>

        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Scan History</h1>
            <p style={styles.pageSub}>{scans.length} total scans recorded</p>
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search URLs…"
            style={styles.searchInput}
          />
          <div style={styles.filterRow}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...styles.filterBtn,
                  ...(filter === f ? styles.filterBtnActive : {}),
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Loader message="Loading history…" /> : (
          filtered.length === 0 ? (
            <div style={styles.empty}>
              <span style={{ fontSize: '2.5rem' }}>🗂</span>
              <p>No scans match your filter.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {filtered.map((scan) => (
                <div key={scan.id} style={styles.scanCard}>
                  {/* Summary row */}
                  <div
                    style={styles.scanRow}
                    onClick={() => setExpanded(expanded === scan.id ? null : scan.id)}
                  >
                    <ThreatBadge level={scan.threatLevel} />

                    <span style={styles.scanUrl}>{scan.url}</span>

                    <div style={styles.scanMeta}>
                      <span style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: '0.82rem',
                        color:
                          scan.threatScore <= 30 ? '#00ff88' :
                          scan.threatScore <= 65 ? '#ff8c42' : '#ff3d5a',
                        fontWeight: 700,
                      }}>
                        {scan.threatScore}<span style={{ color: '#4a5568', fontSize: '0.7rem' }}>/100</span>
                      </span>
                      <span style={styles.scanDate}>
                        {new Date(scan.scannedAt).toLocaleString()}
                      </span>
                      <span style={{ color: '#4a5568', fontSize: '0.75rem' }}>
                        {expanded === scan.id ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expanded === scan.id && (
                    <div style={styles.scanDetail}>
                      <div style={styles.detailLabel}>Detection Flags</div>
                      {Array.isArray(scan.flags) && scan.flags.map((flag, i) => (
                        <div key={i} style={{
                          ...styles.flagItem,
                          borderLeftColor:
                            flag.includes('🔴') ? '#ff3d5a' :
                            flag.includes('✅') ? '#00ff88' : '#ff8c42',
                        }}>
                          {flag}
                        </div>
                      ))}
                      <div style={styles.detailFooter}>
                        <span>Scan #{scan.id}</span>
                        <span>Risk: {scan.riskPercentage}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#080c18', color: '#e8edf5' },
  main: { maxWidth: '980px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  pageTitle: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.75rem', color: '#e8edf5', letterSpacing: '-0.02em' },
  pageSub: { color: '#8899aa', fontFamily: "'Inter',sans-serif", fontSize: '0.875rem', marginTop: '0.25rem' },

  controls: { display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' },
  searchInput: {
    flex: 1, minWidth: '200px',
    background: '#111827', border: '1px solid #1e2d45', borderRadius: '8px',
    padding: '0.65rem 1rem', color: '#e8edf5',
    fontFamily: "'Space Mono',monospace", fontSize: '0.82rem', outline: 'none',
  },
  filterRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  filterBtn: {
    padding: '0.45rem 1rem', borderRadius: '6px',
    border: '1px solid #1e2d45', background: 'transparent',
    color: '#8899aa', fontSize: '0.78rem', cursor: 'poInter',
    fontFamily: "'Space Mono',monospace", letterSpacing: '0.06em',
    transition: 'all 0.2s',
  },
  filterBtnActive: {
    background: 'rgba(0,212,255,0.1)', borderColor: 'rgba(0,212,255,0.3)', color: '#00d4ff',
  },

  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '4rem', color: '#8899aa', fontFamily: "'Inter',sans-serif" },

  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  scanCard: { background: '#111827', border: '1px solid #1e2d45', borderRadius: '10px', overflow: 'hidden' },
  scanRow: {
    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
    cursor: 'poInter', transition: 'background 0.15s',
    flexWrap: 'wrap',
  },
  scanUrl: { flex: 1, fontFamily: "'Space Mono',monospace", fontSize: '0.78rem', color: '#8899aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 },
  scanMeta: { display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 },
  scanDate: { fontSize: '0.75rem', color: '#4a5568', fontFamily: "'Inter',sans-serif" },

  scanDetail: { borderTop: '1px solid #1e2d45', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#0d1220' },
  detailLabel: { fontSize: '0.72rem', color: '#4a5568', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.25rem' },
  flagItem: { borderLeft: '3px solid', padding: '0.45rem 0.9rem', background: 'rgba(0,0,0,0.15)', borderRadius: '0 4px 4px 0', fontSize: '0.8rem', color: '#8899aa', fontFamily: "'Inter',sans-serif" },
  detailFooter: { display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.72rem', color: '#4a5568', fontFamily: "'Space Mono',monospace", paddingTop: '0.5rem', borderTop: '1px solid #1e2d45' },
};





