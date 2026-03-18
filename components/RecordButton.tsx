"use client";
import { useRef, useCallback } from "react";
import { RecorderState } from "@/hooks/useAudioRecorder";

interface Props {
  state: RecorderState;
  onToggle: () => void;
  onKeyboardOpen: () => void;
}

export function RecordButton({ state, onToggle, onKeyboardOpen }: Props) {
  const isRecording = state === "recording";
  const isProcessing = state === "processing";
  const pressTimeRef = useRef<number>(0);
  const holdModeRef = useRef(false);

  const handlePointerDown = useCallback(() => {
    if (isProcessing) return;
    if (!isRecording) {
      // Start recording on press
      pressTimeRef.current = Date.now();
      holdModeRef.current = false;
      onToggle();
    } else {
      // Already recording from a previous tap — pressing again to stop
      pressTimeRef.current = Date.now();
      holdModeRef.current = false;
    }
  }, [isRecording, isProcessing, onToggle]);

  const handlePointerUp = useCallback(() => {
    if (isProcessing) return;
    const held = Date.now() - pressTimeRef.current;
    if (isRecording && held > 600) {
      // Held long enough — release stops recording
      onToggle();
    }
    // Short press (<600ms): if we just started recording, stay recording (tap mode).
    // If we were already recording and tapped again, the pointerDown didn't restart,
    // so we stop on short tap of an already-recording state.
  }, [isRecording, isProcessing, onToggle]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          disabled={isProcessing}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          className={`
            relative w-20 h-20 rounded-full transition-all duration-200 focus:outline-none select-none touch-none
            ${isProcessing ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-95"}
            ${isRecording
              ? "bg-red-500 shadow-lg shadow-red-200"
              : "bg-red-500 shadow-md shadow-red-100 hover:bg-red-600 hover:shadow-lg hover:shadow-red-200"
            }
          `}
        >
          {/* Pulse ring when recording */}
          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40" />
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20 animation-delay-150" />
            </>
          )}

          {/* Icon */}
          <span className="relative flex items-center justify-center w-full h-full">
            {isProcessing ? (
              <svg className="w-7 h-7 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            ) : isRecording ? (
              // Stop square
              <span className="w-6 h-6 rounded-sm bg-white" />
            ) : (
              // Mic icon
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
              </svg>
            )}
          </span>
        </button>

        {/* Keyboard button */}
        <button
          onClick={onKeyboardOpen}
          disabled={isRecording || isProcessing}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors disabled:opacity-30"
          aria-label="Type to translate"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" />
          </svg>
        </button>
      </div>

      <span className="text-xs text-gray-400 tracking-wide select-none">
        {isProcessing ? "Translating…" : isRecording ? "Release or tap to stop" : "Tap or hold to speak"}
      </span>
    </div>
  );
}
