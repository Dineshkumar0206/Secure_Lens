/**
 * Navbar.js – Top navigation bar for authenticated pages.
 * Shows the logo, nav links, and a logout button.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';
import { getUser } from '../utils/auth';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/scanner',   label: 'Scanner',   icon: '⬡' },
  { to: '/history',   label: 'History',   icon: '⬡' },
];

export default function Navbar() {
  const location = useLocation();
  const user = getUser();

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/dashboard" style={styles.logo}>
        <span style={styles.logoIcon}>⬡</span>
        <span style={styles.logoText}>Secure<span style={styles.logoAccent}>Lens</span></span>
      </Link>

      {/* Nav Links */}
      <div style={styles.links}>
        {navLinks.map(({ to, label, icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}
            >
              {active && <span style={styles.activeDot} />}
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right: user + logout */}
      <div style={styles.right}>
        <span style={styles.username}>
          <span style={styles.userDot}>●</span>
          {user?.username || 'User'}
        </span>
        <button onClick={logout} style={styles.logoutBtn}>
          Sign out
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '60px',
    background: 'rgba(8,12,24,0.95)',
    borderBottom: '1px solid #1e2d45',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    gap: '2rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoIcon: {
    fontSize: '1.5rem',
    color: '#00d4ff',
  },
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 800,
    fontSize: '1.15rem',
    color: '#e8edf5',
    letterSpacing: '-0.02em',
  },
  logoAccent: {
    color: '#00d4ff',
  },
  links: {
    display: 'flex',
    gap: '0.25rem',
    flex: 1,
    justifyContent: 'center',
  },
  link: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '0.875rem',
    color: '#8899aa',
    textDecoration: 'none',
    transition: 'all 0.2s',
    letterSpacing: '0.02em',
  },
  linkActive: {
    color: '#00d4ff',
    background: 'rgba(0,212,255,0.07)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#00d4ff',
    display: 'inline-block',
    boxShadow: '0 0 8px #00d4ff',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexShrink: 0,
  },
  username: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.875rem',
    color: '#8899aa',
    fontFamily: "'Space Mono', monospace",
  },
  userDot: {
    fontSize: '0.5rem',
    color: '#00ff88',
  },
  logoutBtn: {
    padding: '0.35rem 0.9rem',
    borderRadius: '6px',
    border: '1px solid #1e2d45',
    background: 'transparent',
    color: '#8899aa',
    fontSize: '0.8rem',
    cursor: 'poInter',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s',
  },
};





