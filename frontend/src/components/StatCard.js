/**
 * StatCard.js – Dashboard metric card.
 */
import React from 'react';

export default function StatCard({ label, value, icon, accent = '#00d4ff', sublabel }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Accent line top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '2px', background: accent, opacity: 0.6,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontSize: '0.75rem',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {label}
        </span>
        <span style={{ fontSize: '1.25rem', opacity: 0.6 }}>{icon}</span>
      </div>

      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800,
        fontSize: '2.25rem',
        color: accent,
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        {value ?? '—'}
      </div>

      {sublabel && (
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: "'Inter', sans-serif",
        }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}



