"use client";
import { useState, useRef } from "react";
import { ConversationEntry } from "@/lib/storage";
import { getLang } from "@/lib/languages";
import { loadApiKey } from "@/lib/storage";

export type EntryVariant = "hero" | "compact";

interface Props {
  entry: ConversationEntry;
  variant?: EntryVariant;
}

function getHeroTranslationSize(text: string): string {
  const len = text.length;
  if (len <= 15) return "text-4xl";
  if (len <= 40) return "text-3xl";
  if (len <= 80) return "text-2xl";
  if (len <= 150) return "text-xl";
  return "text-lg";
}

function getHeroOriginalSize(text: string): string {
  const len = text.length;
  if (len <= 15) return "text-xl";
  if (len <= 40) return "text-lg";
  if (len <= 80) return "text-base";
  return "text-sm";
}

type TTSState = "idle" | "loading" | "playing";

function SpeakerButton({ text, lang, size = "w-5 h-5" }: { text: string; lang: string; size?: string }) {
  const [state, setState] = useState<TTSState>("idle");
  const audioRef = useRef<{ url: string; audio: HTMLAudioElement } | null>(null);

  async function handleClick() {
    if (state === "playing") {
      audioRef.current?.audio.pause();
      setState("idle");
      return;
    }
    if (audioRef.current) {
      audioRef.current.audio.currentTime = 0;
      audioRef.current.audio.play();
      setState("playing");
      return;
    }
    setState("loading");
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const apiKey = loadApiKey();
      if (apiKey) headers["x-api-key"] = apiKey;

      const res = await fetch("/api/tts", {
        method: "POST",
        headers,
        body: JSON.stringify({ text, lang }),
      });
      if (!res.ok) {
        setState("idle");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => setState("idle");
      audioRef.current = { url, audio };
      audio.play();
      setState("playing");
    } catch {
      setState("idle");
    }
  }

  return (
    <button
      onClick={handleClick}
      className="shrink-0 p-1 text-gray-300 hover:text-gray-500 transition-colors"
      aria-label="Play translation"
    >
      {state === "loading" ? (
        <svg className={`${size} animate-spin`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className={size} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.5H4a1 1 0 00-1 1v5a1 1 0 001 1h2.5l4.5 4V4.5l-4.5 4z" />
          {state === "playing" && (
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 010 14.14" className="animate-pulse" />
          )}
        </svg>
      )}
    </button>
  );
}

export function TranslationEntry({ entry, variant = "compact" }: Props) {
  const sourceLang = getLang(entry.sourceLang);
  const targetLang = getLang(entry.targetLang);
  const isHero = variant === "hero";

  if (isHero) {
    return (
      <div className="flex flex-col justify-center px-6 py-6">
        {/* Original — muted */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-xl shrink-0 mt-1" aria-label={sourceLang.name}>{sourceLang.flag}</span>
          <p className={`${getHeroOriginalSize(entry.original)} text-gray-400 leading-relaxed`}>{entry.original}</p>
        </div>
        {/* Arrow */}
        <div className="pl-5 mb-3">
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        {/* Translation — big and bold + speaker */}
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0 mt-1" aria-label={targetLang.name}>{targetLang.flag}</span>
          <p className={`${getHeroTranslationSize(entry.translation)} font-semibold text-gray-900 leading-snug flex-1`}>{entry.translation}</p>
          <SpeakerButton text={entry.translation} lang={entry.targetLang} size="w-6 h-6" />
        </div>
      </div>
    );
  }

  // Compact variant — uniform small size for history
  return (
    <div className="py-3 border-b border-gray-100">
      <div className="flex items-start gap-2 mb-1">
        <span className="text-sm shrink-0 mt-0.5" aria-label={sourceLang.name}>{sourceLang.flag}</span>
        <p className="text-sm text-gray-400 leading-snug">{entry.original}</p>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-sm shrink-0 mt-0.5" aria-label={targetLang.name}>{targetLang.flag}</span>
        <p className="text-sm font-medium text-gray-700 leading-snug flex-1">{entry.translation}</p>
        <SpeakerButton text={entry.translation} lang={entry.targetLang} size="w-4 h-4" />
      </div>
    </div>
  );
}
