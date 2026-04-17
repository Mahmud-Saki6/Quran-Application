/**
 * Bridges full-verse MP3 timing (VerseAudio) with word-by-word UI (WordByWordVerse).
 * Word count must match the number of `isWord` tokens shown in the row.
 */

const counts = new Map<string, number>();

const key = (surah: number, verse: number) => `${surah}:${verse}`;

export function setVerseArabicWordCount(surah: number, verse: number, count: number): void {
  if (count > 0) counts.set(key(surah, verse), count);
  else counts.delete(key(surah, verse));
}

export function clearVerseArabicWordCount(surah: number, verse: number): void {
  counts.delete(key(surah, verse));
}

export function getVerseArabicWordCount(surah: number, verse: number): number | undefined {
  return counts.get(key(surah, verse));
}

export const VERSE_ARABIC_RECITATION_WORD = "surahflow:verse-arabic-recitation-word";
export const VERSE_ARABIC_RECITATION_END = "surahflow:verse-arabic-recitation-end";

export type VerseArabicRecitationWordDetail = {
  surahNumber: number;
  verseNumber: number;
  /** 1-based index among Arabic word tokens in the row */
  wordPosition: number;
};

export type VerseArabicRecitationEndDetail = {
  surahNumber: number;
  verseNumber: number;
};
