"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import searchIndexData from "@/lib/generated/search-index.json";
import surahsData from "@/lib/generated/surahs.json";
import type { SearchIndexEntry, SurahSummary } from "@/lib/types";

const searchIndex = searchIndexData as SearchIndexEntry[];
const surahs = surahsData as SurahSummary[];

/* ── Stop words that add noise to keyword scoring ────────────────────── */
const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "are", "was", "has", "not",
  "but", "from", "they", "will", "all", "been", "have", "had", "its", "who",
  "him", "his", "her", "our", "you", "your", "thee", "thy", "thou", "unto",
  "into", "over", "also", "when", "then", "than", "does", "did", "can", "may",
  "shall", "yet", "nor", "which", "what", "how", "such", "very", "even", "only",
  "just", "out", "one", "two", "any", "each", "every", "some", "many", "much",
  "few", "upon", "their", "those", "these", "said", "would", "could", "should",
  // Extra common words that dilute keyword relevance
  "there", "here", "were", "come", "came", "now", "got", "get", "set", "let",
  "put", "say", "see", "know", "like", "well", "unto", "hath", "doth", "behold",
  "thereof", "wherein", "whereof", "whereby", "therefrom", "therefor",
]);

/** Extract meaningful keywords from a free-text query. */
const parseKeywords = (query: string): string[] =>
  query
    .toLowerCase()
    .split(/[\s,;.!?'"()\-–—]+/)
    .map((w) => w.replace(/[^a-z]/g, ""))
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

/** Highlight every keyword inside a translation string. */
const highlightKeywords = (text: string, keywords: string[]) => {
  if (!keywords.length) return text;

  const escaped = keywords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");

  return text.split(pattern).map((part, i) =>
    pattern.test(part) ? (
      <mark
        key={i}
        style={{
          background: "rgba(184, 134, 11, 0.22)",
          color: "var(--sacred-gold)",
          padding: "1px 4px",
          borderRadius: "4px",
          fontWeight: "700",
        }}
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

interface ScoredResult {
  entry: SearchIndexEntry;
  matchedWords: string[];
  score: number;
}

const runSearch = (
  query: string,
  exactMatch: boolean,
  selectedSurah: number | "all",
): ScoredResult[] => {
  if (!query.trim()) return [];

  const keywords = parseKeywords(query);
  const normalizedQuery = query.trim().toLowerCase();

  /* ── Exact phrase mode ───────────────────────────────────────────────── */
  if (exactMatch || keywords.length === 0) {
    return searchIndex
      .filter((entry) => {
        if (selectedSurah !== "all" && entry.surahNumber !== selectedSurah) return false;
        return entry.translation.toLowerCase().includes(normalizedQuery);
      })
      .map((entry) => ({ entry, matchedWords: keywords, score: 1 }));
  }

  /* ── Keyword-scoring mode (ANY word match = shown; more = ranked higher) */
  return searchIndex
    .filter((entry) =>
      selectedSurah === "all" || entry.surahNumber === selectedSurah,
    )
    .map((entry) => {
      const tl = entry.translation.toLowerCase();
      const matchedWords = keywords.filter((w) => tl.includes(w));
      return { entry, matchedWords, score: matchedWords.length };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.surahNumber - b.entry.surahNumber;
    });
};

/* ── Search results inner component (uses useSearchParams) ───────────── */
const SearchPageInner = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [exactMatch, setExactMatch] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState<number | "all">("all");
  const [isSurahMenuOpen, setIsSurahMenuOpen] = useState(false);
  const surahMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSurahMenuOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const el = surahMenuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setIsSurahMenuOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSurahMenuOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isSurahMenuOpen]);

  const results = useMemo(
    () => runSearch(query, exactMatch, selectedSurah),
    [exactMatch, query, selectedSurah],
  );

  const keywords = useMemo(() => parseKeywords(query), [query]);

  /* ── Empty state ─────────────────────────────────────────────────────── */
  if (!query) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <svg
          fill="none"
          height="64"
          style={{ margin: "0 auto 20px", opacity: 0.25 }}
          viewBox="0 0 24 24"
          width="64"
        >
          <path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "10px",
          }}
        >
          Search English Translations
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Type any word, phrase, or verse text in the search bar above.
          <br />
          The app searches across{" "}
          <strong style={{ color: "var(--sacred-gold)" }}>all 6,236 verses</strong> instantly.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "clamp(20px,3vw,30px)",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "6px",
          }}
        >
          Results for{" "}
          <span style={{ color: "var(--sacred-gold)" }}>"{query}"</span>
        </h1>

        {/* Matched keywords hint */}
        {keywords.length > 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "4px 0 0" }}>
            Searching for:{" "}
            {keywords.map((kw, i) => (
              <span
                key={kw}
                style={{
                  background: "var(--sacred-gold-dim)",
                  border: "1px solid rgba(184, 134, 11, 0.35)",
                  color: "var(--sacred-gold)",
                  borderRadius: "6px",
                  padding: "1px 8px",
                  fontSize: "12px",
                  marginRight: "4px",
                  display: "inline-block",
                }}
              >
                {kw}
              </span>
            ))}
          </p>
        )}

        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>
          {results.length === 0
            ? "No verses found"
            : `${results.length} verse${results.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "28px",
          padding: "14px 18px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-mid)",
          borderRadius: "14px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div ref={surahMenuRef} style={{ position: "relative" }}>
          <button
            aria-expanded={isSurahMenuOpen}
            aria-haspopup="listbox"
            type="button"
            onClick={() => setIsSurahMenuOpen((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              background: "var(--glass-panel)",
              border: isSurahMenuOpen
                ? "1px solid var(--border-accent)"
                : "1px solid var(--border-mid)",
              borderRadius: "10px",
              padding: "8px 12px",
              color: "var(--text-primary)",
              fontSize: "13px",
              cursor: "pointer",
              minWidth: "220px",
              boxShadow: isSurahMenuOpen ? "0 0 0 4px rgba(184, 134, 11, 0.15)" : "none",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              userSelect: "none",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <span style={{ opacity: 0.85, fontSize: "12px" }}>Surah</span>
              <span style={{ fontWeight: 600 }}>
                {selectedSurah === "all"
                  ? "All"
                  : `${selectedSurah}. ${surahs[selectedSurah - 1]?.englishName ?? "Unknown"}`}
              </span>
            </span>

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                opacity: 0.9,
                transform: isSurahMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
              }}
            >
              <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isSurahMenuOpen && (
            <div
              role="listbox"
              aria-label="Select surah"
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                left: 0,
                zIndex: 50,
                width: "min(420px, 80vw)",
                maxHeight: "340px",
                overflow: "auto",
                background: "var(--menu-bg)",
                border: "1px solid var(--border-mid)",
                borderRadius: "14px",
                boxShadow:
                  "0 18px 48px rgba(0, 0, 0, 0.28), 0 0 0 1px var(--menu-inset) inset",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                padding: "8px",
              }}
            >
              <button
                type="button"
                role="option"
                aria-selected={selectedSurah === "all"}
                onClick={() => {
                  setSelectedSurah("all");
                  setIsSurahMenuOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 10px",
                  borderRadius: "10px",
                  border: "1px solid transparent",
                  background:
                    selectedSurah === "all"
                      ? "var(--sacred-gold-dim)"
                      : "var(--menu-item-bg)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "13px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
                onMouseEnter={(e) => {
                  if (selectedSurah === "all") return;
                  e.currentTarget.style.background = "var(--menu-item-hover)";
                  e.currentTarget.style.borderColor = "var(--border-mid)";
                }}
                onMouseLeave={(e) => {
                  if (selectedSurah === "all") return;
                  e.currentTarget.style.background = "var(--menu-item-bg)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <span style={{ fontWeight: 600 }}>All Surahs</span>
                {selectedSurah === "all" && (
                  <span style={{ color: "var(--sacred-gold)", fontSize: "12px", fontWeight: 700 }}>✓</span>
                )}
              </button>

              <div style={{ height: "8px" }} />

              {surahs.map((s) => {
                const active = selectedSurah === s.number;
                return (
                  <button
                    key={s.number}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setSelectedSurah(s.number);
                      setIsSurahMenuOpen(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 10px",
                      borderRadius: "10px",
                      border: "1px solid transparent",
                      background: active ? "var(--sacred-gold-dim)" : "var(--menu-item-bg)",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      fontSize: "13px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    onMouseEnter={(e) => {
                      if (active) return;
                      e.currentTarget.style.background = "var(--menu-item-hover)";
                      e.currentTarget.style.borderColor = "var(--border-mid)";
                    }}
                    onMouseLeave={(e) => {
                      if (active) return;
                      e.currentTarget.style.background = "var(--menu-item-bg)";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          width: "34px",
                          height: "26px",
                          borderRadius: "9px",
                          background: active
                            ? "rgba(184, 134, 11, 0.15)"
                            : "var(--bg-card)",
                          border: active
                            ? "1px solid rgba(184, 134, 11, 0.4)"
                            : "1px solid var(--border-subtle)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: active ? "var(--sacred-gold)" : "var(--text-muted)",
                          flex: "0 0 auto",
                        }}
                      >
                        {s.number}
                      </span>
                      <span style={{ fontWeight: 600 }}>{s.englishName}</span>
                    </span>
                    {active && (
                      <span style={{ color: "var(--sacred-gold)", fontSize: "12px", fontWeight: 700 }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          <input
            checked={exactMatch}
            style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--sacred-gold)" }}
            type="checkbox"
            onChange={(e) => setExactMatch(e.target.checked)}
          />
          Exact phrase match
        </label>

        {!exactMatch && keywords.length > 0 && (
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginLeft: "auto",
            }}
          >
            Ranked by how many keywords match
          </span>
        )}
      </div>

      {/* ── No results ─────────────────────────────────────────────────── */}
      {results.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-mid)",
            borderRadius: "16px",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "16px", opacity: 0.3 }}>☾</div>
          <p
            style={{
              fontSize: "18px",
              color: "var(--text-primary)",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            No verses found
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {exactMatch
              ? "Try disabling exact phrase match to search by individual keywords."
              : "Try different keywords or switch to a specific surah."}
          </p>
          {exactMatch && (
            <button
              style={{
                marginTop: "16px",
                background: "var(--sacred-gold-dim)",
                border: "1px solid rgba(184, 134, 11, 0.35)",
                borderRadius: "8px",
                padding: "8px 18px",
                color: "var(--sacred-gold)",
                fontSize: "13px",
                cursor: "pointer",
              }}
              type="button"
              onClick={() => setExactMatch(false)}
            >
              Switch to keyword search
            </button>
          )}
        </div>
      ) : (
        /* ── Results list ─────────────────────────────────────────────── */
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {results.map(({ entry, matchedWords, score }) => {
            const totalKeywords = keywords.length;
            const matchPct = totalKeywords > 0 ? Math.round((score / totalKeywords) * 100) : 100;

            return (
              <Link
                key={entry.id}
                href={`/surah/${entry.surahNumber}#verse-${entry.verseNumber}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "22px 24px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-mid)",
                    borderRadius: "16px",
                    transition: "background 0.2s, border-color 0.2s, transform 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--bg-card-hover)";
                    e.currentTarget.style.borderColor = "rgba(184, 134, 11, 0.4)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--bg-card)";
                    e.currentTarget.style.borderColor = "var(--border-mid)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* ── Result header ──────────────────────────────────── */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "14px",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                      {/* Surah badge */}
                      <span
                        style={{
                          background: "var(--sacred-gold-dim)",
                          border: "1px solid rgba(184, 134, 11, 0.32)",
                          color: "var(--sacred-gold)",
                          borderRadius: "99px",
                          padding: "3px 12px",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {entry.englishName}
                      </span>

                      {/* Verse badge */}
                      <span
                        style={{
                          background: "var(--sacred-green-dim)",
                          border: "1px solid rgba(74, 107, 93, 0.32)",
                          color: "var(--sacred-green)",
                          borderRadius: "99px",
                          padding: "3px 12px",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {entry.surahNumber}:{entry.verseNumber}
                      </span>

                      {/* Match quality (only for multi-keyword) */}
                      {totalKeywords > 1 && (
                        <span
                          style={{
                            background:
                              matchPct === 100
                                ? "var(--sacred-gold-dim)"
                                : "var(--bg-card)",
                            border: `1px solid ${
                              matchPct === 100
                                ? "rgba(184, 134, 11, 0.28)"
                                : "var(--border-subtle)"
                            }`,
                            color: matchPct === 100 ? "var(--sacred-gold)" : "var(--text-muted)",
                            borderRadius: "99px",
                            padding: "3px 10px",
                            fontSize: "11px",
                          }}
                        >
                          {score}/{totalKeywords} keywords
                        </span>
                      )}
                    </div>

                    <span style={{ fontSize: "13px", color: "var(--sacred-gold)", fontWeight: "500" }}>
                      View verse →
                    </span>
                  </div>

                  {/* ── Arabic text ────────────────────────────────────── */}
                  <p
                    style={{
                      fontSize: "22px",
                      fontFamily: "var(--font-arabic)",
                      textAlign: "right",
                      color: "var(--text-primary)",
                      lineHeight: 1.8,
                      marginBottom: "14px",
                      direction: "rtl",
                    }}
                  >
                    {entry.arabicText}
                  </p>

                  {/* ── Translation with keyword highlights ────────────── */}
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.75,
                      color: "var(--text-secondary)",
                      margin: 0,
                      paddingTop: "12px",
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    {highlightKeywords(
                      entry.translation,
                      exactMatch ? [] : matchedWords,
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SearchPage = () => (
  <Suspense
    fallback={
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        Loading search…
      </div>
    }
  >
    <SearchPageInner />
  </Suspense>
);

export default SearchPage;
