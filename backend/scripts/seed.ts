/**
 * Loads surahs and verses from the same JSON the frontend build generates
 * (`frontend/lib/generated`). Run after `npm run build` in frontend, or run
 * `node frontend/scripts/generate-static-data.mjs` first.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getDb } from "../src/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generatedDir = path.join(__dirname, "..", "..", "frontend", "lib", "generated");

const surahsPath = path.join(generatedDir, "surahs.json");
const detailsPath = path.join(generatedDir, "surah-details.json");

if (!existsSync(surahsPath) || !existsSync(detailsPath)) {
  console.error(
    "Missing generated JSON. From the repo root run:\n  cd frontend && node ./scripts/generate-static-data.mjs\nThen: cd backend && npm run seed",
  );
  process.exit(1);
}

interface SurahSummaryJson {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

interface AyahJson {
  number: number;
  numberInSurah: number;
  juz?: number;
  page?: number;
  arabicText: string;
  translation: string;
}

interface SurahDetailJson extends SurahSummaryJson {
  ayahs: AyahJson[];
}

const surahs = JSON.parse(readFileSync(surahsPath, "utf8")) as SurahSummaryJson[];
const surahDetails = JSON.parse(readFileSync(detailsPath, "utf8")) as SurahDetailJson[];

const db = getDb();

db.exec("DELETE FROM verses");
db.exec("DELETE FROM surahs");

const insertSurah = db.prepare(
  `INSERT INTO surahs (number, name, english_name, english_name_translation, revelation_type, number_of_ayahs)
   VALUES (?, ?, ?, ?, ?, ?)`,
);

const insertVerse = db.prepare(
  `INSERT INTO verses (surah_number, number_in_surah, verse_number, juz, page, arabic_text, translation)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
);

db.exec("BEGIN IMMEDIATE");
try {
  for (const s of surahs) {
    insertSurah.run(
      s.number,
      s.name,
      s.englishName,
      s.englishNameTranslation,
      s.revelationType,
      s.numberOfAyahs,
    );
  }

  for (const detail of surahDetails) {
    for (const ayah of detail.ayahs) {
      insertVerse.run(
        detail.number,
        ayah.numberInSurah,
        ayah.number,
        ayah.juz ?? null,
        ayah.page ?? null,
        ayah.arabicText,
        ayah.translation,
      );
    }
  }
  db.exec("COMMIT");
} catch (e) {
  db.exec("ROLLBACK");
  throw e;
}

console.log(`Seeded ${surahs.length} surahs and verses into ${path.join("backend", "data", "quran.sqlite")}.`);
