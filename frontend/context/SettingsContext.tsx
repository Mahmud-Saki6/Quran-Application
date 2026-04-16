"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import {
  DEFAULT_SETTINGS,
  applySettingsToDocument,
  readSettingsFromStorage,
  saveSettingsToStorage,
} from "@/lib/settings";
import type { Settings } from "@/lib/types";

interface SettingsContextValue {
  isHydrated: boolean;
  isSidebarOpen: boolean;
  settings: Settings;
  openSidebar: () => void;
  closeSidebar: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedSettings = readSettingsFromStorage();
    setSettings(storedSettings);
    applySettingsToDocument(storedSettings);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only run after hydration so we never overwrite the prehydration
    // script's correct values with DEFAULT_SETTINGS on the first render.
    if (!isHydrated) return;
    applySettingsToDocument(settings);
    saveSettingsToStorage(settings);
  }, [isHydrated, settings]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isSidebarOpen]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...updates,
      version: currentSettings.version,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      isHydrated,
      isSidebarOpen,
      settings,
      openSidebar,
      closeSidebar,
      updateSettings,
      resetSettings,
    }),
    [
      closeSidebar,
      isHydrated,
      isSidebarOpen,
      openSidebar,
      resetSettings,
      settings,
      updateSettings,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider.");
  }

  return context;
};
