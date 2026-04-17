import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import VerseItem from "@/app/components/VerseItem";
import surahDetailsData from "@/lib/generated/surah-details.json";
import type { SurahDetail } from "@/lib/types";

const surahDetails = surahDetailsData as SurahDetail[];

interface SurahPageProps {
  params: Promise<{
    number: string;
  }>;
}

export const dynamicParams = false;

export const generateStaticParams = async () =>
  Array.from({ length: 114 }, (_, index) => ({
    number: String(index + 1),
  }));

export const generateMetadata = async ({
  params,
}: SurahPageProps): Promise<Metadata> => {
  const { number } = await params;
  const surah = surahDetails.find((item) => item.number === Number(number));

  if (!surah) {
    return {
      title: "Surah not found",
    };
  }

  return {
    title: surah.englishName,
    description: `Read Surah ${surah.englishName} with Arabic text and English translation in a glassmorphism Quran reader.`,
  };
};

const SurahPage = async ({ params }: SurahPageProps) => {
  const { number } = await params;
  const surahNumber = Number(number);
  const surah = surahDetails.find((item) => item.number === surahNumber);

  if (!surah) {
    notFound();
  }

  const previousSurah = surahDetails.find((item) => item.number === surahNumber - 1) ?? null;
  const nextSurah = surahDetails.find((item) => item.number === surahNumber + 1) ?? null;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6 lg:px-8 animate-fade-in space-y-6">
      <section className="glass-card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p
              className="text-sm uppercase tracking-[0.3em]"
              style={{ color: "var(--text-muted)" }}
            >
              Surah {surah.number}
            </p>
            <h1
              className="font-arabic mt-4 text-3xl sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              {surah.name}
            </h1>
            <p className="mt-2 text-lg sm:text-xl" style={{ color: "var(--text-primary)" }}>
              {surah.englishName}
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              {surah.englishNameTranslation}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span
                className="rounded-full px-3 py-2"
                style={{
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-card)",
                  color: "var(--text-secondary)",
                }}
              >
                {surah.numberOfAyahs} verses
              </span>
              <span
                className="rounded-full px-3 py-2"
                style={{
                  border: "1px solid rgba(74, 107, 93, 0.25)",
                  background: "var(--sacred-green-dim)",
                  color: "var(--sacred-green)",
                }}
              >
                {surah.revelationType}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="glass-button inline-flex min-h-11 items-center" href="/">
              Back
            </Link>
            {previousSurah ? (
              <Link
                className="glass-button inline-flex min-h-11 items-center"
                href={`/surah/${previousSurah.number}`}
              >
                Previous
              </Link>
            ) : null}
            {nextSurah ? (
              <Link
                className="glass-button inline-flex min-h-11 items-center"
                href={`/surah/${nextSurah.number}`}
              >
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {surah.number !== 9 && surah.number !== 1 ? (
        <section
          className="glass-card p-6 text-center"
          style={{
            background: "var(--gradient-warm)",
          }}
        >
          <p
            className="bismillah-arabic"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="bismillah-translation">
            In the name of Allah, the Entirely Merciful, the Especially Merciful.
          </p>
        </section>
      ) : null}

      <section className="space-y-3 sm:space-y-4">
        {surah.ayahs.map((verse, index) => (
          <VerseItem
            key={`${surah.number}-${verse.numberInSurah}`}
            index={index}
            surahNumber={surah.number}
            surahEnglishName={surah.englishName}
            surahName={surah.name}
            verse={verse}
          />
        ))}
      </section>
    </div>
  );
};

export default SurahPage;
