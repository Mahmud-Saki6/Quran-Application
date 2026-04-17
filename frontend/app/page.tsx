"use client";

import Fuse from "fuse.js";
import { useMemo, useState } from "react";

import SurahCard from "@/app/components/SurahCard";
import surahsData from "@/lib/generated/surahs.json";
import type { SurahSummary } from "@/lib/types";

const surahs = surahsData as SurahSummary[];

const fuse = new Fuse(surahs, {
  keys: [
    { name: "englishName", weight: 0.5 },
    { name: "name", weight: 0.3 },
    { name: "englishNameTranslation", weight: 0.2 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
});

const meccanCount = surahs.filter((s) => s.revelationType === "Meccan").length;
const medinanCount = surahs.filter((s) => s.revelationType === "Medinan").length;
const totalVerses = surahs.reduce((sum, s) => sum + s.numberOfAyahs, 0);

type RevelationFilter = "all" | "Meccan" | "Medinan";

const HomePage = () => {
  const [filter, setFilter] = useState("");
  const [revelationFilter, setRevelationFilter] = useState<RevelationFilter>("all");

  const filteredSurahs = useMemo(() => {
    let results: SurahSummary[];

    if (filter.trim().length >= 2) {
      const asNumber = parseInt(filter.trim(), 10);
      if (!isNaN(asNumber) && asNumber >= 1 && asNumber <= 114) {
        results = surahs.filter((s) => s.number === asNumber);
      } else {
        results = fuse.search(filter.trim()).map((r) => r.item);
      }
    } else {
      results = surahs;
    }

    if (revelationFilter !== "all") {
      results = results.filter((s) => s.revelationType === revelationFilter);
    }

    return results;
  }, [filter, revelationFilter]);

  const filterButtons: { label: string; value: RevelationFilter }[] = [
    { label: "All", value: "all" },
    { label: "Meccan", value: "Meccan" },
    { label: "Medinan", value: "Medinan" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section style={{ marginBottom: "36px" }}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            padding: "12px 20px",
            background: "var(--sacred-gold-dim)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "99px",
            width: "fit-content",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "14px",
          }}
        >
          <span style={{ color: "var(--sacred-gold)", fontWeight: "600", fontSize: "14px" }}>
            114 Surahs
          </span>
          <span style={{ color: "var(--sacred-green)", fontWeight: "500" }}>•</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            {totalVerses.toLocaleString()} Verses
          </span>
          <span style={{ color: "var(--sacred-green)", fontWeight: "500" }}>•</span>
          <span style={{ color: "var(--sacred-ruby)", fontSize: "14px" }}>{meccanCount} Meccan</span>
          <span style={{ color: "var(--sacred-green)", fontWeight: "500" }}>•</span>
          <span style={{ color: "var(--sacred-green)", fontSize: "14px" }}>{medinanCount} Medinan</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(26px, 4vw, 42px)",
            fontWeight: "600",
            color: "var(--text-primary)",
            lineHeight: 1.15,
            marginBottom: "8px",
          }}
        >
          The Holy <span className="gradient-text">Quran</span>
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "15px",
            marginBottom: "28px",
          }}
        >
          Read, reflect, and search across every surah and verse.
        </p>

        {/* Filter row */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            className="glass search-bar"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              border: "1px solid var(--border-mid)",
              borderRadius: "14px",
              padding: "0 16px",
              height: "48px",
              flex: "1",
              minWidth: "220px",
              maxWidth: "420px",
            }}
          >
            <svg
              fill="none"
              height="18"
              style={{ flexShrink: 0, color: "var(--text-muted)" }}
              viewBox="0 0 24 24"
              width="18"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
            <input
              aria-label="Filter surahs by name or number"
              placeholder="Filter surahs by name or number..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "14px",
                width: "100%",
                minWidth: 0,
              }}
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filter && (
              <button
                aria-label="Clear filter"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "18px",
                  lineHeight: 1,
                  padding: "4px",
                  flexShrink: 0,
                }}
                type="button"
                onClick={() => setFilter("")}
              >
                ×
              </button>
            )}
          </div>

          {/* Revelation type pills */}
          {filterButtons.map(({ label, value }) => (
            <button
              key={value}
              style={{
                height: "48px",
                padding: "0 18px",
                borderRadius: "14px",
                background:
                  revelationFilter === value
                    ? "var(--sacred-gold-dim)"
                    : "var(--glass-btn)",
                border: `1px solid ${
                  revelationFilter === value
                    ? "rgba(184, 134, 11, 0.45)"
                    : "var(--border-subtle)"
                }`,
                color:
                  revelationFilter === value
                    ? "var(--sacred-gold)"
                    : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              type="button"
              onClick={() => setRevelationFilter(value)}
            >
              {label}
            </button>
          ))}

          {/* Result count */}
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              marginLeft: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {filteredSurahs.length} surah{filteredSurahs.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* Surah Grid */}
      {filteredSurahs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--text-secondary)",
            fontSize: "15px",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.4 }}>
            ☾
          </div>
          No surahs match &ldquo;
          <strong style={{ color: "var(--text-primary)" }}>{filter}</strong>&rdquo;
          <br />
          <button
            style={{
              marginTop: "12px",
              background: "none",
              border: "none",
              color: "var(--accent-teal)",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "underline",
            }}
            type="button"
            onClick={() => setFilter("")}
          >
            Clear filter
          </button>
        </div>
      ) : (
        <>
          <div className="isolate mt-10 grid w-full auto-rows-fr justify-items-stretch grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSurahs.map((surah, i) => (
              <SurahCard key={surah.number} index={i} surah={surah} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
