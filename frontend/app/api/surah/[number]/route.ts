import surahDetailsData from "@/lib/generated/surah-details.json";
import type { SurahDetail } from "@/lib/types";

export const runtime = "nodejs";

const surahDetails = surahDetailsData as SurahDetail[];

export async function GET(
  _request: Request,
  context: { params: Promise<{ number: string }> },
) {
  const { number } = await context.params;
  const surah = surahDetails.find((item) => item.number === Number(number));

  if (!surah) {
    return Response.json(
      {
        error: "Surah not found",
      },
      { status: 404 },
    );
  }

  return Response.json({
    data: surah,
  });
}

