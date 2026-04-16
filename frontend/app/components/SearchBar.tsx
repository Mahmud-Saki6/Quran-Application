"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

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

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <div
        className="glass search-bar"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          border: "1px solid var(--border-mid)",
          borderRadius: "14px",
          padding: "0 16px",
          height: "48px",
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        }}
      >
        <svg
          fill="none"
          height="18"
          style={{ flexShrink: 0, color: "var(--text-muted)" }}
          viewBox="0 0 24 24"
          width="18"
        >
          <path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>

        <input
          aria-label="Search verses by translation"
          placeholder="Search verses..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "14px",
            minWidth: 0,
          }}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <button
            aria-label="Clear search"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "18px",
            }}
            type="button"
            onClick={() => setQuery("")}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
