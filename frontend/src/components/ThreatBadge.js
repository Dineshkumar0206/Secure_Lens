/**
 * ThreatBadge.js – Visual badge showing the threat level (SAFE / SUSPICIOUS / PHISHING).
 */
import React from 'react';

const config = {
  SAFE: {
    label: 'SAFE',
    icon: '✓',
    color: '#00ff88',
    bg: 'rgba(0,255,136,0.08)',
    border: 'rgba(0,255,136,0.25)',
    glow: '0 0 12px rgba(0,255,136,0.2)',
  },
  SUSPICIOUS: {
    label: 'SUSPICIOUS',
    icon: '!',
    color: '#ff8c42',
    bg: 'rgba(255,140,66,0.08)',
    border: 'rgba(255,140,66,0.25)',
    glow: '0 0 12px rgba(255,140,66,0.2)',
  },
  PHISHING: {
    label: 'PHISHING',
    icon: '✕',
    color: '#ff3d5a',
    bg: 'rgba(255,61,90,0.08)',
    border: 'rgba(255,61,90,0.25)',
    glow: '0 0 12px rgba(255,61,90,0.25)',
  },
};

export default function ThreatBadge({ level, size = 'md' }) {
  const c = config[level] || config.SUSPICIOUS;
  const large = size === 'lg';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: large ? '0.6rem' : '0.4rem',
      padding: large ? '0.5rem 1.1rem' : '0.25rem 0.7rem',
      borderRadius: '6px',
      border: `1px solid ${c.border}`,
      background: c.bg,
      color: c.color,
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: large ? '1rem' : '0.75rem',
      letterSpacing: '0.08em',
      boxShadow: c.glow,
    }}>
      <span style={{
        width: large ? 20 : 14,
        height: large ? 20 : 14,
        borderRadius: '50%',
        background: c.color,
        color: '#000',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: large ? '0.75rem' : '0.55rem',
        fontWeight: 900,
        flexShrink: 0,
      }}>
        {c.icon}
      </span>
      {c.label}
    </span>
  );
}


