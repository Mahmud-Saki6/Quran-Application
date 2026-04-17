"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useSettings } from "@/context/SettingsContext";
import { getGlobalAyahNumber } from "@/lib/ayah";

interface VerseAudioProps {
  kind: "arabic" | "english";
  arabicText: string;
  englishTranslation: string;
  surahNumber: number;
  verseNumber: number;
}

type Playing = "arabic" | "english" | null;

const ARABIC_AUDIO_BASE = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";

const VerseAudio = ({
  kind,
  arabicText,
  englishTranslation,
  surahNumber,
  verseNumber,
}: VerseAudioProps) => {
  const { settings } = useSettings();
  const [playing, setPlaying] = useState<Playing>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const arabicAudioUrl = useMemo(() => {
    const globalAyah = getGlobalAyahNumber(surahNumber, verseNumber);
    return `${ARABIC_AUDIO_BASE}/${globalAyah}.mp3`;
  }, [surahNumber, verseNumber]);

  const stopAll = () => {
    // Stop any other verse/word audio in the app.
    window.dispatchEvent(new Event("surahflow:stop-audio"));

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    speechRef.current = null;
    setPlaying(null);
  };

  const playArabic = () => {
    if (playing === "arabic") {
      stopAll();
      return;
    }

    stopAll();
    setPlaying("arabic");

    const audio = new Audio(arabicAudioUrl);
    audioRef.current = audio;
    audio.onended = () => {
      audioRef.current = null;
      setPlaying(null);
    };
    audio.onerror = () => {
      audioRef.current = null;
      // Fallback: speech synthesis if CDN fails.
      const u = new SpeechSynthesisUtterance(arabicText);
      u.lang = "ar-SA";
      u.rate = settings.pronunciationSpeed;
      u.pitch = 1;
      u.onend = () => setPlaying(null);
      u.onerror = () => setPlaying(null);
      speechRef.current = u;
      window.speechSynthesis.speak(u);
    };
    audio.play().catch(() => {
      audio.onerror?.(new Event("error"));
    });
  };

  const playEnglish = () => {
    if (playing === "english") {
      stopAll();
      return;
    }

    stopAll();
    setPlaying("english");

    const u = new SpeechSynthesisUtterance(englishTranslation);
    u.lang = "en-US";
    u.rate = settings.pronunciationSpeed;
    u.pitch = 1;
    u.onend = () => setPlaying(null);
    u.onerror = () => setPlaying(null);
    speechRef.current = u;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    const onStop = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      speechRef.current = null;
      setPlaying(null);
    };
    window.addEventListener("surahflow:stop-audio", onStop);
    return () => window.removeEventListener("surahflow:stop-audio", onStop);
  }, []);

  const isThisPlaying = playing === kind;
  const onClick = kind === "arabic" ? playArabic : playEnglish;
  const label =
    kind === "arabic"
      ? isThisPlaying
        ? "Stop Arabic audio"
        : "Play Arabic verse audio"
      : isThisPlaying
        ? "Stop English audio"
        : "Play English verse audio";

  return (
    <button
      type="button"
      aria-label={label}
      className={`verse-audio-btn${isThisPlaying ? " is-playing" : ""}`}
      onClick={onClick}
    >
      {isThisPlaying ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M3 9v6h4l5 5V4L7 9H3z" />
          <path d="M16 8a5 5 0 0 1 0 8" />
          <path d="M19 5a9 9 0 0 1 0 14" />
        </svg>
      )}
    </button>
  );
};

export default VerseAudio;

