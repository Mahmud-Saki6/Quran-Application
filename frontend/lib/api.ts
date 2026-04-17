import { apiUrl } from "@/lib/apiBase";
import type { SearchIndexEntry, SurahDetail, SurahSummary } from "@/lib/types";

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(apiUrl(path), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
};

export const fetchAllSurahs = async () =>
  fetchJson<{ data: SurahSummary[] }>("/api/surahs");

export const fetchSurah = async (number: number) =>
  fetchJson<{ data: SurahDetail }>(`/api/surah/${number}`);

export const searchVerses = async (query: string, surah?: number) => {
  const params = new URLSearchParams({ q: query });
  if (surah) params.set("surah", String(surah));
  return fetchJson<{ data: SearchIndexEntry[]; total: number }>(`/api/search?${params.toString()}`);
};
