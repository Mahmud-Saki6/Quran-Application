"use client";

import Link from "next/link";

import type { SurahSummary } from "@/lib/types";

interface SurahCardProps {
  surah: SurahSummary;
  index?: number;
}

/** Meccan: terracotta warmth · Medinan: sage calm */
const getRevelationColor = (type: string) =>
  type === "Meccan" ? "badge-ruby" : "badge-green";

const SurahCard = ({ surah, index = 0 }: SurahCardProps) => {
  return (
    <Link
      href={`/surah/${surah.number}`}
      className="group animate-fade-in h-full w-full"
      style={{
        display: "block",
        textDecoration: "none",
        animationDelay: `${index * 30}ms`,
        /*
         * FIX: contain the stacking context so hover transforms on THIS card
         * never affect sibling layout. isolation:isolate + will-change:transform
         * promotes the element to its own compositor layer — transforms happen
         * entirely on the GPU and never trigger a reflow of adjacent cards.
         */
        isolation: "isolate",
        willChange: "transform",
      }}
    >
      <style>{`
        .surah-card {
          position: relative;
          z-index: 0;
          background: var(--bg-card);
          backdrop-filter: blur(var(--card-blur));
          -webkit-backdrop-filter: blur(var(--card-blur));
          border-radius: 24px;
          border: 1px solid var(--border-mid);
          cursor: pointer;
          overflow: hidden;
          box-shadow: var(--surah-base-shadow);
          height: 100%;
          display: flex;
          flex-direction: column;

          /*
           * Dark-mode hover glitch fix:
           * backdrop-filter + hover transform in a dense grid can trigger
           * compositor tiling artifacts where nearby cards briefly show “blocks”.
           * We avoid transforms on the blurred element and contain paint instead.
           */
          contain: paint;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: box-shadow, border-color;
          transition:
            box-shadow 0.32s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.22s ease;
        }

        .surah-card > * {
          position: relative;
          z-index: 1;
        }

        .surah-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 2px;
          background: var(--gradient-gold-green);
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 0;
        }

        .surah-card:hover {
          /*
           * No transforms here (prevents backdrop-filter compositor artifacts).
           */
          box-shadow: var(--surah-hover-shadow);
          border-color: var(--card-border-hover);
          z-index: 10;
        }

        .surah-card:hover::before {
          opacity: 1;
        }

        /* Active/press feedback — also scale-free */
        .surah-card:active {
          transition-duration: 0.12s;
        }

        .arabic-name {
          font-family: var(--font-arabic);
          color: var(--text-primary);
          text-align: right;
          line-height: 1.4;
          margin-bottom: 16px;
          transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.05);
        }

        .surah-card:hover .arabic-name {
          background: var(--gradient-gold-green);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transform: translateX(-3px);
        }

        .english-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
          transition:
            color 0.35s ease,
            transform 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.05);
        }

        .surah-card:hover .english-name {
          color: var(--sacred-gold);
          transform: translateX(3px);
        }

        .surah-translation {
          color: var(--text-muted);
          margin-bottom: 12px;
          transition: color 0.35s ease;
        }

        .surah-card:hover .surah-translation {
          color: var(--text-secondary);
        }

        .arrow-icon {
          transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.05);
          color: var(--sacred-gold);
        }

        .surah-card:hover .arrow-icon {
          transform: translateX(6px);
        }

        .number-badge {
          border-radius: 14px;
          background: var(--sacred-gold-dim);
          border: 1px solid rgba(184, 134, 11, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--sacred-gold);
          transition:
            transform 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.05),
            background 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease;
        }

        .surah-card:hover .number-badge {
          background: rgba(184, 134, 11, 0.15);
          border-color: var(--sacred-gold-light);
          transform: scale(1.04);
          box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.12);
        }
      `}</style>

      <div className="surah-card">
        <div className="flex h-full flex-1 flex-col p-3 sm:p-4 lg:p-5 xl:p-6">
          <div
            className="card-art-area mb-4 rounded-2xl px-3 pb-2 pt-3 sm:mb-5"
            style={{ margin: "-8px -8px 18px" }}
          >
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <div className="number-badge h-7 w-7 text-[11px] sm:h-8 sm:w-8 sm:text-xs md:h-8 md:w-8 md:text-xs">
                {surah.number}
              </div>
              <span className={getRevelationColor(surah.revelationType)}>
                {surah.revelationType}
              </span>
            </div>

            <h3 className="arabic-name text-xl sm:text-2xl md:text-3xl lg:text-[30px] leading-relaxed">
              {surah.name}
            </h3>
          </div>

          <div>
            <h4 className="english-name text-sm sm:text-base md:text-lg">
              {surah.englishName}
            </h4>
            <p className="surah-translation text-xs sm:text-sm line-clamp-2">
              {surah.englishNameTranslation}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
            <span className="text-xs text-[var(--text-muted)]">
              {surah.numberOfAyahs} verses
            </span>
            <span className="arrow-icon flex items-center gap-1 text-xs opacity-95 sm:text-sm">
              Read <span className="text-sm">→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SurahCard;