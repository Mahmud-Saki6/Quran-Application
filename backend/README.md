# Quran backend (Hono + Node.js + SQLite)

Serves JSON APIs consumed by the Next.js app. Quran text and translations are **loaded from SQLite** via Node’s built-in **`node:sqlite`** (no native addons). Data is seeded from the same generated files as the frontend (`frontend/lib/generated/*.json`).

**Requirements:** Node.js **≥ 22.5** (for `node:sqlite`). You may see an experimental SQLite warning; it is safe to ignore for local development.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/surahs` | All surah summaries |
| `GET` | `/api/surah/:number` | One surah with `ayahs` |
| `GET` | `/api/search?q=&surah=` | Search English translations |
| `GET` | `/api/verse/:surah/:verse/words` | Word list + audio URLs (cached in SQLite after first request) |

Word audio metadata is fetched **on the server only** on cache miss, then stored under `data/quran.sqlite` so the browser never calls the upstream Quran API.

## Setup

```bash
# From repo root: generate JSON (if not already)
cd frontend && node ./scripts/generate-static-data.mjs

# Seed the database
cd ../backend && npm install && npm run seed

# Run API (default http://localhost:3001)
npm run dev
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | HTTP port |

The Next.js dev server rewrites `/api/*` to this backend (see `frontend/next.config.js` and `BACKEND_URL`).

## Bun

You can run the same code with Bun if you prefer (`bun install`, `bun run src/index.ts`); the project uses Node + `tsx` by default for portability.
