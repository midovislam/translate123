"use client";
import { useRef, useEffect } from "react";
import { StreamChunk } from "@/hooks/useStreamingTranslation";
import { getLang } from "@/lib/languages";

interface Props {
  chunks: StreamChunk[];
  processingChunk: boolean;
  langA: string;
  langB: string;
  onStop: () => void;
}

export function StreamingView({ chunks, processingChunk, langA, langB, onStop }: Props) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Auto-scroll both panels to bottom when new chunks arrive
  useEffect(() => {
    leftRef.current?.scrollTo({ top: leftRef.current.scrollHeight, behavior: "smooth" });
    rightRef.current?.scrollTo({ top: rightRef.current.scrollHeight, behavior: "smooth" });
  }, [chunks]);

  const langAInfo = getLang(langA);
  const langBInfo = getLang(langB);

  // Determine panel labels from chunks or fallback to langA/langB
  const lastChunk = chunks[chunks.length - 1];
  const leftLang = lastChunk ? getLang(lastChunk.sourceLang) : langAInfo;
  const rightLang = lastChunk ? getLang(lastChunk.targetLang) : langBInfo;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Two-panel header with language labels */}
      <div className="flex border-b border-gray-100 shrink-0">
        <div className="flex-1 px-4 py-2 text-xs font-medium text-gray-400 text-center border-r border-gray-100">
          {leftLang.flag} {leftLang.name}
        </div>
        <div className="flex-1 px-4 py-2 text-xs font-medium text-gray-400 text-center">
          {rightLang.flag} {rightLang.name}
        </div>
      </div>

      {/* Two-panel content */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel — original text */}
        <div ref={leftRef} className="flex-1 overflow-y-auto p-4 border-r border-gray-100">
          {chunks.length === 0 && !processingChunk && (
            <p className="text-sm text-gray-300 text-center mt-8">Listening...</p>
          )}
          {chunks.map((chunk, i) => (
            <p
              key={i}
              className={`text-sm text-gray-800 mb-2 ${
                i === chunks.length - 1 && processingChunk ? "streaming-pulse" : ""
              }`}
            >
              {chunk.original}
            </p>
          ))}
          {processingChunk && chunks.length > 0 && (
            <p className="text-sm text-gray-300 streaming-pulse">...</p>
          )}
          {processingChunk && chunks.length === 0 && (
            <p className="text-sm text-gray-300 text-center mt-8 streaming-pulse">Processing...</p>
          )}
        </div>

        {/* Right panel — translated text */}
        <div ref={rightRef} className="flex-1 overflow-y-auto p-4">
          {chunks.length === 0 && !processingChunk && (
            <p className="text-sm text-gray-300 text-center mt-8">Translation will appear here</p>
          )}
          {chunks.map((chunk, i) => (
            <p
              key={i}
              className={`text-sm text-gray-800 mb-2 ${
                i === chunks.length - 1 && processingChunk ? "streaming-pulse" : ""
              }`}
            >
              {chunk.translation}
            </p>
          ))}
          {processingChunk && chunks.length > 0 && (
            <p className="text-sm text-gray-300 streaming-pulse">...</p>
          )}
          {processingChunk && chunks.length === 0 && (
            <p className="text-sm text-gray-300 text-center mt-8 streaming-pulse">...</p>
          )}
        </div>
      </div>

      {/* Stop button */}
      <div className="flex flex-col items-center gap-2 py-4 shrink-0 border-t border-gray-100">
        <button
          onClick={onStop}
          aria-label="Stop streaming"
          className="relative w-20 h-20 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer"
        >
          <span className="absolute inset-0 rounded-full bg-gray-200 animate-ping opacity-20" />
          <span className="relative flex items-center justify-center w-full h-full">
            <span className="w-6 h-6 rounded-sm bg-gray-500" />
          </span>
        </button>
        <span className="text-xs text-gray-400 tracking-wide select-none">Tap to stop</span>
      </div>
    </div>
  );
}
