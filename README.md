# e-Quran — Glassmorphism Quran Reader

A production-ready Quran web application built with **Next.js 16 App Router**, **Tailwind CSS**, and **TypeScript**. All 114 surahs are statically pre-rendered at build time using data fetched directly from the [AlQuran Cloud API](https://api.alquran.cloud/v1/).

## Features

- All 114 surahs with Arabic text + English translation (Muhammad Asad)
- Full-text search across every English verse
- Reader settings (Arabic font family, font size) persisted in localStorage
- Glassmorphism UI throughout (backdrop-blur, glass cards, glow effects)
- Fully responsive (mobile, tablet, desktop)
- Static export — zero server required at runtime

---

## Run Locally

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Build (generates Quran JSON + static export)
npm run build

# 3. Preview the production build
npm run start
# → http://localhost:3000
```

For hot-reload development:
```bash
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel (Free)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: e-Quran app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quran-app.git
git push -u origin main
```

### Step 2 — Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Set these settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
4. Click **Deploy**

Vercel gives you a live URL like `https://quran-app-xxx.vercel.app`

---

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Framework | Next.js 16 (App Router, SSG) |
| Language | TypeScript                    |
| Styling  | Tailwind CSS 3 only           |
| Fonts    | Scheherazade New, Amiri, Noto Naskh Arabic |
| Data     | AlQuran Cloud API (build time) |

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx            Root layout + settings provider
│   ├── page.tsx              Surah list (SSG)
│   ├── surah/[number]/       Ayat pages (SSG — all 114 pre-rendered)
│   ├── search/               Full-text search
│   └── components/           Header, VerseItem, SurahCard, SearchBar, SettingsSidebar
├── context/
│   └── SettingsContext.tsx   Font/size settings persisted to localStorage
├── lib/
│   ├── api.ts                Direct Quran API fetch helpers
│   ├── types.ts              TypeScript interfaces
│   ├── settings.ts           localStorage helpers
│   └── generated/            JSON generated at build time (gitignored)
├── scripts/
│   └── generate-static-data.mjs   Fetches all 114 surahs + builds search index
├── styles/globals.css        Glassmorphism utilities + custom scrollbar
├── tailwind.config.js
└── next.config.js            output: 'export'
```
