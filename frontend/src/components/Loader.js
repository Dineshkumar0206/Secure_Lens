/**
 * Loader.js – Fullscreen scanning animation.
 */
import React from 'react';

export default function Loader({ message = 'Analyzing...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: '1.5rem', padding: '3rem',
    }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: '3px solid #1e2d45',
          borderTopColor: '#00d4ff',
          animation: 'spin 0.9s linear infinite',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 10, height: 10, borderRadius: '50%',
          background: '#00d4ff',
          boxShadow: '0 0 12px #00d4ff',
        }} />
      </div>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.8rem',
        color: '#8899aa',
        letterSpacing: '0.08em',
        animation: 'pulse-glow 1.5s ease-in-out infinite',
      }}>
        {message}
      </span>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-glow { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}


