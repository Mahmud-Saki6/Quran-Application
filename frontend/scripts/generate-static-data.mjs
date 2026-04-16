import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = "https://api.alquran.cloud/v1";
const OUTPUT_DIRECTORY = path.join(__dirname, "..", "lib", "generated");
const CONCURRENCY = 2;
const REQUEST_DELAY_MS = 350;
const MAX_RETRIES = 5;

const sleep = (duration) =>
  new Promise((resolve) => {
    setTimeout(resolve, duration);
  });

const fetchJson = async (url, attempt = 0) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 429 && attempt < MAX_RETRIES) {
    const retryAfterHeader = Number(response.headers.get("retry-after") ?? 0);
    const retryDelay = retryAfterHeader > 0 ? retryAfterHeader * 1000 : 1200 * (attempt + 1);

    await sleep(retryDelay);
    return fetchJson(url, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status}).`);
  }

  return response.json();
};

const runInBatches = async (items, batchSize, worker) => {
  const results = [];

  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    const batchResults = await Promise.all(batch.map(worker));
    results.push(...batchResults);
    await sleep(REQUEST_DELAY_MS);
  }

  return results;
};

const main = async () => {
  await mkdir(OUTPUT_DIRECTORY, { recursive: true });

  const surahListResponse = await fetchJson(`${API_BASE_URL}/surah`);
  const surahSummaries = surahListResponse.data.map((surah) => ({
    number: surah.number,
    name: surah.name,
    englishName: surah.englishName,
    englishNameTranslation: surah.englishNameTranslation,
    revelationType: surah.revelationType,
    numberOfAyahs: surah.numberOfAyahs,
  }));

  const surahNumbers = surahSummaries.map((surah) => surah.number);

  const surahDetails = await runInBatches(
    surahNumbers,
    CONCURRENCY,
    async (surahNumber) => {
      const response = await fetchJson(
        `${API_BASE_URL}/surah/${surahNumber}/editions/en.asad,ar.alafasy`,
      );

      const editions = response.data;
      const arabicEdition = editions.find(
        (edition) => edition.edition?.language === "ar",
      );
      const englishEdition = editions.find(
        (edition) => edition.edition?.language === "en",
      );

      if (!arabicEdition || !englishEdition) {
        throw new Error(`Missing Arabic or English edition for surah ${surahNumber}.`);
      }

      return {
        number: arabicEdition.number,
        name: arabicEdition.name,
        englishName: arabicEdition.englishName,
        englishNameTranslation: arabicEdition.englishNameTranslation,
        revelationType: arabicEdition.revelationType,
        numberOfAyahs: arabicEdition.numberOfAyahs,
        ayahs: arabicEdition.ayahs.map((ayah, index) => ({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          juz: ayah.juz,
          page: ayah.page,
          arabicText: ayah.text,
          translation: englishEdition.ayahs[index]?.text ?? "",
        })),
      };
    },
  );

  const searchIndex = surahDetails.flatMap((surah) =>
    surah.ayahs.map((ayah) => ({
      id: `${surah.number}-${ayah.numberInSurah}`,
      surahNumber: surah.number,
      surahName: surah.name,
      englishName: surah.englishName,
      verseNumber: ayah.numberInSurah,
      arabicText: ayah.arabicText,
      translation: ayah.translation,
    })),
  );

  await Promise.all([
    writeFile(
      path.join(OUTPUT_DIRECTORY, "surahs.json"),
      JSON.stringify(surahSummaries, null, 2),
      "utf8",
    ),
    writeFile(
      path.join(OUTPUT_DIRECTORY, "surah-details.json"),
      JSON.stringify(surahDetails, null, 2),
      "utf8",
    ),
    writeFile(
      path.join(OUTPUT_DIRECTORY, "search-index.json"),
      JSON.stringify(searchIndex, null, 2),
      "utf8",
    ),
  ]);

  console.log("Generated Quran static data successfully.");
};

main().catch((error) => {
  console.error("Failed to generate Quran static data.", error);
  process.exit(1);
});
