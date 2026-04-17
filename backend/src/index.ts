import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";

import {
  getOrFetchVerseWords,
  getSurahByNumber,
  getSurahs,
  searchVerses,
  type SurahRow,
} from "./db.js";

const app = new Hono();

app.use("/*", cors({ origin: "*" }));

const mapSurahSummary = (row: SurahRow) => ({
  number: row.number,
  name: row.name,
  englishName: row.english_name,
  englishNameTranslation: row.english_name_translation,
  revelationType: row.revelation_type,
  numberOfAyahs: row.number_of_ayahs,
});

app.get("/api/surahs", (c) => {
  const rows = getSurahs();
  return c.json({ data: rows.map(mapSurahSummary) });
});

app.get("/api/surah/:number", (c) => {
  const number = Number(c.req.param("number"));
  if (!Number.isFinite(number) || number < 1 || number > 114) {
    return c.json({ error: "Surah not found" }, 404);
  }
  const result = getSurahByNumber(number);
  if (!result) {
    return c.json({ error: "Surah not found" }, 404);
  }
  const { surah, ayahs } = result;
  return c.json({
    data: {
      ...mapSurahSummary(surah),
      ayahs,
    },
  });
});

app.get("/api/search", (c) => {
  const query = (c.req.query("q") ?? "").trim().toLowerCase();
  const surahParam = c.req.query("surah");
  let surahFilter: number | null = null;
  if (surahParam !== undefined && surahParam !== "") {
    const n = Number(surahParam);
    if (Number.isFinite(n) && n > 0) surahFilter = n;
  }

  if (!query) {
    return c.json({ data: [], total: 0 });
  }

  const results = searchVerses(query, surahFilter);
  return c.json({ data: results, total: results.length });
});

const verseWordsRoute = async (c: Context) => {
  const surah = Number(c.req.param("surah"));
  const verse = Number(c.req.param("verse"));
  if (!Number.isFinite(surah) || !Number.isFinite(verse) || surah < 1 || surah > 114) {
    return c.json({ data: [] });
  }
  const words = await getOrFetchVerseWords(surah, verse);
  return c.json({ data: words });
};

/** Next.js `trailingSlash: true` may request `/words/` — support both. */
app.get("/api/verse/:surah/:verse/words", verseWordsRoute);
app.get("/api/verse/:surah/:verse/words/", verseWordsRoute);

const port = Number(process.env.PORT) || 3001;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Quran backend listening on http://localhost:${info.port}`);
});
