const QURAN_WORDS_API_BASE = "https://api.quran.com/api/v4/verses/by_key";
const QURAN_AUDIO_CDN_BASE = "https://audio.qurancdn.com";

export interface ArabicWordAudioToken {
  id: number;
  position: number;
  text: string;
  audioUrl: string | null;
}

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

const verseWordCache = new Map<string, Promise<ArabicWordAudioToken[]>>();

const buildAudioUrl = (audioPath?: string | null) => {
  if (!audioPath) return null;
  if (/^https?:\/\//i.test(audioPath)) return audioPath;
  return `${QURAN_AUDIO_CDN_BASE}/${audioPath.replace(/^\/+/, "")}`;
};

export const fetchVerseWords = async (
  surahNumber: number,
  verseNumber: number,
): Promise<ArabicWordAudioToken[]> => {
  const verseKey = `${surahNumber}:${verseNumber}`;

  if (verseWordCache.has(verseKey)) {
    return verseWordCache.get(verseKey)!;
  }

  const request = fetch(
    `${QURAN_WORDS_API_BASE}/${verseKey}?words=true&word_fields=audio_url,text_uthmani`,
  )
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch word audio for ${verseKey}`);
      }

      const data = (await response.json()) as QuranWordApiResponse;
      const words = data.verse?.words ?? [];

      return words
        // Only keep real word tokens; Quran.com can include pauses/end markers
        // which would shift indices and misalign audio playback.
        .filter((word) => word.char_type_name === "word")
        .map((word, index) => ({
          id: word.id ?? index + 1,
          position: word.position ?? index + 1,
          text: word.text_uthmani ?? word.text ?? "",
          audioUrl: buildAudioUrl(word.audio_url),
        }))
        .filter((word) => word.text.length > 0);
    })
    .catch(() => [])
    .then((words) => {
      verseWordCache.set(verseKey, Promise.resolve(words));
      return words;
    });

  verseWordCache.set(verseKey, request);
  return request;
};

