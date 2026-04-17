import type {
  ArabicFontFamily,
  PronunciationMode,
  Settings,
} from "@/lib/types";

export const SETTINGS_STORAGE_KEY = "quran_settings";
export const SETTINGS_VERSION = 2;

export const DEFAULT_SETTINGS: Settings = {
  version: SETTINGS_VERSION,
  arabicFont: "Scheherazade New",
  arabicFontSize: 24,
  translationFontSize: 16,
  pronunciationMode: "click",
  arabicPronunciationEnabled: true,
  pronunciationSpeed: 0.8,
};

const FONT_FAMILY_MAP: Record<ArabicFontFamily, string> = {
  "Scheherazade New": "'Scheherazade New', serif",
  Amiri: "'Amiri', serif",
  "Noto Naskh Arabic": "'Noto Naskh Arabic', serif",
};

const isFontFamily = (value: unknown): value is ArabicFontFamily =>
  value === "Scheherazade New" ||
  value === "Amiri" ||
  value === "Noto Naskh Arabic";

const isPronunciationMode = (value: unknown): value is PronunciationMode =>
  value === "click" ||
  value === "hover" ||
  value === "click-and-hover";

export const normalizeSettings = (value: unknown): Settings => {
  if (!value || typeof value !== "object") {
    return DEFAULT_SETTINGS;
  }

  const incoming = value as Partial<Settings>;

  return {
    version: SETTINGS_VERSION,
    arabicFont: isFontFamily(incoming.arabicFont)
      ? incoming.arabicFont
      : DEFAULT_SETTINGS.arabicFont,
    arabicFontSize:
      typeof incoming.arabicFontSize === "number"
        ? Math.min(40, Math.max(16, incoming.arabicFontSize))
        : DEFAULT_SETTINGS.arabicFontSize,
    translationFontSize:
      typeof incoming.translationFontSize === "number"
        ? Math.min(28, Math.max(12, incoming.translationFontSize))
        : DEFAULT_SETTINGS.translationFontSize,
    pronunciationMode: isPronunciationMode(incoming.pronunciationMode)
      ? incoming.pronunciationMode
      : DEFAULT_SETTINGS.pronunciationMode,
    arabicPronunciationEnabled:
      typeof incoming.arabicPronunciationEnabled === "boolean"
        ? incoming.arabicPronunciationEnabled
        : DEFAULT_SETTINGS.arabicPronunciationEnabled,
    pronunciationSpeed:
      typeof incoming.pronunciationSpeed === "number"
        ? Math.min(1.2, Math.max(0.5, incoming.pronunciationSpeed))
        : DEFAULT_SETTINGS.pronunciationSpeed,
  };
};

export const readSettingsFromStorage = (): Settings => {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  const rawValue = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!rawValue) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;
    return normalizeSettings(parsedValue);
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettingsToStorage = (settings: Settings) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

export const applySettingsToDocument = (settings: Settings) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty("--arabic-font-family", FONT_FAMILY_MAP[settings.arabicFont]);
  root.style.setProperty("--arabic-font-size", `${settings.arabicFontSize}px`);
  root.style.setProperty(
    "--translation-font-size",
    `${settings.translationFontSize}px`,
  );
};
