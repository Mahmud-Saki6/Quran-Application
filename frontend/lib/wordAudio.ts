const QURAN_WORDS_API_BASE = "https://api.quran.com/api/v4/verses/by_key";
const QURAN_AUDIO_CDN_BASE = "https://audio.qurancdn.com";

export interface VerseToken {
  id: number;
  text: string;
  audioUrl: string | null;
  isWord: boolean;
  position: number | null;
}

interface QuranWordApiResponse {
  verse?: {
    words?: Array<{
      id?: number;
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

/** True only if text contains actual Arabic letter codepoints — not just marks/symbols */
const hasArabicLetters = (text: string): boolean =>
  /[\u0600-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5]/.test(text);

const verseCache = new Map<string, Promise<VerseToken[]>>();

export const fetchVerseWords = async (
  surahNumber: number,
  verseNumber: number,
): Promise<VerseToken[]> => {
  const key = `${surahNumber}:${verseNumber}`;

  const existing = verseCache.get(key);
  if (existing) {
    const resolved = await existing;
    if (resolved.length > 0) return resolved;
    verseCache.delete(key);
  }

  const promise = (async (): Promise<VerseToken[]> => {
    const res = await fetch(
      `${QURAN_WORDS_API_BASE}/${key}?words=true&word_fields=audio_url,text_uthmani`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) throw new Error(`Quran.com words API ${res.status}`);

    const data = (await res.json()) as QuranWordApiResponse;
    const raw = data.verse?.words ?? [];

    let wordCount = 0;
    const out: VerseToken[] = [];

    for (let i = 0; i < raw.length; i++) {
      const w = raw[i]!;
      const text = w.text_uthmani ?? w.text ?? "";
      if (text.length === 0) continue;

      // A token is a real word only if the API says so AND it has actual Arabic letters.
      // Pause marks (ۚ ۗ ۖ ۛ) can arrive with char_type_name="word" but no letters.
      const isWord = w.char_type_name === "word" && hasArabicLetters(text);
      if (isWord) wordCount++;

      out.push({
        id: w.id ?? i + 1,
        text,
        audioUrl: isWord ? buildAudioUrl(w.audio_url) : null,
        isWord,
        position: isWord ? wordCount : null,
      });
    }

    return out;
  })()
    .then((tokens) => {
      if (tokens.length > 0) verseCache.set(key, Promise.resolve(tokens));
      return tokens;
    })
    .catch((err) => {
      console.warn(`[wordAudio] ${key}:`, err);
      verseCache.delete(key);
      return [] as VerseToken[];
    });

  verseCache.set(key, promise);
  const result = await promise;
  if (result.length === 0) verseCache.delete(key);
  return result;
};