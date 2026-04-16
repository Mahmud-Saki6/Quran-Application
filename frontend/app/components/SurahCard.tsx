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
      className="group animate-fade-in"
      style={{
        display: "block",
        textDecoration: "none",
        animationDelay: `${index * 30}ms`,
      }}
    >
      <style>{`
        .surah-card {
          position: relative;
          z-index: 0;
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 28px 24px;
          border: 1px solid var(--border-mid);
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            filter 0.25s ease;
          cursor: pointer;
          overflow: hidden;
          box-shadow: var(--surah-base-shadow);
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
          z-index: 10;
          box-shadow: var(--surah-hover-shadow);
          border-color: var(--card-border-hover);
        }

        .surah-card:hover::before {
          opacity: 1;
        }

        .arabic-name {
          font-size: 32px;
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
          font-size: 18px;
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
          font-size: 13px;
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
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: var(--sacred-gold-dim);
          border: 1px solid rgba(184, 134, 11, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
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
          transform: scale(1.06);
          box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.12);
        }
      `}</style>

      <div className="surah-card">
        <div
          className="card-art-area"
          style={{
            margin: "-8px -8px 18px",
            padding: "12px 12px 10px",
            borderRadius: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div className="number-badge">{surah.number}</div>
            <span className={getRevelationColor(surah.revelationType)}>
              {surah.revelationType}
            </span>
          </div>

          <div className="arabic-name">{surah.name}</div>
        </div>

        <div>
          <div className="english-name">{surah.englishName}</div>
          <div className="surah-translation">{surah.englishNameTranslation}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {surah.numberOfAyahs} verses
          </span>
          <span
            className="arrow-icon"
            style={{
              fontSize: "13px",
              opacity: 0.95,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Read <span style={{ fontSize: "14px" }}>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SurahCard;
