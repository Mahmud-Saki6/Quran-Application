"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SearchBarVariant = "header" | "default";

const variantStyles: Record<SearchBarVariant, { wrap: string; icon: string; input: string }> = {
  header: {
    wrap:
      "glass search-bar flex w-full items-center gap-2 rounded-xl border border-[var(--border-mid)] px-2 h-8 sm:h-9 sm:px-3",
    icon: "h-3.5 w-3.5 flex-none text-[var(--text-muted)]",
    input:
      "min-w-0 flex-1 bg-transparent text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[14px]",
  },
  default: {
    wrap:
      "glass search-bar flex w-full items-center gap-2 rounded-xl border border-[var(--border-mid)] px-2.5 h-8 sm:h-9 sm:px-3 md:h-10 md:px-4",
    icon: "h-3.5 w-3.5 flex-none text-[var(--text-muted)] sm:h-4 sm:w-4",
    input:
      "min-w-0 flex-1 bg-transparent text-xs sm:text-sm md:text-base text-[var(--text-primary)] outline-none",
  },
};

const SearchBar = ({
  variant = "default",
  autoFocus = false,
  onRequestClose,
}: {
  variant?: SearchBarVariant;
  autoFocus?: boolean;
  onRequestClose?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedQuery = query.trim();

      if (trimmedQuery && trimmedQuery.length > 0) {
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      } else if (trimmedQuery === "" && pathname === "/search") {
        router.push("/");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, query, router]);

  useEffect(() => {
    if (!autoFocus) return;
    // Focus after paint so it works reliably when toggled into view
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [autoFocus]);

  return (
    <div className="w-full">
      <div className={variantStyles[variant].wrap}>
        <svg
          aria-hidden="true"
          className={variantStyles[variant].icon}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>

        <input
          ref={inputRef}
          aria-label="Search verses by translation"
          placeholder="Search verses..."
          className={variantStyles[variant].input}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              if (query) setQuery("");
              onRequestClose?.();
            }
          }}
          onBlur={() => {
            // Close the header search if user taps away and it's empty
            if (variant === "header" && !query.trim()) onRequestClose?.();
          }}
        />

        {query ? (
          <button
            aria-label="Clear search"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] sm:h-9 sm:w-9"
            type="button"
            onClick={() => setQuery("")}
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;
