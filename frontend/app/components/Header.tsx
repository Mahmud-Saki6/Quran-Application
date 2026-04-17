"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import SearchBar from "@/app/components/SearchBar";
import { useSettings } from "@/context/SettingsContext";

const Header = () => {
  const { openSidebar } = useSettings();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isSearchOpen) return;
    const q = (searchParams.get("q") ?? "").trim();
    if (pathname === "/search" && q.length > 0) {
      setIsSearchOpen(false);
    }
  }, [isSearchOpen, pathname, searchParams]);

  return (
    <header className="app-header sticky top-0 z-[50] border-b border-[var(--border-subtle)] bg-[var(--header-bg)] backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-[1400px] min-w-0 items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex flex-none items-center gap-2 text-[var(--text-primary)] no-underline"
        >
          <div className="app-header-logo-icon flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold sm:h-9 sm:w-9">
            ﷽
          </div>
          <span className="gradient-text hidden text-base font-semibold xs:inline sm:text-lg">
            SurahFlow
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
          <div
            className={`min-w-0 ${
              isSearchOpen
                ? "w-[190px] xs:w-[210px] sm:w-[260px] md:w-[320px]"
                : "w-0 overflow-hidden"
            }`}
          >
            {isSearchOpen ? (
              <SearchBar
                autoFocus
                variant="header"
                onRequestClose={() => setIsSearchOpen(false)}
              />
            ) : null}
          </div>

          {!isSearchOpen ? (
            <button
              aria-label="Open verse search"
              className="settings-tool-btn"
              type="button"
              onClick={() => setIsSearchOpen(true)}
            >
              <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          ) : null}

          <button
            aria-label="Open reader settings"
            className="settings-tool-btn"
            type="button"
            onClick={openSidebar}
          >
            <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
              <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M19.4 15.05L18.3 15.6C18.1 15.7 17.9 15.8 17.7 15.9L17.4 17.6C17.3 18.2 16.8 18.6 16.2 18.6H15.5C15.1 18.6 14.7 18.4 14.5 18.1L13.9 17.2C13.7 17 13.4 16.8 13.1 16.8H10.9C10.6 16.8 10.3 17 10.1 17.2L9.5 18.1C9.3 18.4 8.9 18.6 8.5 18.6H7.8C7.2 18.6 6.7 18.2 6.6 17.6L6.3 15.9C6.1 15.8 5.9 15.7 5.7 15.6L4.6 15.05C4 14.75 3.7 14 4 13.4L4.8 12.2C4.9 12 4.9 11.8 4.8 11.6L4 10.4C3.7 9.8 4 9 4.6 8.7L5.7 8.15C5.9 8.05 6.1 7.95 6.3 7.85L6.6 6.15C6.7 5.55 7.2 5.15 7.8 5.15H8.5C8.9 5.15 9.3 5.35 9.5 5.65L10.1 6.55C10.3 6.75 10.6 6.95 10.9 6.95H13.1C13.4 6.95 13.7 6.75 13.9 6.55L14.5 5.65C14.7 5.35 15.1 5.15 15.5 5.15H16.2C16.8 5.15 17.3 5.55 17.4 6.15L17.7 7.85C17.9 7.95 18.1 8.05 18.3 8.15L19.4 8.7C20 9 20.3 9.75 20 10.35L19.2 11.55C19.1 11.75 19.1 11.95 19.2 12.15L20 13.35C20.3 14 20 14.75 19.4 15.05Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
