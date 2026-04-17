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
      className="scroll-mt-24 flex flex-col overflow-hidden rounded-xl border border-[var(--border-subtle)] sm:flex-row sm:rounded-2xl"
      style={{
        background: isEven ? "var(--verse-bg-even)" : "var(--verse-bg-odd)",
        marginBottom: "4px",
      }}
    >
      {/* Left accent bar — verse number */}
      <div
        aria-label={`Verse ${verse.numberInSurah}`}
        className="flex w-full flex-none select-none items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] sm:w-14 sm:flex-col sm:items-center sm:justify-start sm:border-b-0 sm:border-r sm:px-0 sm:py-5 md:w-16 lg:w-20"
        style={{
          background: isEven ? "var(--verse-accent-even)" : "var(--verse-accent-odd)",
        }}
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--sacred-gold-dim)] text-xs font-bold text-[var(--sacred-gold)] sm:h-8 sm:w-8 sm:text-sm">
          {verse.numberInSurah}
        </span>
        <span className="sm:hidden" aria-hidden="true">
          Verse
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 sm:p-4 md:p-5">
        {/* Copy button */}
        <div className="mb-3 flex justify-end sm:mb-4">
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
        <div className="flex items-start gap-3 sm:gap-4">
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
        <div className="mt-4 flex items-start gap-3 border-t border-[var(--border-subtle)] pt-4 sm:mt-5 sm:gap-4">
          <p
            className="translation-text"
            style={{ flex: 1, margin: 0, textAlign: "left" }}
          >
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
