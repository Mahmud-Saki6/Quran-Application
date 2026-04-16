"use client";

import { memo, useState } from "react";

import type { Verse } from "@/lib/types";

interface VerseItemProps {
  index: number;
  surahEnglishName: string;
  surahName: string;
  verse: Verse;
}

const VerseItemComponent = ({
  index,
  surahEnglishName,
  surahName,
  verse,
}: VerseItemProps) => {
  const [copied, setCopied] = useState(false);

  const isEven = index % 2 === 0;

  const copyVerse = async () => {
    const verseText = `${surahEnglishName} (${surahName}) ${verse.numberInSurah}\n\n${verse.arabicText}\n\n${verse.translation}`;
    try {
      await navigator.clipboard.writeText(verseText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article
      id={`verse-${verse.numberInSurah}`}
      className="scroll-mt-24"
      style={{
        display: "flex",
        gap: 0,
        borderRadius: "12px",
        overflow: "hidden",
        background: isEven ? "var(--verse-bg-even)" : "var(--verse-bg-odd)",
        border: "1px solid var(--border-subtle)",
        marginBottom: "4px",
      }}
    >
      {/* Left accent bar — verse number */}
      <div
        aria-label={`Verse ${verse.numberInSurah}`}
        style={{
          width: "44px",
          flexShrink: 0,
          background: isEven ? "var(--verse-accent-even)" : "var(--verse-accent-odd)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "20px",
          fontSize: "11px",
          color: "var(--text-muted)",
          fontWeight: "600",
          userSelect: "none",
        }}
      >
        {verse.numberInSurah}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "16px 20px" }}>
        {/* Copy button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
          <button
            aria-label={`Copy verse ${verse.numberInSurah}`}
            className="glass-button"
            style={{ height: "32px", fontSize: "12px", padding: "0 12px" }}
            type="button"
            onClick={copyVerse}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        {/* Arabic text */}
        <p className="arabic-text">{verse.arabicText}</p>

        {/* English translation — sizes from CSS vars (pre-hydration + Settings) */}
        <p
          className="translation-text"
          style={{
            marginTop: "14px",
            paddingTop: "14px",
            borderTop: "1px solid var(--border-subtle)",
            lineHeight: 1.75,
            textAlign: "left",
          }}
        >
          {verse.translation}
        </p>
      </div>
    </article>
  );
};

const VerseItem = memo(VerseItemComponent);

export default VerseItem;
