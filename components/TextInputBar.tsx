"use client";
import { useRef, useEffect, useCallback } from "react";

type MicState = "idle" | "recording" | "processing";

interface Props {
  text: string;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onMicTap: () => void;
  onClose: () => void;
  micState: MicState;
  submitting: boolean;
  className?: string;
}

export function TextInputBar({ text, onTextChange, onSubmit, onMicTap, onClose, micState, submitting, className }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [text]);

  const hasText = text.trim().length > 0;
  const isRecording = micState === "recording";
  const isMicBusy = micState !== "idle";
  const showSend = hasText && !isMicBusy;

  // Swipe down to close
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy > 60) onClose();
    touchStartY.current = null;
  }, [onClose]);

  return (
    <div
      className={`flex items-end gap-2 px-4 pb-4 pt-2${className ? ` ${className}` : ""}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Input area */}
      <div className="flex-1 flex items-end bg-gray-100 rounded-2xl px-4 py-3 min-h-[48px] min-w-0">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Type to translate..."
          rows={1}
          className="flex-1 bg-transparent text-base text-gray-900 placeholder-gray-400 outline-none resize-none leading-snug max-h-[120px]"
        />

        {/* Mic button inside input */}
        <button
          onClick={onMicTap}
          disabled={submitting}
          className={`shrink-0 ml-2 p-1 rounded-full transition-colors relative ${
            isRecording
              ? "text-red-500"
              : isMicBusy
              ? "text-gray-300"
              : "text-gray-400 hover:text-gray-600"
          }`}
          aria-label={isRecording ? "Stop recording" : "Record voice"}
        >
          {micState === "processing" ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
            </svg>
          )}
          {isRecording && (
            <span className="absolute w-2 h-2 bg-red-500 rounded-full -top-0.5 -right-0.5 animate-pulse" />
          )}
        </button>
      </div>

      {/* Send button — hidden while mic is busy */}
      {showSend && (
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="shrink-0 mb-1 w-9 h-9 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-all"
          aria-label="Send"
        >
          {submitting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
