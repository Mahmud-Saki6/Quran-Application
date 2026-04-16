import type { QuranListApiResponse, QuranSurahApiResponse } from "@/lib/types";

const QURAN_API_BASE_URL = "https://api.alquran.cloud/v1";
const REQUEST_TIMEOUT_MS = 10_000;

const fetchJson = async <T>(path: string): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${QURAN_API_BASE_URL}${path}`, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    const payload = (await response.json()) as T;

    if (!response.ok) {
      throw new Error(`Quran API request failed with status ${response.status}.`);
    }

    return payload;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The Quran API request timed out after 10 seconds.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const fetchAllSurahs = async () =>
  fetchJson<QuranListApiResponse>("/surah");

export const fetchSurah = async (number: number) =>
  fetchJson<QuranSurahApiResponse>(
    `/surah/${number}/editions/en.asad,ar.alafasy`,
  );
