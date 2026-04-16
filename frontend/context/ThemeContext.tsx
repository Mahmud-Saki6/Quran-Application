"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "quran_theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const applyDomTheme = (next: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", next);
  document.documentElement.style.colorScheme = next === "dark" ? "dark" : "light";
};

const withThemeTransition = () => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.add("theme-transition");
  window.setTimeout(() => root.classList.remove("theme-transition"), 320);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === "undefined") return "light";
    const attr = document.documentElement.getAttribute("data-theme");
    return attr === "dark" || attr === "light" ? attr : "light";
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
      applyDomTheme(stored);
    } else {
      applyDomTheme("light");
    }
  }, []);

  const setTheme = useCallback((next: Theme) => {
    withThemeTransition();
    setThemeState(next);
    applyDomTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      withThemeTransition();
      applyDomTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
