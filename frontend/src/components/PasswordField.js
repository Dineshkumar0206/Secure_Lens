import React, { useState } from "react";

export default function PasswordField({
  id,
  name,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  disabled = false,
  className,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }} className={className}>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        style={{
          width: "100%",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          padding: "0.75rem 3rem 0.75rem 1rem",
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.9rem",
        }}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        style={{
          position: "absolute",
          right: "0.65rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontSize: 0,
          lineHeight: 0,
          padding: 0,
        }}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {visible ? (
            <path
              d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <>
              <path
                d="M16.47 7.53 7.53 16.47"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.07 4.93c-1.96-1.95-4.7-3.93-7.07-3.93C6.8 1 3.9 2.15 1.93 4.11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
