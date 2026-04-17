"use client";

import { useEffect, useRef, useState } from "react";

import { useSettings } from "@/context/SettingsContext";
import { fetchVerseWords, type ArabicWordAudioToken } from "@/lib/wordAudio";

interface WordByWordVerseProps {
  arabicText: string;
  surahNumber: number;
  verseNumber: number;
}

type ActiveWord =
  | {
      type: "ar";
      position: number;
    }
  | null;

const HOVER_PLAY_DELAY_MS = 120;

const splitArabicWords = (text: string) =>
  text
    .split(/\s+/)
    .map((word, index) => ({
      id: index + 1,
      position: index + 1,
      text: word.trim(),
      audioUrl: null,
    }))
    .filter((word) => word.text.length > 0);

const WordByWordVerse = ({
  arabicText,
  surahNumber,
  verseNumber,
}: WordByWordVerseProps) => {
  const { settings } = useSettings();
  const [arabicWords, setArabicWords] = useState<ArabicWordAudioToken[]>(() =>
    splitArabicWords(arabicText),
  );
  const [activeWord, setActiveWord] = useState<ActiveWord>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const hasLoadedArabicAudioRef = useRef(false);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const stopCurrentPlayback = () => {
    clearHoverTimeout();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(false);
    setActiveWord(null);
  };

  useEffect(
    () => () => {
      stopCurrentPlayback();
    },
    [],
  );

  useEffect(() => {
    const onStop = () => stopCurrentPlayback();
    window.addEventListener("surahflow:stop-audio", onStop);
    return () => window.removeEventListener("surahflow:stop-audio", onStop);
  }, []);

  useEffect(() => {
    hasLoadedArabicAudioRef.current = false;
    setArabicWords(splitArabicWords(arabicText));
    setActiveWord(null);
    setIsPlaying(false);
  }, [arabicText, surahNumber, verseNumber]);

  const ensureArabicWordsLoaded = async () => {
    if (hasLoadedArabicAudioRef.current) {
      return arabicWords;
    }

    const words = await fetchVerseWords(surahNumber, verseNumber);
    hasLoadedArabicAudioRef.current = true;

    if (words.length > 0) {
      setArabicWords(words);
      return words;
    }

    return arabicWords;
  };

  const speakWithSynthesis = (text: string, nextActiveWord: ActiveWord) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsPlaying(false);
      setActiveWord(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = settings.pronunciationSpeed;
    utterance.pitch = 1;
    utterance.onend = () => {
      setIsPlaying(false);
      setActiveWord(null);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setActiveWord(null);
    };

    setActiveWord(nextActiveWord);
    setIsPlaying(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const playArabicWord = async (word: ArabicWordAudioToken) => {
    if (!settings.arabicPronunciationEnabled) return;
    if (isPlaying && activeWord?.type === "ar" && activeWord.position === word.position) return;

    const loadedWords = await ensureArabicWordsLoaded();
    const resolvedWord =
      loadedWords.find((w) => w.position === word.position) ?? word;

    stopCurrentPlayback();

    const nextActiveWord: ActiveWord = { type: "ar", position: word.position };
    setActiveWord(nextActiveWord);
    setIsPlaying(true);

    if (!resolvedWord.audioUrl) {
      speakWithSynthesis(resolvedWord.text, nextActiveWord);
      return;
    }

    const audio = new Audio(resolvedWord.audioUrl);
    audio.playbackRate = settings.pronunciationSpeed;
    audioRef.current = audio;
    audio.onended = () => {
      setIsPlaying(false);
      setActiveWord(null);
      audioRef.current = null;
    };
    audio.onerror = () => {
      audioRef.current = null;
      speakWithSynthesis(resolvedWord.text, nextActiveWord);
    };

    audio.play().catch(() => {
      audioRef.current = null;
      speakWithSynthesis(resolvedWord.text, nextActiveWord);
    });
  };

  const shouldEnableHover =
    settings.pronunciationMode === "hover" ||
    settings.pronunciationMode === "click-and-hover";

  const shouldEnableClick =
    settings.pronunciationMode === "click" ||
    settings.pronunciationMode === "click-and-hover";

  const scheduleHoverPlayback = (
    nextActiveWord: Exclude<ActiveWord, null>,
    callback: () => void,
  ) => {
    if (!shouldEnableHover) return;
    if (
      activeWord?.type === nextActiveWord.type &&
      activeWord.position === nextActiveWord.position &&
      isPlaying
    ) {
      return;
    }
    clearHoverTimeout();
    hoverTimeoutRef.current = window.setTimeout(callback, HOVER_PLAY_DELAY_MS);
  };

  return (
    <div className="word-by-word-verse">
      <div className="word-row word-row--arabic" dir="rtl">
        {arabicWords.map((word) => {
          const isActive =
            activeWord?.type === "ar" && activeWord.position === word.position;
          return (
            <button
              key={`${surahNumber}-${verseNumber}-ar-${word.position}`}
              aria-label={`Play Arabic word ${word.text}`}
              className={`word-token word-token--arabic${isActive ? " is-active" : ""}`}
              type="button"
              onClick={() => {
                if (shouldEnableClick) void playArabicWord(word);
              }}
              onMouseEnter={() =>
                scheduleHoverPlayback({ type: "ar", position: word.position }, () =>
                  void playArabicWord(word),
                )
              }
              onMouseLeave={clearHoverTimeout}
            >
              <span className="word-token__text">{word.text}</span>
              <span className="word-token__icon" aria-hidden="true">
                {isActive ? "Playing" : "Speak"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WordByWordVerse;

