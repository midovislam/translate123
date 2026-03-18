"use client";
import { RecorderState } from "@/hooks/useAudioRecorder";

interface Props {
  state: RecorderState;
  onToggle: () => void;
}

export function RecordButton({ state, onToggle }: Props) {
  const isRecording = state === "recording";
  const isProcessing = state === "processing";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onToggle}
        disabled={isProcessing}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
        className={`
          relative w-20 h-20 rounded-full transition-all duration-200 focus:outline-none
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

      <span className="text-xs text-gray-400 tracking-wide select-none">
        {isProcessing ? "Translating…" : isRecording ? "Tap to stop" : "Tap to speak"}
      </span>
    </div>
  );
}
