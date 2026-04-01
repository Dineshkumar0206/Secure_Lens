import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getProfile, logout } from "../services/authService";

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data))
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Unable to load your profile. Please try refreshing."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total scans", value: profile?.totalScans ?? "—" },
    { label: "Created", value: formatDateTime(profile?.createdAt) },
    { label: "Last login", value: formatDateTime(profile?.lastLogin) },
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>Account</p>
            <h1 style={styles.title}>User profile</h1>
            <p style={styles.subtitle}>
              View your account details and security overview.
            </p>
          </div>
          <button type="button" onClick={logout} style={styles.signoutPill}>
            Sign out
          </button>
        </div>

        {loading ? (
          <Loader message="Loading profile..." />
        ) : (
          <>
            {error && <div style={styles.message}>{error}</div>}
            <div style={styles.grid}>
              <section style={styles.statsCard}>
                <div style={styles.statsRow}>
                  {stats.map((stat) => (
                    <div key={stat.label} style={styles.statCol}>
                      <p style={styles.statLabel}>{stat.label}</p>
                      <p
                        style={{
                          ...(stat.label === "Total scans"
                            ? styles.statValue
                            : styles.statValueDate),
                        }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
                <p style={styles.description}>
                  This is a read-only view of your identity and activity on SecureLens.
                </p>
              </section>

              <section style={styles.identityCard}>
                <p style={styles.identityHeading}>Identity</p>
                <div style={styles.identityRow}>
                  <div>
                    <p style={styles.identityLabel}>Display name</p>
                    <p style={styles.identityValue}>{profile?.username || "—"}</p>
                  </div>
                  <div>
                    <p style={styles.identityLabel}>Email address</p>
                    <p style={styles.identityValue}>{profile?.email || "—"}</p>
                  </div>
                </div>
                <div style={styles.identityMeta}>
                  <p style={styles.identityMetaLabel}>Account status</p>
                  <p style={styles.identityMetaValue}>Read-only details</p>
                </div>
              </section>
            </div>
          </>
        )}
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
    maxWidth: "980px",
    margin: "0 auto",
    padding: "2rem 1.5rem 3rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
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
    fontSize: "1.9rem",
    color: "var(--accent-cyan)",
    marginBottom: "0.25rem",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
    maxWidth: "420px",
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
    gap: "1.5rem",
    marginTop: "1rem",
  },
  statsCard: {
    background: "var(--bg-card)",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.25)",
  },
  statsRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCol: {
    flex: "1 1 120px",
    minWidth: 0,
  },
  statLabel: {
    fontSize: "0.7rem",
    letterSpacing: "0.3em",
    color: "var(--accent-cyan)",
    textTransform: "uppercase",
    fontFamily: "'Inter', sans-serif",
  },
  statValue: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  statValueDate: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  description: {
    color: "var(--text-secondary)",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
  },
  identityCard: {
    background: "var(--bg-card)",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    padding: "1.5rem",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.25)",
  },
  identityHeading: {
    fontSize: "0.85rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "var(--accent-cyan)",
    fontFamily: "'Inter', sans-serif",
    marginBottom: "0.75rem",
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
    letterSpacing: "0.1em",
    marginBottom: "0.35rem",
  },
  identityValue: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  identityMeta: {
    marginTop: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid var(--border)",
  },
  identityMetaLabel: {
    fontSize: "0.7rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    marginBottom: "0.25rem",
  },
  identityMetaValue: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
  },
  message: {
    padding: "0.85rem 1rem",
    borderRadius: "10px",
    background: "rgba(255, 99, 132, 0.15)",
    border: "1px solid rgba(255, 99, 132, 0.4)",
    color: "#ff718d",
    fontFamily: "'Inter', sans-serif",
  },
};
