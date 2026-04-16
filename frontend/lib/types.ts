export type ArabicFontFamily =
  | "Scheherazade New"
  | "Amiri"
  | "Noto Naskh Arabic";

export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Verse {
  number: number;
  numberInSurah: number;
  juz?: number;
  page?: number;
  arabicText: string;
  translation: string;
}

export interface SurahDetail extends SurahSummary {
  ayahs: Verse[];
}

export interface SearchIndexEntry {
  id: string;
  surahNumber: number;
  surahName: string;
  englishName: string;
  verseNumber: number;
  arabicText: string;
  translation: string;
}

export interface Settings {
  version: number;
  arabicFont: ArabicFontFamily;
  arabicFontSize: number;
  translationFontSize: number;
}

export interface QuranListApiResponse {
  code: number;
  status: string;
  data: SurahSummary[];
}

export interface QuranEditionAyah {
  number: number;
  numberInSurah: number;
  juz?: number;
  page?: number;
  text: string;
}

export interface QuranEditionSurah {
  edition: {
    identifier: string;
    language: string;
  };
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: QuranEditionAyah[];
}

export interface QuranSurahApiResponse {
  code: number;
  status: string;
  data: QuranEditionSurah[];
}
