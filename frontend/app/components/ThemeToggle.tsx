"use client";

import { useEffect, useMemo, useState } from "react";

import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = useMemo(() => theme === "dark", [theme]);

  if (!mounted) {
    return (
      <div style={{ padding: "14px 16px", borderRadius: "16px" }} aria-hidden>
        <div
          style={{
            height: "44px",
            borderRadius: "999px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "14px 16px", borderRadius: "16px" }}>
      <p
        style={{
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          margin: "0 0 10px",
          fontWeight: 700,
        }}
      >
        Theme
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--sacred-gold-dim)",
          borderRadius: "99px",
          padding: "6px",
          border: "1px solid var(--border-mid)",
        }}
      >
        <button
          type="button"
          onClick={() => setTheme("light")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "99px",
            border: "none",
            background: !isDark ? "var(--sacred-gold)" : "transparent",
            color: !isDark ? "white" : "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <span aria-hidden style={{ fontSize: "16px" }}>
            ☀️
          </span>
          <span>Light</span>
          {!isDark && (
            <span
              style={{
                fontSize: "10px",
                background: "rgba(255,255,255,0.22)",
                padding: "2px 6px",
                borderRadius: "99px",
              }}
            >
              Fajr
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "99px",
            border: "none",
            background: isDark ? "var(--sacred-gold)" : "transparent",
            color: isDark ? "white" : "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <span aria-hidden style={{ fontSize: "16px" }}>
            🌙
          </span>
          <span>Dark</span>
          {isDark && (
            <span
              style={{
                fontSize: "10px",
                background: "rgba(255,255,255,0.22)",
                padding: "2px 6px",
                borderRadius: "99px",
              }}
            >
              Isha
            </span>
          )}
        </button>
      </div>

      <p
        style={{
          fontSize: "11px",
          color: "var(--text-muted)",
          marginTop: "12px",
          textAlign: "center",
        }}
      >
        {isDark ? "✨ Night mode for peaceful recitation" : "☀️ Day mode like illuminated manuscript"}
      </p>
    </div>
  );
};

export default ThemeToggle;

