import surahsData from "@/lib/generated/surahs.json";
import type { SurahSummary } from "@/lib/types";

const surahs = surahsData as SurahSummary[];

// 1-indexed prefix sums: prefix[i] = ayahs before surah i+1 (0 for surah 1)
const prefix: number[] = (() => {
  const out: number[] = [0];
  let sum = 0;
  for (const s of surahs) {
    out.push(sum);
    sum += s.numberOfAyahs;
  }
  return out;
})();

export const getGlobalAyahNumber = (surahNumber: number, verseNumber: number) => {
  const before = prefix[surahNumber] ?? 0;
  return before + verseNumber;
};

