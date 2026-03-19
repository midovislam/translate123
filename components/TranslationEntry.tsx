"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { ConversationEntry } from "@/lib/storage";
import { getLang } from "@/lib/languages";
import { loadApiKey } from "@/lib/storage";

export type EntryVariant = "hero" | "compact";

interface Props {
  entry: ConversationEntry;
  variant?: EntryVariant;
  onUpdateEntry?: (id: string, updates: Partial<Pick<ConversationEntry, "original" | "translation">>) => void;
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

  // Cleanup blob URL and audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.audio.pause();
        URL.revokeObjectURL(audioRef.current.url);
        audioRef.current = null;
      }
    };
  }, []);

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

function CopyButton({ text, size = "w-5 h-5" }: { text: string; size?: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: do nothing
    }
  }

  return (
    <button
      onClick={handleClick}
      className="shrink-0 p-1 text-gray-300 hover:text-gray-500 transition-colors"
      aria-label="Copy translation"
    >
      {copied ? (
        <svg className={size} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className={size} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}

export function TranslationEntry({ entry, variant = "compact", onUpdateEntry }: Props) {
  const sourceLang = getLang(entry.sourceLang);
  const targetLang = getLang(entry.targetLang);
  const isHero = variant === "hero";

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(entry.original);
  const [translating, setTranslating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const startEdit = useCallback(() => {
    if (!onUpdateEntry) return;
    setEditText(entry.original);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [entry.original, onUpdateEntry]);

  const submitEdit = useCallback(async () => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === entry.original || !onUpdateEntry) {
      setEditing(false);
      return;
    }
    setTranslating(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const apiKey = loadApiKey();
      if (apiKey) headers["x-api-key"] = apiKey;

      const res = await fetch("/api/translate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          text: trimmed,
          sourceLang: entry.sourceLang,
          targetLang: entry.targetLang,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onUpdateEntry(entry.id, { original: trimmed, translation: data.translation });
      }
    } catch {
      // silently fail, keep old text
    } finally {
      setTranslating(false);
      setEditing(false);
    }
  }, [editText, entry, onUpdateEntry]);

  if (isHero) {
    return (
      <div className="flex flex-col justify-center px-6 py-6 overflow-hidden">
        {/* Original — muted, tappable to edit */}
        <div className="flex items-start gap-3 mb-3 min-w-0">
          <span className="text-xl shrink-0 mt-1" aria-label={sourceLang.name}>{sourceLang.flag}</span>
          {editing ? (
            <textarea
              ref={inputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitEdit(); }
                if (e.key === "Escape") setEditing(false);
              }}
              onBlur={submitEdit}
              className={`${getHeroOriginalSize(editText)} text-gray-600 leading-relaxed flex-1 min-w-0 bg-transparent border-b-2 border-blue-400 outline-none resize-none`}
              rows={1}
            />
          ) : (
            <div className="flex-1 min-w-0">
              <p
                onClick={startEdit}
                className={`${getHeroOriginalSize(entry.original)} text-gray-400 leading-relaxed ${onUpdateEntry ? "cursor-text active:text-gray-500" : ""} ${!expanded && entry.original.length > 100 ? "truncate" : "break-words"}`}
              >
                {entry.original}
              </p>
              {entry.original.length > 100 && !editing && (
                <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} className="text-xs text-gray-400 hover:text-gray-500 mt-0.5">
                  {expanded ? "less" : "more"}
                </button>
              )}
            </div>
          )}
        </div>
        {/* Arrow */}
        <div className="pl-5 mb-3">
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        {/* Translation — big and bold + speaker */}
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-xl shrink-0 mt-1" aria-label={targetLang.name}>{targetLang.flag}</span>
          <p className={`${getHeroTranslationSize(entry.translation)} font-semibold leading-snug flex-1 min-w-0 break-words ${translating ? "text-gray-400 animate-pulse" : "text-gray-900"}`}>
            {entry.translation}
          </p>
          <div className="flex flex-col shrink-0">
            <SpeakerButton text={entry.translation} lang={entry.targetLang} size="w-6 h-6" />
            <CopyButton text={entry.translation} size="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  }

  // Compact variant — uniform small size for history
  return (
    <div className="py-3 border-b border-gray-100 overflow-hidden">
      <div className="flex items-start gap-2 mb-1 min-w-0">
        <span className="text-sm shrink-0 mt-0.5" aria-label={sourceLang.name}>{sourceLang.flag}</span>
        <p className="text-sm text-gray-400 leading-snug min-w-0 break-words">{entry.original}</p>
      </div>
      <div className="flex items-start gap-2 min-w-0">
        <span className="text-sm shrink-0 mt-0.5" aria-label={targetLang.name}>{targetLang.flag}</span>
        <p className="text-sm font-medium text-gray-700 leading-snug flex-1 min-w-0 break-words">{entry.translation}</p>
        <div className="flex shrink-0">
          <SpeakerButton text={entry.translation} lang={entry.targetLang} size="w-4 h-4" />
          <CopyButton text={entry.translation} size="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
