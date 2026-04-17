"use client";

import { memo, useState } from "react";

import VerseAudio from "@/app/components/VerseAudio";
import WordByWordVerse from "@/app/components/WordByWordVerse";
import type { Verse } from "@/lib/types";

interface VerseItemProps {
  index: number;
  surahNumber: number;
  surahEnglishName: string;
  surahName: string;
  verse: Verse;
}

const VerseItemComponent = ({
  index,
  surahNumber,
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

        {/* Arabic: speaker EXTREME LEFT + Arabic content on the right */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <div style={{ flex: "0 0 auto" }}>
            <VerseAudio
              kind="arabic"
              arabicText={verse.arabicText}
              englishTranslation={verse.translation}
              surahNumber={surahNumber}
              verseNumber={verse.numberInSurah}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <WordByWordVerse
              arabicText={verse.arabicText}
              surahNumber={surahNumber}
              verseNumber={verse.numberInSurah}
            />
          </div>
        </div>

        {/* English: text LEFT, speaker EXTREME RIGHT */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            marginTop: "18px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <p className="translation-text" style={{ flex: 1, margin: 0, textAlign: "left" }}>
            {verse.translation}
          </p>

          <div style={{ flex: "0 0 auto" }}>
            <VerseAudio
              kind="english"
              arabicText={verse.arabicText}
              englishTranslation={verse.translation}
              surahNumber={surahNumber}
              verseNumber={verse.numberInSurah}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

const VerseItem = memo(VerseItemComponent);

export default VerseItem;
