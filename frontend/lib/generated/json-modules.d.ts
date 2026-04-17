import type { SearchIndexEntry, SurahDetail, SurahSummary } from "@/lib/types";

declare module "@/lib/generated/surahs.json" {
  const data: SurahSummary[];
  export default data;
}

declare module "@/lib/generated/surah-details.json" {
  const data: SurahDetail[];
  export default data;
}

declare module "@/lib/generated/search-index.json" {
  const data: SearchIndexEntry[];
  export default data;
}
