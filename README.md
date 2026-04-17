# 📖 SurahFlow

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)
![SSG](https://img.shields.io/badge/SSG-success)

**A production-ready Quran web application with static generation, full-text search, and persistent reader settings.**

[Live Demo](https://surahflow.vercel.app) · [Report Bug](https://github.com/YOUR_USERNAME/surahflow/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Acknowledgments](#acknowledgments)

---

## 📖 Overview

**SurahFlow** is a modern Quran reading application built with Next.js 16's App Router and Static Site Generation (SSG). Surah pages are pre-rendered at build time from generated JSON. A separate **Node.js backend** (Hono + **SQLite**) serves `/api/*` routes: the Next.js dev server **rewrites** browser requests from `http://localhost:3000/api/...` to the backend (default `http://127.0.0.1:3001`). The database is **seeded** from the same JSON files the build uses (`frontend/lib/generated`).

The application features a glassmorphism UI, responsive design across all devices, and full-text search across English translations. Reader preferences are persisted locally using `localStorage`.

---

## ✨ Features

### Core Reading
- All 114 surahs with Arabic text and English translation
- Verse-by-verse display with numbered navigation
- Bismillah display for all surahs except At-Tawbah (Chapter 9)
- Previous/Next surah navigation

### Search Functionality
- Full-text search across all English verses
- Debounced search input (300ms)
- Highlighted search results with context
- Filter by surah and exact word matching

### Reader Settings
- Arabic font selection (Scheherazade New, Amiri, Noto Naskh Arabic)
- Arabic font size adjustment (16px–40px)
- Translation font size adjustment (12px–28px)
- Settings persisted in `localStorage`

### UI/UX
- Glassmorphism design with backdrop-blur effects
- Responsive grid layout (1–4 columns based on screen size)
- Smooth hover animations and transitions
- Loading skeletons for async operations

### Performance
- SSG pages generated at build time
- 118 pre-rendered pages (114 surahs + supporting pages)
- Build-time data via `generate-static-data.mjs` (online open Quran API)
- Optional SQLite-backed API in `/backend` (surahs/search seed); word-by-word audio uses Quran.com from the browser (`frontend/lib/wordAudio.ts`)

---

## ✅ Assignment / submission checklist

Use this to verify the brief before you submit (public GitHub repo, live demo, **≤5 min screen recording** — you must provide those three yourself).

| Requirement | Where it is implemented |
|-------------|---------------------------|
| **Database** (online / e.g. GitHub-style open data) | **SQLite** `backend/data/quran.sqlite`, **seeded** from JSON under `frontend/lib/generated/` produced at build time. Data is collected from the **public AlQuran Cloud API** in `frontend/scripts/generate-static-data.mjs` (same kind of open corpus many [GitHub Quran JSON](https://github.com/semarketir/quranjson) projects mirror). |
| **Backend** Node.js (Hono optional) | `backend/` — **Hono** + **Node** + **`node:sqlite`**, REST routes `/api/surahs`, `/api/surah/:n`, `/api/search`, optional `/api/verse/.../words`. |
| **Frontend** Next.js **SSG** | `app/surah/[number]/page.tsx` — `generateStaticParams` for all **114** surahs; home and search are static/client as built. |
| **Tailwind CSS** | `tailwind.config.js`, utility classes across `app/` and `components/`. |
| **Responsive UI** | Layout breakpoints (`sm:`, `md:`, `lg:`, etc.) on home grid, surah page, header, settings drawer (`SettingsSidebar`: full width on small screens). |
| **Surah list — 114 surahs, Arabic + English** | `app/page.tsx` + `SurahCard.tsx` — `surah.name` (Arabic), `surah.englishName`, `englishNameTranslation`. |
| **Ayah page — Arabic + translation** | `app/surah/[number]/page.tsx` + `VerseItem.tsx` — `arabicText` + `translation` per verse. |
| **Search** (by translation text) | `app/search/page.tsx` — searches English translation text; optional surah filter. |
| **Settings sidebar** | `SettingsSidebar.tsx` + `SettingsContext.tsx` — **≥2 Arabic fonts** (three options), **Arabic font size**, **translation font size**, pronunciation options; **`localStorage`** via `lib/settings.ts` (`SETTINGS_STORAGE_KEY`). |

**You still need to submit:** (1) **public** GitHub repository URL, (2) **Vercel or Netlify** live URL (test in **incognito**), (3) **screen recording** (max 5 minutes) showing list → surah → search → settings persistence.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16 (App Router) | SSG, routing, build system |
| **Backend** | Node.js + Hono + SQLite (`/backend`) | Optional REST API; seed from generated JSON |
| **Language** | TypeScript 5.0 | Type safety, better DX |
| **Styling** | Tailwind CSS 3 | Utility-first styling |
| **Fonts** | Google Fonts / @fontsource | Scheherazade New, Amiri, Inter |
| **Data Source** | Build-time JSON (`generate-static-data.mjs`) + optional SQLite API | Quran text and translations |
| **Word audio** | Quran.com API (client, `wordAudio.ts`) | Per-word clips when pronunciation is enabled |
| **Persistence** | localStorage | User settings storage |
| **Deployment** | Vercel (frontend) + optional backend host | Set `BACKEND_URL` / `NEXT_PUBLIC_API_URL` if API is remote |

---

## 📁 Project Structure
backend/
├── src/index.ts # Hono app + `@hono/node-server`
├── src/db.ts # SQLite access + word cache
├── scripts/seed.ts # Import `frontend/lib/generated` into SQLite
├── data/quran.sqlite # Created by `npm run seed` (gitignored)
└── package.json

frontend/
├── app/
│ ├── layout.tsx # Root layout with providers
│ ├── page.tsx # Surah list page (SSG)
│ ├── surah/[number]/ # Individual surah pages (SSG)
│ │ ├── page.tsx
│ │ └── loading.tsx
│ ├── search/page.tsx # Search results page
│ └── components/
│ ├── Header.tsx # App header with search
│ ├── SettingsSidebar.tsx # Settings panel (drawer)
│ ├── SurahCard.tsx # Individual surah card
│ ├── VerseItem.tsx # Individual verse display
│ └── SearchBar.tsx # Search input with debounce
├── context/
│ └── SettingsContext.tsx # Global settings state + localStorage
├── lib/
│ ├── api.ts # Quran API fetch helpers
│ ├── types.ts # TypeScript interfaces
│ └── settings.ts # localStorage utilities
├── styles/
│ └── globals.css # Global styles + glassmorphism utilities
├── public/ # Static assets
├── scripts/
│ └── generate-static-data.mjs # Build-time data generator
├── next.config.js # Next.js config
├── tailwind.config.js # Tailwind configuration
├── package.json
└── tsconfig.json

---

## 🚀 Getting Started

### Prerequisites

- Node.js **22.5+** recommended (backend uses `node:sqlite`; frontend runs on Node 18+)
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/surahflow.git
cd surahflow

# Install dependencies (frontend + backend)
npm run install:all

# Generate JSON and seed the database (first time / after clone)
cd frontend && node ./scripts/generate-static-data.mjs && cd ..
npm run seed:db

# Run Next.js + backend together (backend must be on :3001 for rewrites)
npm run dev

# Build for production
npm run build

# Start production Next server (point BACKEND_URL at your deployed API if needed)
npm run start
```

App: `http://localhost:3000`  
API (proxied): `http://localhost:3000/api/surahs` → backend `http://127.0.0.1:3001/api/surahs`

Set `BACKEND_URL` in the environment when the API runs on a different host (see `frontend/next.config.js`).