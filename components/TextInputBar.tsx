"use client";
import { useRef, useEffect } from "react";

type MicState = "idle" | "recording" | "processing";

interface Props {
  text: string;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onMicTap: () => void;
  onClose: () => void;
  micState: MicState;
  submitting: boolean;
}

export function TextInputBar({ text, onTextChange, onSubmit, onMicTap, onClose, micState, submitting }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <div className="flex items-end gap-2 px-4 pb-4 pt-2">
      {/* Close button */}
      <button
        onClick={onClose}
        className="shrink-0 mb-1 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close keyboard"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Input area */}
      <div className="flex-1 flex items-end bg-gray-100 rounded-2xl px-3 py-2 min-h-[44px]">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Type to translate..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none resize-none leading-snug max-h-[120px]"
        />

        {/* Mic button inside input */}
        <button
          onClick={onMicTap}
          disabled={submitting}
          className={`shrink-0 ml-2 p-1 rounded-full transition-colors ${
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
            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-0 right-0 animate-pulse" />
          )}
        </button>
      </div>

      {/* Send button */}
      <button
        onClick={onSubmit}
        disabled={!hasText || submitting}
        className={`shrink-0 mb-1 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          hasText && !submitting
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-200 text-gray-400"
        }`}
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
    </div>
  );
}
