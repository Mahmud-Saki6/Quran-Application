const API_BASE = "/api";

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
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
  fetchJson<{ data: unknown[] }>("/surahs");

export const fetchSurah = async (number: number) =>
  fetchJson<{ data: unknown }>(`/surah/${number}`);

export const searchVerses = async (query: string, surah?: number) => {
  const params = new URLSearchParams({ q: query });
  if (surah) params.set("surah", String(surah));
  return fetchJson<{ data: unknown[]; total: number }>(`/search?${params.toString()}`);
};
