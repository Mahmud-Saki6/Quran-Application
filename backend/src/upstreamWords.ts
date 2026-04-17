/**
 * One-time / on-demand fetch of word segmentation + audio paths.
 * Runs only on the server; results are stored in SQLite so the browser never calls this URL.
 */
const QURAN_WORDS_API_BASE = "https://api.quran.com/api/v4/verses/by_key";
const QURAN_AUDIO_CDN_BASE = "https://audio.qurancdn.com";

import type { ArabicWordAudioToken } from "./types.js";

interface QuranWordApiResponse {
  verse?: {
    words?: Array<{
      id?: number;
      position?: number;
      audio_url?: string | null;
      char_type_name?: string;
      text_uthmani?: string;
      text?: string;
    }>;
  };
}

const buildAudioUrl = (audioPath?: string | null): string | null => {
  if (!audioPath) return null;
  if (/^https?:\/\//i.test(audioPath)) return audioPath;
  return `${QURAN_AUDIO_CDN_BASE}/${audioPath.replace(/^\/+/, "")}`;
};

export const fetchVerseWordsFromUpstream = async (
  surahNumber: number,
  verseNumber: number,
): Promise<ArabicWordAudioToken[]> => {
  const verseKey = `${surahNumber}:${verseNumber}`;
  const response = await fetch(
    `${QURAN_WORDS_API_BASE}/${verseKey}?words=true&word_fields=audio_url,text_uthmani`,
    { headers: { Accept: "application/json" } },
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as QuranWordApiResponse;
  const rawWords = data.verse?.words ?? [];
  const wordTokens = rawWords.filter((w) => w.char_type_name === "word");

  return wordTokens
    .map((word, index) => ({
      id: word.id ?? index + 1,
      position: index + 1,
      text: word.text_uthmani ?? word.text ?? "",
      audioUrl: buildAudioUrl(word.audio_url),
    }))
    .filter((word) => word.text.length > 0);
};
