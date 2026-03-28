"use client";
import { useRef, useState, useCallback, useEffect } from "react";

export type StreamingState = "idle" | "recording" | "processing-chunk";

export interface StreamChunk {
  original: string;
  translation: string;
  sourceLang: string;
  targetLang: string;
}

interface Options {
  langA: string;
  langB: string;
  apiHeaders: () => Record<string, string>;
  onError: (msg: string) => void;
}

const CHUNK_INTERVAL_MS = 4000;

function getSupportedMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

export function useStreamingTranslation({ langA, langB, apiHeaders, onError }: Options) {
  const [state, setState] = useState<StreamingState>("idle");
  const [chunks, setChunks] = useState<StreamChunk[]>([]);
  const [processingChunk, setProcessingChunk] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const activeRecorderRef = useRef<MediaRecorder | null>(null);
  const pendingRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stoppingRef = useRef(false);
  const mimeTypeRef = useRef("");
  const inflightRef = useRef(0);

  // Keep latest lang values in refs so callbacks always see current values
  const langARef = useRef(langA);
  const langBRef = useRef(langB);
  const apiHeadersRef = useRef(apiHeaders);
  const onErrorRef = useRef(onError);
  langARef.current = langA;
  langBRef.current = langB;
  apiHeadersRef.current = apiHeaders;
  onErrorRef.current = onError;

  const sendChunk = useCallback(async (blob: Blob) => {
    if (blob.size < 100) return; // skip tiny/empty blobs

    inflightRef.current++;
    setProcessingChunk(true);

    try {
      const ext = blob.type.includes("mp4") ? "mp4" : blob.type.includes("ogg") ? "ogg" : "webm";
      const formData = new FormData();
      formData.append("audio", blob, `chunk.${ext}`);
      formData.append("langA", langARef.current);
      formData.append("langB", langBRef.current);

      const res = await fetch("/api/stream-chunk", {
        method: "POST",
        headers: apiHeadersRef.current(),
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error) onErrorRef.current(data.error);
        return;
      }

      setChunks((prev) => [
        ...prev,
        {
          original: data.original,
          translation: data.translation,
          sourceLang: data.sourceLang,
          targetLang: data.targetLang,
        },
      ]);
    } catch (err) {
      onErrorRef.current(err instanceof Error ? err.message : "Stream chunk failed");
    } finally {
      inflightRef.current--;
      if (inflightRef.current <= 0) {
        inflightRef.current = 0;
        setProcessingChunk(false);
      }
    }
  }, []);

  const createRecorder = useCallback((stream: MediaStream): MediaRecorder => {
    const mimeType = mimeTypeRef.current;
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const localChunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) localChunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(localChunks, { type: mimeType || "audio/webm" });
      sendChunk(blob);
    };

    return recorder;
  }, [sendChunk]);

  const rotateRecorder = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;

    // Stop current recorder (triggers onstop → sendChunk)
    const current = activeRecorderRef.current;
    if (current && current.state === "recording") {
      current.stop();
    }

    // The pending recorder is already recording — promote it
    if (pendingRecorderRef.current && pendingRecorderRef.current.state === "recording") {
      activeRecorderRef.current = pendingRecorderRef.current;
    }

    // Create next pending recorder and start it immediately (no gap)
    const next = createRecorder(stream);
    next.start();
    pendingRecorderRef.current = next;
  }, [createRecorder]);

  const start = useCallback(async () => {
    if (state !== "idle") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mimeTypeRef.current = getSupportedMimeType();
      stoppingRef.current = false;

      setChunks([]);
      setState("recording");

      // Start first recorder
      const first = createRecorder(stream);
      first.start();
      activeRecorderRef.current = first;

      // Pre-start second recorder for seamless rotation
      const second = createRecorder(stream);
      second.start();
      pendingRecorderRef.current = second;

      // Rotate every CHUNK_INTERVAL_MS
      intervalRef.current = setInterval(rotateRecorder, CHUNK_INTERVAL_MS);
    } catch (err) {
      console.error("Mic error:", err);
      onErrorRef.current("Could not access microphone");
    }
  }, [state, createRecorder, rotateRecorder]);

  const stop = useCallback(() => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;

    // Clear rotation interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop both recorders (triggers onstop → final chunks sent)
    if (activeRecorderRef.current?.state === "recording") {
      activeRecorderRef.current.stop();
    }
    if (pendingRecorderRef.current?.state === "recording") {
      pendingRecorderRef.current.stop();
    }

    // Stop mic stream
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    setState("idle");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (activeRecorderRef.current?.state === "recording") activeRecorderRef.current.stop();
      if (pendingRecorderRef.current?.state === "recording") pendingRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { state, chunks, processingChunk, start, stop };
}
