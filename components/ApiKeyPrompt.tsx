"use client";
import { useState } from "react";
import { saveApiKey } from "@/lib/storage";

interface Props {
  onDone: () => void;
}

export function ApiKeyPrompt({ onDone }: Props) {
  const [key, setKey] = useState("");

  const handleSave = () => {
    const trimmed = key.trim();
    if (trimmed) saveApiKey(trimmed);
    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-2xl px-6 pt-6 pb-8 shadow-xl animate-slide-up">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Paste your OpenAI API key</h2>
        <p className="text-xs text-gray-500 mb-4">
          Required to translate.{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 underline"
          >
            Get a key →
          </a>
        </p>

        <div className="flex gap-2">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            autoFocus
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent placeholder-gray-300"
          />
          <button
            onClick={handleSave}
            className="text-sm font-medium bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {key.trim() ? "Get started" : "Skip"}
          </button>
        </div>
      </div>
    </div>
  );
}
