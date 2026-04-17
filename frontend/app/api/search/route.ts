import searchIndexData from "@/lib/generated/search-index.json";
import type { SearchIndexEntry } from "@/lib/types";

export const runtime = "nodejs";

const searchIndex = searchIndexData as SearchIndexEntry[];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const surahFilter = Number(searchParams.get("surah") ?? "");

  if (!query) {
    return Response.json({
      data: [],
      total: 0,
    });
  }

  const results = searchIndex.filter((entry) => {
    if (Number.isFinite(surahFilter) && surahFilter > 0 && entry.surahNumber !== surahFilter) {
      return false;
    }

    return entry.translation.toLowerCase().includes(query);
  });

  return Response.json({
    data: results,
    total: results.length,
  });
}

