// components/ThreatResult.js
import React from 'react';
import { getThreatMeta, scoreColor, formatDate } from '../utils/helpers';
import './ThreatResult.css';

/**
 * ThreatResult - Displays the full analysis result of a URL scan.
 * Shows threat level badge, score ring, flags list, and metadata.
 */
const ThreatResult = ({ result }) => {
  if (!result) return null;

  const { cls, label, emoji } = getThreatMeta(result.threatLevel);
  const color = scoreColor(result.threatScore);

  // SVG circle ring for threat score visualization
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference - (result.threatScore / 100) * circumference;

  return (
    <div className={`threat-result fade-in threat-result--${cls}`}>
      {/* ── Header ─────────────────────────────────── */}
      <div className="tr-header">
        <div className="tr-title-row">
          <span className={`badge badge-${cls}`}>
            {emoji} {label}
          </span>
          <div className="tr-url">
            <span className="tr-url-label">Analyzed URL</span>
            <span className="tr-url-value mono">{result.url}</span>
          </div>
        </div>
      </div>

      {/* ── Score + Details grid ────────────────────── */}
      <div className="tr-body">
        {/* Score ring */}
        <div className="tr-score-wrap">
          <svg className="score-ring" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle cx="60" cy="60" r={radius} fill="none"
              stroke="var(--border)" strokeWidth="8" />
            {/* Threat score arc */}
            <circle cx="60" cy="60" r={radius} fill="none"
              stroke={color} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            {/* Score text */}
            <text x="60" y="55" textAnchor="middle"
              fill={color} fontSize="22" fontWeight="700"
              fontFamily="'Space Mono', monospace">
              {result.threatScore}
            </text>
            <text x="60" y="72" textAnchor="middle"
              fill="var(--text-muted)" fontSize="10"
              fontFamily="'Inter', sans-serif">
              / 100
            </text>
          </svg>
          <div className="score-label">
            <span className="score-label-text">Threat Score</span>
            <span className="score-risk" style={{ color }}>
              Risk: {result.riskPercentage}
            </span>
          </div>
        </div>

        {/* Detection flags */}
        <div className="tr-flags">
          <h4 className="tr-flags-title">
            <span>⚡</span> Detection Findings
          </h4>
          <ul className="flags-list">
            {result.flags?.map((flag, i) => (
              <li key={i} className="flag-item">
                <span className="flag-dot" />
                {flag}
              </li>
            ))}
          </ul>
        </div>

        {/* Security checks grid */}
        <div className="tr-checks">
          <h4 className="tr-checks-title">Security Checks</h4>
          <div className="checks-grid">
            <CheckItem label="HTTPS" value={result.hasHttps} goodWhenTrue />
            <CheckItem label="Suspicious Keywords" value={result.hasSuspiciousKeywords} goodWhenTrue={false} />
            <CheckItem label="IP-based URL" value={result.isIpBased} goodWhenTrue={false} />
            <CheckItem label="Long URL" value={result.isLongUrl} goodWhenTrue={false} />
            <CheckItem label="Domain Mismatch" value={result.hasDomainMismatch} goodWhenTrue={false} />
          </div>
        </div>
      </div>

      {/* ── Footer metadata ────────────────────────── */}
      {result.scannedAt && (
        <div className="tr-footer">
          <span className="tr-meta mono">
            🕐 Scanned: {formatDate(result.scannedAt)}
          </span>
          {result.id && (
            <span className="tr-meta mono">Scan ID: #{result.id}</span>
          )}
        </div>
      )}
    </div>
  );
};

/** Small security check indicator pill */
const CheckItem = ({ label, value, goodWhenTrue }) => {
  const isGood = goodWhenTrue ? value : !value;
  return (
    <div className={`check-item check-item--${isGood ? 'good' : 'bad'}`}>
      <span className="check-icon">{isGood ? '✓' : '✗'}</span>
      <span className="check-label">{label}</span>
    </div>
  );
};

export default ThreatResult;



