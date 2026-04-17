import surahsData from "@/lib/generated/surahs.json";
import type { SurahSummary } from "@/lib/types";

export const runtime = "nodejs";

const surahs = surahsData as SurahSummary[];

export async function GET() {
  return Response.json({
    data: surahs,
  });
}

