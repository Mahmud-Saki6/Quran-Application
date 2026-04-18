"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import surahsData from "@/lib/generated/surahs.json";
import type { SurahSummary } from "@/lib/types";

const surahs = surahsData as SurahSummary[];

const FacebookIcon = () => (
  <svg aria-hidden className="app-footer__social-svg" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg aria-hidden className="app-footer__social-svg" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    />
  </svg>
);

/** Official-style Instagram glyph — solid, high contrast at small sizes */
const InstagramIcon = () => (
  <svg aria-hidden className="app-footer__social-svg app-footer__social-svg--ig" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
    />
  </svg>
);

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [surahMenuOpen, setSurahMenuOpen] = useState(false);

  const activeSurah = useMemo(() => {
    const m = pathname?.match(/^\/surah\/(\d+)/);
    return m ? Number(m[1]) : null;
  }, [pathname]);

  const activeSurahLabel = useMemo(() => {
    if (!activeSurah) return "Jump to…";
    const s = surahs.find((x) => x.number === activeSurah);
    if (!s) return "Jump to…";
    return `${s.number}. ${s.englishName}`;
  }, [activeSurah]);

  useEffect(() => {
    if (!surahMenuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const root = dropdownRef.current;
      if (!root) return;
      if (root.contains(e.target as Node)) return;
      setSurahMenuOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSurahMenuOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [surahMenuOpen]);

  const goToSurah = (n: number) => {
    setSurahMenuOpen(false);
    router.push(`/surah/${n}/`);
  };

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__top">
          <Link className="app-footer__brand-stack" href="/">
            <div className="app-header-logo-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold sm:h-9 sm:w-9 sm:text-sm md:h-10 md:w-10">
              ﷽
            </div>
            <span className="gradient-text app-footer__name">SurahFlow</span>
          </Link>

          <div className="app-footer__socials" aria-label="Social links">
            <a
              aria-label="SurahFlow on Facebook"
              className="app-footer__social-link"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FacebookIcon />
            </a>
            <a
              aria-label="SurahFlow on X (Twitter)"
              className="app-footer__social-link"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              <TwitterIcon />
            </a>
            <a
              aria-label="SurahFlow on Instagram"
              className="app-footer__social-link"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              <InstagramIcon />
            </a>
          </div>

          <nav aria-label="Jump to surah" className="app-footer__nav-surah">
            <div className="app-footer__surah-wrap" ref={dropdownRef}>
              <button
                type="button"
                aria-label="Jump to surah"
                aria-haspopup="listbox"
                aria-expanded={surahMenuOpen}
                className="app-footer__surah-select app-footer__surah-select-btn"
                onClick={() => setSurahMenuOpen((v) => !v)}
              >
                <span className="app-footer__surah-select-text">{activeSurahLabel}</span>
              </button>

              {surahMenuOpen ? (
                <div className="app-footer__surah-popover" role="listbox" aria-label="Surah list">
                  {surahs.map((s) => {
                    const selected = s.number === activeSurah;
                    return (
                      <button
                        key={s.number}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className="app-footer__surah-option"
                        onClick={() => goToSurah(s.number)}
                      >
                        {s.number}. {s.englishName}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </nav>
        </div>

        <p className="app-footer__copyright-row">
        © 2026 SurahFlow — Gazi Mahmud Sakib
        </p>
      </div>
    </footer>
  );
};

export default Footer;
