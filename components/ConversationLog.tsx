"use client";
import { useEffect, useRef } from "react";
import { ConversationEntry } from "@/lib/storage";
import { TranslationEntry } from "./TranslationEntry";

interface Props {
  entries: ConversationEntry[];
  onUpdateEntry?: (id: string, updates: Partial<Pick<ConversationEntry, "original" | "translation">>) => void;
}

export function ConversationLog({ entries, onUpdateEntry }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll to hero (bottom) when entries change
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [entries.length]);

  if (entries.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 select-none">
        <p className="text-gray-300 text-sm leading-relaxed">
          Select your languages below,<br />then tap the button to speak.
        </p>
      </div>
    );
  }

  const historyEntries = entries.slice(0, -1);
  const lastEntry = entries[entries.length - 1];

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
      {/* History — compact entries, scroll up to reveal */}
      {historyEntries.length > 0 && (
        <div className="px-5">
          {historyEntries.map((entry) => (
            <TranslationEntry key={entry.id} entry={entry} variant="compact" />
          ))}
        </div>
      )}

      {/* Hero — last entry, fills the visible area */}
      <div
        ref={heroRef}
        className="min-h-full flex flex-col justify-center"
      >
        <TranslationEntry key={lastEntry.id} entry={lastEntry} variant="hero" onUpdateEntry={onUpdateEntry} />
      </div>
    </div>
  );
}
