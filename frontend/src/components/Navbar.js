/**
 * Navbar.js – Top navigation bar for authenticated pages.
 * Shows the logo, nav links, and a logout button.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout, getProfile as fetchProfile } from '../services/authService';
import { getUser } from '../utils/auth';
import { getActiveTheme, getThemeOptions, setTheme as applyTheme } from '../utils/theme';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/scanner',   label: 'Scanner',   icon: '⬡' },
  { to: '/history',   label: 'History',   icon: '⬡' },
];

export default function Navbar() {
  const location = useLocation();
  const user = getUser();
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeTheme, setActiveTheme] = useState(getActiveTheme());
  const themeOptions = getThemeOptions();
  const handleThemeChange = (value) => {
    const next = applyTheme(value);
    setActiveTheme(next);
  };

  useEffect(() => {
    if (!isOpen) {
      return () => {};
    }
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || profile) {
      return;
    }
    fetchProfile()
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
  }, [isOpen, profile]);

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
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          style={styles.profileToggle}
        >
          <span style={styles.profileAvatar}>{user?.username?.[0] || 'U'}</span>
          <p style={styles.profileLabel}>
            {user?.username || 'User'}
            <span style={styles.profileDot} />
          </p>
        </button>

        {isOpen && (
          <div ref={menuRef} style={styles.dropdown}>
            <div style={styles.dropdownHeader}>
              <div style={styles.avatarWrap}>
                <span style={styles.avatar}>{user?.username?.[0] || 'U'}</span>
                <span style={styles.onlineDot} />
              </div>
              <div>
                <p style={styles.dropdownName}>{user?.username || 'SecureLens'}</p>
                <p style={styles.dropdownEmail}>{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <div style={styles.statsRow}>
              <div style={styles.statCol}>
                <p style={styles.statLabel}>Active scans</p>
                <p style={styles.statValue}>{profile ? profile.totalScans : '—'}</p>
              </div>
              <div style={styles.statCol}>
                <p style={styles.statLabel}>Ready</p>
                <p style={styles.statValue}>12</p>
              </div>
            </div>
            <div style={styles.actionsList}>
              <Link to="/profile" style={styles.actionLink} onClick={() => setIsOpen(false)}>
                View Profile
              </Link>
              <Link to="/settings" style={styles.actionLink} onClick={() => setIsOpen(false)}>
                Account Settings
              </Link>
              <a href="mailto:support@securelens.local" style={styles.actionLink}>Help & Support</a>
              <div style={styles.themeRow}>
                <span style={styles.themeLabel}>Theme</span>
                <div style={styles.themeSwatches}>
                  {themeOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => handleThemeChange(option.value)}
                      style={{
                        ...styles.themeOption,
                        ...(option.value === activeTheme ? styles.themeOptionActive : {}),
                      }}
                    >
                      <span style={{ ...styles.themeDot, backgroundImage: option.preview }} />
                      <span style={styles.themeName}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                style={styles.logoutBtn}
              >
                Logout System
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = "/settings#delete")}
                style={styles.deleteBtn}
              >
                Delete Identity
              </button>
            </div>
            <p style={styles.footerHint}>Last login instance verified</p>
          </div>
        )}
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
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    gap: '2rem',
  },
  profileToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '999px',
    padding: '0.35rem 0.8rem',
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'background 0.2s',
  },
  profileAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00d4ff, #7b61ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },
  profileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    fontFamily: "'Space Grotesk', sans-serif",
    color: 'var(--text-primary)',
  },
  profileDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--accent-green)',
    display: 'inline-block',
  },
  dropdown: {
    position: 'absolute',
    right: '2rem',
    top: '70px',
    width: '260px',
    padding: '1rem',
    borderRadius: '20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
    animation: 'fadeIn 0.3s ease',
    zIndex: 200,
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #00d4ff, #7b61ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid var(--bg-card)',
    background: '#00ff88',
  },
  dropdownName: {
    fontSize: '0.95rem',
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  dropdownEmail: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  statsRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  statCol: {
    flex: 1,
    padding: '0.6rem 0.75rem',
    borderRadius: '12px',
    background: 'var(--bg-secondary)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  statLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.3em',
    color: 'var(--text-muted)',
  },
  statValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  actionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  actionLink: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontFamily: "'Inter', sans-serif",
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    textDecoration: 'none',
  },
  themeRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  themeLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    fontFamily: "'Inter',sans-serif",
  },
  themeSwatches: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
  },
  themeOption: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.35rem 0.6rem',
    borderRadius: '999px',
    border: '1px solid transparent',
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    fontSize: '0.7rem',
    fontFamily: "'Inter',sans-serif",
    cursor: 'pointer',
  },
  themeOptionActive: {
    borderColor: 'var(--accent-cyan)',
    boxShadow: '0 0 0 1px rgba(0,212,255,0.4)',
  },
  themeDot: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.3)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  themeName: {
    fontSize: '0.7rem',
    fontWeight: 600,
  },
  logoutBtn: {
    width: '100%',
    padding: '0.6rem 0.75rem',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #ff6b9e, #ff3d5a)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  deleteBtn: {
    width: '100%',
    padding: '0.6rem 0.75rem',
    borderRadius: '12px',
    border: '1px dashed rgba(255,61,90,0.6)',
    background: 'transparent',
    color: '#ff3d5a',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  footerHint: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: '0.5rem',
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
    color: 'var(--text-primary)',
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
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'all 0.2s',
    letterSpacing: '0.02em',
  },
  linkActive: {
    color: 'var(--accent-cyan)',
    background: 'rgba(0,212,255,0.07)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent-cyan)',
    display: 'inline-block',
    boxShadow: '0 0 8px rgba(0,212,255,0.7)',
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
    color: 'var(--text-secondary)',
    fontFamily: "'Space Mono', monospace",
  },
  userDot: {
    fontSize: '0.5rem',
    color: '#00ff88',
  },
};





