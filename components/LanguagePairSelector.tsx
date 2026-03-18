"use client";
import { useState } from "react";
import { LANGUAGES, getLang } from "@/lib/languages";
import { LanguagePair } from "@/lib/storage";

interface Props {
  pair: LanguagePair;
  onChange: (pair: LanguagePair) => void;
}

export function LanguagePairSelector({ pair, onChange }: Props) {
  const [open, setOpen] = useState<"A" | "B" | null>(null);

  const langA = getLang(pair.langA);
  const langB = getLang(pair.langB);

  const select = (side: "A" | "B", code: string) => {
    if (side === "A" && code !== pair.langB) {
      onChange({ ...pair, langA: code });
    } else if (side === "B" && code !== pair.langA) {
      onChange({ ...pair, langB: code });
    }
    setOpen(null);
  };

  const swap = () => {
    onChange({ langA: pair.langB, langB: pair.langA });
  };

  return (
    <div className="relative flex items-center justify-center gap-3 py-2.5">
      {/* Lang A */}
      <button
        onClick={() => setOpen(open === "A" ? null : "A")}
        className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
      >
        <span>{langA.flag}</span>
        <span>{langA.name}</span>
      </button>

      {/* Swap — horizontal arrows */}
      <button
        onClick={swap}
        className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
        aria-label="Swap languages"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4-4m-4 4l4 4" />
        </svg>
      </button>

      {/* Lang B */}
      <button
        onClick={() => setOpen(open === "B" ? null : "B")}
        className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
      >
        <span>{langB.flag}</span>
        <span>{langB.name}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(null)} />
          <div className="absolute bottom-full mb-2 z-20 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-56">
            <div className="max-h-72 overflow-y-auto py-1">
              {LANGUAGES.map((lang) => {
                const isOtherSide =
                  (open === "A" && lang.code === pair.langB) ||
                  (open === "B" && lang.code === pair.langA);
                const isCurrent =
                  (open === "A" && lang.code === pair.langA) ||
                  (open === "B" && lang.code === pair.langB);
                return (
                  <button
                    key={lang.code}
                    onClick={() => !isOtherSide && select(open, lang.code)}
                    disabled={isOtherSide}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors
                      ${isCurrent ? "bg-gray-50 font-medium text-gray-900" : "text-gray-700 hover:bg-gray-50"}
                      ${isOtherSide ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    <span>{lang.flag}</span>
                    <span className="flex-1">{lang.name}</span>
                    <span className="text-xs text-gray-400">{lang.nativeName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
