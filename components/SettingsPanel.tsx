"use client";
import { useState, useEffect } from "react";
import { loadApiKey, saveApiKey, getDeviceId } from "@/lib/storage";

interface Props {
  onClose: () => void;
  onClear: () => void;
}

export function SettingsPanel({ onClose, onClear }: Props) {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);

  useEffect(() => {
    setKey(loadApiKey());

    // Fetch free-tier usage
    const deviceId = getDeviceId();
    if (deviceId) {
      fetch("/api/usage", { headers: { "x-device-id": deviceId } })
        .then((r) => r.json())
        .then((data) => setUsage(data))
        .catch(() => {});
    }
  }, []);

  const handleSave = () => {
    saveApiKey(key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const maskedKey = key.length > 8 ? `sk-...${key.slice(-4)}` : key;
  const hasKey = key.length > 0;
  const usagePct = usage ? Math.min((usage.used / usage.limit) * 100, 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Settings</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
        {/* Free tier usage */}
        {!hasKey && usage && (
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Free tier</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                You have a free quota on this device. Add your own key below for unlimited use.
              </p>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>${usage.used.toFixed(3)} used</span>
                <span>${usage.limit.toFixed(2)} limit</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${usagePct >= 90 ? "bg-red-400" : usagePct >= 60 ? "bg-yellow-400" : "bg-green-400"}`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>
          </section>
        )}

        {/* API Key */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">OpenAI API Key</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter your own key for unlimited use.{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 underline"
              >
                Get a key
              </a>
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent placeholder-gray-300"
            />
            <button
              onClick={handleSave}
              className="text-sm font-medium bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          {hasKey && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Using your key ({maskedKey})
            </div>
          )}
          {!hasKey && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Using free tier
            </div>
          )}
        </section>

        {/* Clear history */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Conversation history</h3>
            <p className="text-xs text-gray-500 mt-0.5">Stored locally on this device.</p>
          </div>
          <button
            onClick={() => { onClear(); onClose(); }}
            className="text-sm text-red-500 border border-red-200 rounded-lg px-4 py-2.5 hover:bg-red-50 transition-colors"
          >
            Clear history
          </button>
        </section>
      </div>
    </div>
  );
}
