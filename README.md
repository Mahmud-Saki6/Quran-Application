# SurahFlow

A responsive Quran reader built with **Next.js** and **TypeScript**. The app delivers all 114 surahs with Arabic text and English translation, optional audio, and reader settings persisted in the browser.

---

## What’s included

### Reading experience

- **Full Quran**: All surahs with Uthmani-style Arabic and English translation per verse.
- **Surah index**: Searchable grid with Meccan/Medinan filters, revelation counts, and quick navigation by name or number.
- **Surah view**: Verse-by-verse layout with surah number, alternating verse styling, and previous/next surah links.
- **Bismillah**: Shown where appropriate (excludes At-Tawbah).
- **Copy verse**: One action copies Arabic, translation, and citation.

### Search

- **Translation search** over English text using a client-side index generated at build time.
- **Keyword extraction** with stop-word filtering and highlighted matches in results.
- **Surah filter** to narrow results to a single chapter.

### Audio

- **Verse Arabic**: Full-ayah recitation (Mishary Alafasy, 128 kbps) via the Islamic Network CDN, with automatic fallback to speech synthesis if streaming fails.
- **Verse English**: Browser text-to-speech for the translation.
- **Word-by-word Arabic**: Interactive tokens aligned with the **Quran.com** verse words API; per-word audio clips when available, with sensible handling of pause marks and end-of-ayah symbols.
- **Recitation highlight**: While Arabic verse audio plays, the current word is highlighted in the word row using proportional timing (theme-aware gold accent and subtle underline).

Global `surahflow:stop-audio` coordination stops verse audio when starting word playback and vice versa.

### Appearance and settings

- **Light and dark themes** with CSS variables (Noor-inspired light palette; dark glass styling).
- **Arabic typography**: Three font choices (Scheherazade New, Amiri, Noto Naskh Arabic) and adjustable Arabic size (16px–40px).
- **Translation size**: Adjustable (12px–28px).
- **Pronunciation controls**: Enable or disable Arabic word audio; modes: click, hover, or both; speed presets (0.5x–1.2x).
- **Persistence**: Settings stored under `localStorage` (`quran_settings`).

### Technical delivery

- **Static site generation**: Surah routes and supporting pages are pre-rendered; verse content is bundled from generated JSON produced by `frontend/scripts/generate-static-data.mjs` (AlQuran Cloud–style open data at build time).
- **Optional backend**: Node.js + **Hono** + **SQLite** (`backend/`) exposes REST endpoints aligned with the seeded database; the Next.js dev server **rewrites** `/api/*` to the backend (default `http://127.0.0.1:3001`). The core UI works from static JSON without calling the backend for normal reading and search.

---

## Tech stack

| Area | Technology |
|------|------------|
| Frontend | Next.js 16 (App Router), React, TypeScript |
| Styling | Tailwind CSS 3, component-level CSS variables |
| Fonts | @fontsource (Scheherazade New, Amiri, Noto Naskh Arabic), Inter |
| Data | Build-time JSON under `frontend/lib/generated/` |
| Optional API | Hono, `node:sqlite`, REST |
| Audio sources | Islamic Network (verse MP3), Quran.com API (word metadata and clips in the browser), Web Speech API (fallbacks) |

---

## Repository layout

```
├── backend/                 # Hono server, SQLite access, seed script
├── frontend/
│   ├── app/                 # App Router pages and components
│   ├── context/             # Settings provider
│   ├── lib/                 # Settings, types, word/recitation helpers, API helpers
│   ├── scripts/             # generate-static-data.mjs
│   └── styles/              # globals.css (themes, verse/word UI)
├── package.json             # Root scripts (dev, build, install:all)
└── README.md
```

---

## Getting started

### Prerequisites

- **Node.js** 18+ (22+ recommended for `node:sqlite` on the backend)
- npm (or pnpm/yarn)

### Install and run

```bash
git clone <your-repo-url>
cd "Quran Application"

# Install frontend and backend dependencies
npm run install:all

# Generate static Quran JSON (required before build)
cd frontend && node ./scripts/generate-static-data.mjs && cd ..

# Optional: create and seed SQLite for the backend API
npm run seed:db

# Run backend (:3001) and frontend (:3000) together
npm run dev
```

Open **http://localhost:3000**. Requests to `/api/*` are proxied to the backend when it is running.

### Production build

```bash
npm run build
npm run start
```

Set **`BACKEND_URL`** if the API is not on `http://127.0.0.1:3001` (see `frontend/next.config.js`).

---

## API (optional backend)

When the backend is running and seeded, typical routes include:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/surahs` | List all surahs (summary) |
| GET | `/api/surah/:number` | Single surah with ayahs |
| GET | `/api/search?q=…&surah=…` | Search verses (SQLite) |
| GET | `/api/verse/:surah/:verse/words` | Cached verse word rows |

The static frontend primarily uses generated JSON; these routes support parity, tooling, or future features.

---

## Data and attribution

- Quran text and translations are ingested at **build time** from public APIs used by `generate-static-data.mjs`.
- **Verse audio** uses recordings identified as **Mishary Rashid Alafasy** on the Islamic Network CDN.
- **Word-level data and audio URLs** are fetched in the browser from **Quran.com**’s public API where applicable.

---

## License

Add a `LICENSE` file and update this section for your distribution terms.
