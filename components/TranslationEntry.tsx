"use client";
import { ConversationEntry } from "@/lib/storage";
import { getLang } from "@/lib/languages";

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
        {/* Translation — big and bold */}
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0 mt-1" aria-label={targetLang.name}>{targetLang.flag}</span>
          <p className={`${getHeroTranslationSize(entry.translation)} font-semibold text-gray-900 leading-snug`}>{entry.translation}</p>
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
        <p className="text-sm font-medium text-gray-700 leading-snug">{entry.translation}</p>
      </div>
    </div>
  );
}
