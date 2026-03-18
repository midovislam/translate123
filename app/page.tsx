"use client";
import { useCallback, useState } from "react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useConversation } from "@/hooks/useConversation";
import { RecordButton } from "@/components/RecordButton";
import { LanguagePairSelector } from "@/components/LanguagePairSelector";
import { ConversationLog } from "@/components/ConversationLog";
import { SettingsPanel } from "@/components/SettingsPanel";
import { loadApiKey } from "@/lib/storage";
import { LandmarkSvg } from "@/lib/landmarks";

export default function Home() {
  const { entries, addEntry, pair, setPair, clear } = useConversation();
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleAudio = useCallback(
    async (blob: Blob) => {
      setError(null);
      try {
        const formData = new FormData();
        const ext = blob.type.includes("mp4") ? "mp4" : blob.type.includes("ogg") ? "ogg" : "webm";
        formData.append("audio", blob, `audio.${ext}`);
        formData.append("langA", pair.langA);
        formData.append("langB", pair.langB);

        const apiKey = loadApiKey();
        const res = await fetch("/api/process", {
          method: "POST",
          headers: apiKey ? { "x-api-key": apiKey } : {},
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");

        addEntry({
          original: data.original,
          translation: data.translation,
          sourceLang: data.sourceLang,
          targetLang: data.targetLang,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        recorder.reset();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pair, addEntry]
  );

  const recorder = useAudioRecorder(handleAudio);

  return (
    <div className="h-dvh md:flex md:items-center md:justify-center md:bg-gray-50 relative">
      {/* Background landmarks — desktop only */}
      <div className="hidden md:block fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center opacity-[0.05] text-gray-900">
          <LandmarkSvg code={pair.langA} className="w-[340px] h-[340px]" />
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center opacity-[0.05] text-gray-900">
          <LandmarkSvg code={pair.langB} className="w-[340px] h-[340px]" />
        </div>
      </div>

      {/* iPhone frame — desktop only */}
      <div className="relative z-10 md:w-[390px] md:h-[844px] md:rounded-[50px] md:border-[12px] md:border-gray-900 md:shadow-2xl md:overflow-hidden">
        {/* Notch */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-900 rounded-b-2xl z-50" />

        <main className="flex flex-col h-dvh md:h-full bg-white">
          {/* Top bar */}
          <header className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
            <span className="text-sm font-semibold text-gray-900 tracking-tight">translate123</span>
            <button
              onClick={() => setShowSettings(true)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
              aria-label="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </header>

          {/* Conversation log */}
          <ConversationLog entries={entries} />

          {/* Error toast */}
          {error && (
            <div className="mx-5 mb-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-600">✕</button>
            </div>
          )}

          {/* Bottom controls */}
          <footer className="shrink-0 border-t border-gray-100">
            <LanguagePairSelector pair={pair} onChange={setPair} />
            <div className="flex justify-center pb-4 pt-1">
              <RecordButton state={recorder.state} onToggle={recorder.toggle} />
            </div>
          </footer>

          {/* Settings overlay */}
          {showSettings && (
            <SettingsPanel onClose={() => setShowSettings(false)} onClear={clear} />
          )}
        </main>
      </div>
    </div>
  );
}
