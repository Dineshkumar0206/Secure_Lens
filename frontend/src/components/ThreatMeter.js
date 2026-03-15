/**
 * ThreatMeter.js – Animated circular gauge showing threat score 0–100.
 */
import React from 'react';

export default function ThreatMeter({ score }) {
  const clamped = Math.min(100, Math.max(0, score));
  const color =
    clamped <= 30 ? '#00ff88' :
    clamped <= 65 ? '#ff8c42' : '#ff3d5a';

  // SVG arc calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Background track */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none" stroke="#1e2d45" strokeWidth="10"
        />
        {/* Colored arc */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference / 4}
          style={{ transition: 'stroke-dasharray 1s ease, stroke 0.5s' }}
          filter={`drop-shadow(0 0 8px ${color})`}
        />
        {/* Score text */}
        <text x="90" y="85" textAnchor="middle"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '2rem', fill: color }}>
          {clamped}
        </text>
        <text x="90" y="108" textAnchor="middle"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', fill: '#8899aa', letterSpacing: '0.1em' }}>
          RISK SCORE
        </text>
      </svg>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.75rem',
        color: '#8899aa',
      }}>
        {clamped}% risk level
      </div>
    </div>
  );
}





