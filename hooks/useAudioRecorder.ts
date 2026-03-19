"use client";
import { useRef, useState, useCallback, useEffect } from "react";

export type RecorderState = "idle" | "recording" | "processing";

const MAX_RECORDING_MS = 5 * 60 * 1000; // 5 minutes

export function useAudioRecorder(onResult: (blob: Blob) => void) {
  const [state, setState] = useState<RecorderState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cancelledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const toggle = useCallback(async () => {
    if (state === "recording") {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (state === "processing") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      cancelledRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stopStream();
        clearTimer();
        if (cancelledRef.current) {
          cancelledRef.current = false;
          setState("idle");
          return;
        }
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        setState("processing");
        onResult(blob);
      };

      recorder.start();
      setState("recording");

      // Auto-stop after 5 minutes
      timerRef.current = setTimeout(() => {
        mediaRecorderRef.current?.stop();
      }, MAX_RECORDING_MS);
    } catch (err) {
      console.error("Microphone error:", err);
    }
  }, [state, onResult, stopStream, clearTimer]);

  const cancel = useCallback(() => {
    if (state !== "recording") return;
    cancelledRef.current = true;
    mediaRecorderRef.current?.stop();
  }, [state]);

  const reset = useCallback(() => setState("idle"), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      stopStream();
    };
  }, [clearTimer, stopStream]);

  return { state, toggle, cancel, reset };
}

function getSupportedMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}
