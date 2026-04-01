import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import {
  changePassword,
  deleteAccount,
  getAccountSettings,
  logout,
  updateProfile,
} from "../services/authService";
import PasswordField from "../components/PasswordField";

const formatDuration = (days) => (typeof days === "number" ? `${days} days` : "—");

export default function AccountSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileForm, setProfileForm] = useState({ username: "", email: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState({ message: "", type: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ message: "", type: "" });
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteFeedback, setDeleteFeedback] = useState({ message: "", type: "" });
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    getAccountSettings()
      .then((data) => {
        setSettings(data);
        setProfileForm({ username: data.username || "", email: data.email || "" });
        setError("");
      })
      .catch(() => {
        setError("Unable to load account settings. Try refreshing.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <main style={styles.loaderWrap}>
          <Loader message="Gathering your security posture..." />
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>Account</p>
            <h1 style={styles.title}>Account settings</h1>
            <p style={styles.subtitle}>
              The SecureLens console keeps alerts, scans and access policies in one place. Review yours
              below and keep the team aligned.
            </p>
          </div>
          <button type="button" onClick={logout} style={styles.signoutPill}>
            Sign out
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.grid}>
          <section style={styles.panel}>
            <p style={styles.panelLabel}>Security status</p>
            <h2 style={styles.statusTitle}>{settings?.securityStatus || "—"}</h2>
            <p style={styles.statusCopy}>{settings?.securitySummary}</p>
            <div style={styles.statusMeta}>
              <div>
                <p style={styles.metaLabel}>Account age</p>
                <p style={styles.metaValue}>{formatDuration(settings?.accountAgeDays)}</p>
              </div>
              <div>
                <p style={styles.metaLabel}>Last login</p>
                <p style={styles.metaValue}>{formatDuration(settings?.daysSinceLastLogin)}</p>
              </div>
            </div>
            <p style={styles.recommendationLabel}>Recommended action</p>
            <p style={styles.recommendation}>{settings?.recommendedAction}</p>
          </section>

          <section style={styles.panel}>
            <div style={styles.sectionHeader}>
              <p style={styles.panelLabel}>Scan health</p>
              <p style={styles.sectionSub}>Total scans: {settings?.totalScans ?? "—"}</p>
            </div>
            <div style={styles.breakdown}>
              {[
                { label: "Safe scans", value: settings?.safeScans ?? 0, accent: "#00ff88" },
                {
                  label: "Suspicious scans",
                  value: settings?.suspiciousScans ?? 0,
                  accent: "#ffd166",
                },
                { label: "Phishing scans", value: settings?.phishingScans ?? 0, accent: "#ff6b81" },
              ].map((item) => (
                <div key={item.label} style={styles.breakdownRow}>
                  <span style={{ ...styles.breakdownDot, background: item.accent }} />
                  <div>
                    <p style={styles.breakdownLabel}>{item.label}</p>
                    <p style={styles.breakdownValue}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.sectionFooter}>
              <p style={styles.footerLabel}>Authorized email</p>
              <p style={styles.footerValue}>{settings?.email || "—"}</p>
            </div>
          </section>

          <section style={styles.panel}>
            <p style={styles.panelLabel}>Identity</p>
            <div style={styles.identityRow}>
              <div>
                <p style={styles.identityLabel}>Display name</p>
                <p style={styles.identityValue}>{settings?.username || "—"}</p>
              </div>
              <div>
                <p style={styles.identityLabel}>Account ID</p>
                <p style={styles.identityValue}>{settings?.id || "—"}</p>
              </div>
            </div>
            <p style={styles.identityHelper}>
              Tweak alert thresholds, rotate credentials or enable Multi-Factor Authentication from
              the dashboard when needed.
            </p>
          </section>
        </div>

        <div style={styles.actionsGrid}>
          <section style={styles.panelForm}>
            <p style={styles.panelLabel}>Update profile</p>
            <p style={styles.panelSub}>
              Keep your display name and primary email current for the team directory.
            </p>
            <div style={styles.formGroup}>
              <label style={styles.label}>Display name</label>
              <input
                value={profileForm.username}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, username: e.target.value }))
                }
                style={styles.input}
                placeholder="Display name"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email address</label>
              <input
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                }
                style={styles.input}
                placeholder="Email address"
                type="email"
              />
            </div>
            {profileFeedback.message && (
              <div
                style={{
                  ...styles.message,
                  ...(profileFeedback.type === "success"
                    ? styles.messageSuccess
                    : styles.messageError),
                }}
              >
                {profileFeedback.message}
              </div>
            )}
            <button
              type="button"
              disabled={profileSaving}
              onClick={async () => {
                setProfileSaving(true);
                setProfileFeedback({ message: "", type: "" });
                try {
                  const updated = await updateProfile({
                    username: profileForm.username.trim(),
                    email: profileForm.email.trim(),
                  });
                  setSettings((prev) => prev && { ...prev, username: updated.username, email: updated.email });
                  setProfileFeedback({ message: "Profile updated.", type: "success" });
                } catch (err) {
                  setProfileFeedback({
                    message:
                      err.response?.data?.message || "Unable to update profile right now.",
                    type: "error",
                  });
                } finally {
                  setProfileSaving(false);
                }
              }}
              style={{
                ...styles.ctaBtn,
                ...(profileSaving ? styles.disabledBtn : {}),
              }}
            >
              {profileSaving ? "Saving…" : "Save changes"}
            </button>
          </section>

          <section style={styles.panelForm}>
            <p style={styles.panelLabel}>Change password</p>
            <p style={styles.panelSub}>
              Rotate your password regularly for added security.
            </p>
            <div style={styles.formGroup}>
              <label style={styles.label}>Current password</label>
              <PasswordField
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                placeholder="••••••••"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>New password</label>
              <PasswordField
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                placeholder="••••••••"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm new password</label>
              <PasswordField
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                placeholder="••••••••"
              />
            </div>
            {passwordFeedback.message && (
              <div
                style={{
                  ...styles.message,
                  ...(passwordFeedback.type === "success"
                    ? styles.messageSuccess
                    : styles.messageError),
                }}
              >
                {passwordFeedback.message}
              </div>
            )}
            <button
              type="button"
              disabled={passwordSaving}
              onClick={async () => {
                if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                  setPasswordFeedback({
                    message: "Password confirmation does not match.",
                    type: "error",
                  });
                  return;
                }
                setPasswordSaving(true);
                setPasswordFeedback({ message: "", type: "" });
                try {
                  await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
                  setPasswordFeedback({
                    message: "Password updated successfully.",
                    type: "success",
                  });
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                } catch (err) {
                  setPasswordFeedback({
                    message:
                      err.response?.data?.message || "Unable to change password right now.",
                    type: "error",
                  });
                } finally {
                  setPasswordSaving(false);
                }
              }}
              style={{
                ...styles.ctaBtn,
                ...(passwordSaving ? styles.disabledBtn : {}),
              }}
            >
              {passwordSaving ? "Updating…" : "Update password"}
            </button>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Forgot password?
            </Link>
          </section>
          <section style={styles.panelForm}>
            <p style={styles.panelLabel}>Delete identity</p>
            <p style={styles.panelSub}>
              Permanently remove your SecureLens account. This cannot be undone.
            </p>
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm password</label>
              <PasswordField
                name="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Current password"
              />
            </div>
            {deleteFeedback.message && (
              <div
                style={{
                  ...styles.message,
                  ...(deleteFeedback.type === "success"
                    ? styles.messageSuccess
                    : styles.messageError),
                }}
              >
                {deleteFeedback.message}
              </div>
            )}
            <button
              type="button"
              disabled={deleteLoading || !deletePassword}
              onClick={async () => {
                if (deleteLoading || !deletePassword) return;
                setDeleteLoading(true);
                setDeleteFeedback({ message: "", type: "" });
                try {
                  await deleteAccount(deletePassword);
                  setDeleteFeedback({
                    message: "Account deleted. Redirecting to login…",
                    type: "success",
                  });
                  setTimeout(() => {
                    logout();
                  }, 1200);
                } catch (err) {
                  setDeleteFeedback({
                    message:
                      err.response?.data?.message ||
                      "Unable to delete the account at this time.",
                    type: "error",
                  });
                } finally {
                  setDeleteLoading(false);
                }
              }}
              style={{
                ...styles.ctaBtn,
                ...(deleteLoading ? styles.disabledBtn : {}),
                background:
                  deleteLoading || !deletePassword
                    ? "rgba(255,61,90,0.3)"
                    : "linear-gradient(135deg, #ff5f5f, #ff3d5a)",
              }}
            >
              {deleteLoading ? "Deleting…" : "Delete identity"}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
  },
  main: {
    maxWidth: "1040px",
    margin: "0 auto",
    padding: "2rem 1.5rem 3rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  loaderWrap: {
    maxWidth: "1040px",
    margin: "0 auto",
    padding: "4rem 1.5rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1.25rem",
    flexWrap: "wrap",
  },
  kicker: {
    letterSpacing: "0.4em",
    textTransform: "uppercase",
    fontSize: "0.65rem",
    color: "var(--text-muted)",
    marginBottom: "0.25rem",
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 800,
    fontSize: "1.95rem",
    color: "var(--accent-cyan)",
    marginBottom: "0.25rem",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
    maxWidth: "450px",
  },
  signoutPill: {
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "999px",
    padding: "0.45rem 1.4rem",
    background: "transparent",
    color: "var(--text-primary)",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    letterSpacing: "0.04em",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.25rem",
    marginTop: "1rem",
  },
  panel: {
    background: "var(--bg-card)",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.35)",
  },
  panelForm: {
    background: "var(--bg-card)",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.35)",
  },
  panelLabel: {
    fontSize: "0.75rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "var(--accent-cyan)",
    fontFamily: "'Inter', sans-serif",
  },
  panelSub: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: 1.4,
    margin: 0,
  },
  statusTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    color: "var(--text-primary)",
    margin: 0,
  },
  statusCopy: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    lineHeight: 1.5,
  },
  statusMeta: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  metaLabel: {
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontSize: "0.65rem",
    color: "var(--text-muted)",
    marginBottom: "0.15rem",
  },
  metaValue: {
    fontSize: "1rem",
    fontWeight: 700,
  },
  recommendationLabel: {
    fontSize: "0.8rem",
    letterSpacing: "0.2em",
    color: "var(--text-muted)",
    textTransform: "uppercase",
  },
  recommendation: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
    lineHeight: 1.4,
  },
  breakdown: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  breakdownRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  breakdownDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    display: "inline-block",
  },
  breakdownLabel: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    margin: 0,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  breakdownValue: {
    fontSize: "1.2rem",
    fontWeight: 700,
    margin: 0,
    color: "var(--text-primary)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionSub: {
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
  },
  sectionFooter: {
    marginTop: "1rem",
    borderTop: "1px solid var(--border-bright)",
    paddingTop: "0.75rem",
  },
  footerLabel: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    margin: 0,
  },
  footerValue: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  identityRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  },
  identityLabel: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    marginBottom: "0.2rem",
  },
  identityValue: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  identityHelper: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: 1.4,
  },
  error: {
    padding: "0.75rem 1rem",
    background: "rgba(255, 61, 90, 0.1)",
    border: "1px solid rgba(255, 61, 90, 0.4)",
    borderRadius: "12px",
    color: "#ff718d",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
  },
  label: {
    fontSize: "0.8rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  },
  input: {
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    padding: "0.75rem 1rem",
    color: "var(--text-primary)",
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.85rem",
  },
  ctaBtn: {
    marginTop: "0.25rem",
    padding: "0.8rem 1.1rem",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
    color: "#040c18",
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0, 212, 255, 0.35)",
  },
  disabledBtn: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  messageSuccess: {
    background: "rgba(0, 255, 136, 0.1)",
    border: "1px solid rgba(0, 255, 136, 0.4)",
    color: "var(--safe-color)",
  },
  messageError: {
    background: "rgba(255, 61, 90, 0.1)",
    border: "1px solid rgba(255, 61, 90, 0.4)",
    color: "#ff718d",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.25rem",
  },
  forgotLink: {
    fontSize: "0.75rem",
    color: "var(--accent-cyan)",
    textDecoration: "none",
    marginTop: "0.5rem",
    fontFamily: "'Inter', sans-serif",
  },
};
