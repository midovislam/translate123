"use client";
import { useRef, useCallback } from "react";
import { RecorderState } from "@/hooks/useAudioRecorder";

interface Props {
  state: RecorderState;
  onToggle: () => void;
  onCancel: () => void;
  onKeyboardOpen: () => void;
  onCameraCapture: (file: File) => void;
  cameraProcessing?: boolean;
}

export function RecordButton({ state, onToggle, onCancel, onKeyboardOpen, onCameraCapture, cameraProcessing }: Props) {
  const isRecording = state === "recording";
  const isProcessing = state === "processing";
  const isBusy = isProcessing || cameraProcessing;
  const pressTimeRef = useRef<number>(0);
  const recordingModeRef = useRef<"none" | "deciding" | "tap">("none");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraTap = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onCameraCapture(file);
      e.target.value = "";
    },
    [onCameraCapture]
  );

  const handlePointerDown = useCallback(() => {
    if (isBusy) return;
    if (!isRecording) {
      pressTimeRef.current = Date.now();
      recordingModeRef.current = "deciding";
      onToggle();
    }
  }, [isRecording, isBusy, onToggle]);

  const handlePointerUp = useCallback(() => {
    if (isBusy) return;

    if (recordingModeRef.current === "deciding") {
      const held = Date.now() - pressTimeRef.current;
      if (held >= 1000) {
        recordingModeRef.current = "none";
        onToggle();
      } else {
        recordingModeRef.current = "tap";
      }
    } else if (recordingModeRef.current === "tap" && isRecording) {
      recordingModeRef.current = "none";
      onToggle();
    }
  }, [isRecording, isProcessing, onToggle]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        {/* Left — camera (idle) or cancel (recording) */}
        {isRecording ? (
          <button
            onClick={() => {
              recordingModeRef.current = "none";
              onCancel();
            }}
            aria-label="Cancel recording"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleCameraTap}
            disabled={isBusy}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors disabled:opacity-30"
            aria-label="Take photo to translate"
          >
            {cameraProcessing ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            )}
          </button>
        )}

        {/* Mic / record button */}
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          disabled={isBusy}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          className={`
            relative w-20 h-20 rounded-full transition-all duration-200 focus:outline-none select-none touch-none
            ${isBusy ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-95"}
            ${isRecording
              ? "bg-red-500 shadow-lg shadow-red-200"
              : "bg-red-500 shadow-md shadow-red-100 hover:bg-red-600 hover:shadow-lg hover:shadow-red-200"
            }
          `}
        >
          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40" />
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20 animation-delay-150" />
            </>
          )}

          <span className="relative flex items-center justify-center w-full h-full">
            {isProcessing ? (
              <svg className="w-7 h-7 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            ) : isRecording ? (
              <span className="w-6 h-6 rounded-sm bg-white" />
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
              </svg>
            )}
          </span>
        </button>

        {/* Keyboard button — right */}
        <button
          onClick={onKeyboardOpen}
          disabled={isRecording || isBusy}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors disabled:opacity-30"
          aria-label="Type to translate"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <span className="text-xs text-gray-400 tracking-wide select-none">
        {cameraProcessing ? "Translating photo…" : isProcessing ? "Translating…" : isRecording ? "Tap to stop" : "Tap or hold to speak"}
      </span>
    </div>
  );
}
