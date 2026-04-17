import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

import type { ArabicWordAudioToken } from "./types.js";
import { fetchVerseWordsFromUpstream } from "./upstreamWords.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "quran.sqlite");

let db: DatabaseSync | null = null;

export const getDb = (): DatabaseSync => {
  if (!db) {
    mkdirSync(dataDir, { recursive: true });
    const database = new DatabaseSync(dbPath);
    database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS surahs (
        number INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        english_name TEXT NOT NULL,
        english_name_translation TEXT NOT NULL,
        revelation_type TEXT NOT NULL,
        number_of_ayahs INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS verses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surah_number INTEGER NOT NULL,
        number_in_surah INTEGER NOT NULL,
        verse_number INTEGER NOT NULL,
        juz INTEGER,
        page INTEGER,
        arabic_text TEXT NOT NULL,
        translation TEXT NOT NULL,
        UNIQUE(surah_number, number_in_surah),
        FOREIGN KEY (surah_number) REFERENCES surahs(number)
      );

      CREATE INDEX IF NOT EXISTS idx_verses_surah ON verses(surah_number);
      CREATE INDEX IF NOT EXISTS idx_verses_translation ON verses(translation);

      CREATE TABLE IF NOT EXISTS verse_words (
        surah_number INTEGER NOT NULL,
        verse_number INTEGER NOT NULL,
        position INTEGER NOT NULL,
        text_uthmani TEXT NOT NULL,
        audio_url TEXT,
        PRIMARY KEY (surah_number, verse_number, position)
      );
    `);
    db = database;
  }
  return db;
};

export interface SurahRow {
  number: number;
  name: string;
  english_name: string;
  english_name_translation: string;
  revelation_type: string;
  number_of_ayahs: number;
}

export interface VerseRow {
  number: number;
  numberInSurah: number;
  juz: number | null;
  page: number | null;
  arabicText: string;
  translation: string;
}

export const getSurahs = (): SurahRow[] => {
  const database = getDb();
  return database
    .prepare(
      `SELECT number, name, english_name, english_name_translation, revelation_type, number_of_ayahs
       FROM surahs ORDER BY number`,
    )
    .all() as unknown as SurahRow[];
};

export const getSurahByNumber = (number: number): { surah: SurahRow; ayahs: VerseRow[] } | null => {
  const database = getDb();
  const surah = database
    .prepare(
      `SELECT number, name, english_name, english_name_translation, revelation_type, number_of_ayahs
       FROM surahs WHERE number = ?`,
    )
    .get(number) as unknown as SurahRow | null;
  if (!surah) return null;

  const rows = database
    .prepare(
      `SELECT verse_number AS number, number_in_surah AS numberInSurah, juz, page, arabic_text AS arabicText, translation
       FROM verses WHERE surah_number = ? ORDER BY number_in_surah`,
    )
    .all(number) as unknown as VerseRow[];

  return { surah, ayahs: rows };
};

export const searchVerses = (
  query: string,
  surahFilter: number | null,
): { id: string; surahNumber: number; surahName: string; englishName: string; verseNumber: number; arabicText: string; translation: string }[] => {
  const database = getDb();
  const q = `%${query.toLowerCase()}%`;
  const rows =
    surahFilter && surahFilter > 0
      ? (database
          .prepare(
            `SELECT v.surah_number AS surahNumber, s.name AS surahName, s.english_name AS englishName,
                    v.number_in_surah AS verseNumber, v.arabic_text AS arabicText, v.translation
             FROM verses v
             JOIN surahs s ON s.number = v.surah_number
             WHERE v.surah_number = ? AND lower(v.translation) LIKE ?
             ORDER BY v.surah_number, v.number_in_surah`,
          )
          .all(surahFilter, q) as unknown as Record<string, unknown>[])
      : (database
          .prepare(
            `SELECT v.surah_number AS surahNumber, s.name AS surahName, s.english_name AS englishName,
                    v.number_in_surah AS verseNumber, v.arabic_text AS arabicText, v.translation
             FROM verses v
             JOIN surahs s ON s.number = v.surah_number
             WHERE lower(v.translation) LIKE ?
             ORDER BY v.surah_number, v.number_in_surah`,
          )
          .all(q) as unknown as Record<string, unknown>[]);

  return rows.map((row) => ({
    id: `${row.surahNumber}-${row.verseNumber}`,
    surahNumber: row.surahNumber as number,
    surahName: row.surahName as string,
    englishName: row.englishName as string,
    verseNumber: row.verseNumber as number,
    arabicText: row.arabicText as string,
    translation: row.translation as string,
  }));
};

const loadWordsFromDb = (surahNumber: number, verseNumber: number): ArabicWordAudioToken[] => {
  const database = getDb();
  const rows = database
    .prepare(
      `SELECT position, text_uthmani, audio_url FROM verse_words
       WHERE surah_number = ? AND verse_number = ? ORDER BY position`,
    )
    .all(surahNumber, verseNumber) as unknown as {
    position: number;
    text_uthmani: string;
    audio_url: string | null;
  }[];

  return rows.map((r) => ({
    id: surahNumber * 100000 + verseNumber * 1000 + r.position,
    position: r.position,
    text: r.text_uthmani,
    audioUrl: r.audio_url,
  }));
};

const storeWords = (
  surahNumber: number,
  verseNumber: number,
  words: ArabicWordAudioToken[],
): void => {
  const database = getDb();
  const insert = database.prepare(
    `INSERT OR REPLACE INTO verse_words (surah_number, verse_number, position, text_uthmani, audio_url)
     VALUES (?, ?, ?, ?, ?)`,
  );
  database.exec("BEGIN IMMEDIATE");
  try {
    for (let i = 0; i < words.length; i++) {
      const w = words[i]!;
      insert.run(surahNumber, verseNumber, i + 1, w.text, w.audioUrl);
    }
    database.exec("COMMIT");
  } catch (e) {
    database.exec("ROLLBACK");
    throw e;
  }
};

/** Returns cached words from SQLite, or fetches upstream once and persists (server-side only). */
export const getOrFetchVerseWords = async (
  surahNumber: number,
  verseNumber: number,
): Promise<ArabicWordAudioToken[]> => {
  const cached = loadWordsFromDb(surahNumber, verseNumber);
  if (cached.length > 0) return cached;

  const upstream = await fetchVerseWordsFromUpstream(surahNumber, verseNumber);
  if (upstream.length > 0) {
    storeWords(surahNumber, verseNumber, upstream);
  }
  return upstream;
};
