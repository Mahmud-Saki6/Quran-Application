"use client";

import { useEffect, useRef, useState } from "react";

import { useSettings } from "@/context/SettingsContext";
import { fetchVerseWords, type VerseToken } from "@/lib/wordAudio";
import {
  VERSE_ARABIC_RECITATION_END,
  VERSE_ARABIC_RECITATION_WORD,
  clearVerseArabicWordCount,
  setVerseArabicWordCount,
  type VerseArabicRecitationEndDetail,
  type VerseArabicRecitationWordDetail,
} from "@/lib/verseRecitationBridge";

interface WordByWordVerseProps {
  arabicText: string;
  surahNumber: number;
  verseNumber: number;
}

const HOVER_DELAY_MS = 120;

const WordByWordVerse = ({ arabicText, surahNumber, verseNumber }: WordByWordVerseProps) => {
  const { settings } = useSettings();

  const [tokens, setTokens] = useState<VerseToken[] | null>(null);
  const [activePosition, setActivePosition] = useState<number | null>(null);
  /** Full-verse MP3 (VerseAudio) — proportional word highlight while reciting */
  const [recitationTracePosition, setRecitationTracePosition] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hoverTimer = useRef<number | null>(null);

  const stopPlayback = () => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    audioRef.current?.pause();
    audioRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setActivePosition(null);
  };

  useEffect(() => () => stopPlayback(), []);

  useEffect(() => {
    const stop = () => stopPlayback();
    window.addEventListener("surahflow:stop-audio", stop);
    return () => window.removeEventListener("surahflow:stop-audio", stop);
  }, []);

  useEffect(() => {
    setTokens(null);
    stopPlayback();
    setRecitationTracePosition(null);
    let cancelled = false;
    void fetchVerseWords(surahNumber, verseNumber).then((t) => {
      if (!cancelled) setTokens(t);
    });
    return () => {
      cancelled = true;
    };
  }, [surahNumber, verseNumber]);

  useEffect(() => {
    if (!tokens?.length) {
      clearVerseArabicWordCount(surahNumber, verseNumber);
      return;
    }
    const n = tokens.filter((t) => t.isWord).length;
    setVerseArabicWordCount(surahNumber, verseNumber, n);
    return () => clearVerseArabicWordCount(surahNumber, verseNumber);
  }, [tokens, surahNumber, verseNumber]);

  useEffect(() => {
    const onWord = (e: Event) => {
      const ev = e as CustomEvent<VerseArabicRecitationWordDetail>;
      const d = ev.detail;
      if (d.surahNumber !== surahNumber || d.verseNumber !== verseNumber) return;
      setRecitationTracePosition(d.wordPosition);
    };
    const onEnd = (e: Event) => {
      const ev = e as CustomEvent<VerseArabicRecitationEndDetail>;
      const d = ev.detail;
      if (d.surahNumber !== surahNumber || d.verseNumber !== verseNumber) return;
      setRecitationTracePosition(null);
    };
    window.addEventListener(VERSE_ARABIC_RECITATION_WORD, onWord);
    window.addEventListener(VERSE_ARABIC_RECITATION_END, onEnd);
    return () => {
      window.removeEventListener(VERSE_ARABIC_RECITATION_WORD, onWord);
      window.removeEventListener(VERSE_ARABIC_RECITATION_END, onEnd);
    };
  }, [surahNumber, verseNumber]);

  const speakFallback = (text: string, position: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setActivePosition(null);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = settings.pronunciationSpeed;
    u.pitch = 1;
    u.onend = () => setActivePosition(null);
    u.onerror = () => setActivePosition(null);
    setActivePosition(position);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const playToken = (token: VerseToken) => {
    if (!settings.arabicPronunciationEnabled) return;
    if (!token.isWord || token.position === null) return;
    if (activePosition === token.position) return;

    stopPlayback();
    setActivePosition(token.position);

    if (!token.audioUrl) {
      speakFallback(token.text, token.position);
      return;
    }

    const audio = new Audio(token.audioUrl);
    audio.preload = "auto";
    audio.playbackRate = settings.pronunciationSpeed;
    audioRef.current = audio;
    audio.onended = () => {
      setActivePosition(null);
      audioRef.current = null;
    };
    audio.onerror = () => {
      audioRef.current = null;
      speakFallback(token.text, token.position!);
    };
    audio.play().catch(() => {
      audioRef.current = null;
      speakFallback(token.text, token.position!);
    });
  };

  const shouldEnableHover =
    settings.pronunciationMode === "hover" || settings.pronunciationMode === "click-and-hover";
  const shouldClick =
    settings.pronunciationMode === "click" || settings.pronunciationMode === "click-and-hover";

  const scheduleHover = (token: VerseToken) => {
    if (!shouldEnableHover) return;
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => playToken(token), HOVER_DELAY_MS);
  };

  const clearHoverTimer = () => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  if (tokens === null) {
    return (
      <div className="word-by-word-verse">
        <p dir="rtl" className="arabic-text">
          {arabicText}
        </p>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="word-by-word-verse">
        <p dir="rtl" className="arabic-text">
          {arabicText}
        </p>
      </div>
    );
  }

  return (
    <div className="word-by-word-verse">
      <div className="word-row word-row--arabic" dir="rtl">
        {tokens.map((token, idx) => {
          if (!token.isWord) {
            return (
              <span
                key={`${surahNumber}-${verseNumber}-mark-${token.id}-${idx}`}
                className="word-token word-token--arabic word-token--mark"
                aria-hidden="true"
              >
                <span className="word-token__text">{token.text}</span>
              </span>
            );
          }

          const isActive = activePosition === token.position;
          const isRecitationTrace =
            recitationTracePosition !== null && recitationTracePosition === token.position;

          return (
            <button
              key={`${surahNumber}-${verseNumber}-ar-${token.id}-${idx}`}
              type="button"
              className={`word-token word-token--arabic${isActive ? " is-active" : ""}${isRecitationTrace ? " word-token--recitation-trace" : ""}`}
              aria-label={`Play ${token.text}`}
              onClick={() => {
                if (!settings.arabicPronunciationEnabled) return;
                if (shouldClick) playToken(token);
              }}
              onMouseEnter={() => scheduleHover(token)}
              onMouseLeave={clearHoverTimer}
            >
              <span className="word-token__text">{token.text}</span>
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
