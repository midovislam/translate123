import { describe, it, expect } from "vitest";

// Test the direction logic from translate-detect route
// Extracted to verify correctness independently of Next.js

function determineDirection(detected: string, langA: string, langB: string) {
  const sourceLang = detected === langB ? langB : langA;
  const targetLang = sourceLang === langA ? langB : langA;
  return { sourceLang, targetLang };
}

describe("translate-detect direction logic", () => {
  it("detected=langA → source=langA, target=langB", () => {
    const result = determineDirection("en", "en", "ru");
    expect(result).toEqual({ sourceLang: "en", targetLang: "ru" });
  });

  it("detected=langB → source=langB, target=langA", () => {
    const result = determineDirection("ru", "en", "ru");
    expect(result).toEqual({ sourceLang: "ru", targetLang: "en" });
  });

  it("detected matches neither → defaults to langA as source", () => {
    const result = determineDirection("fr", "en", "ru");
    expect(result).toEqual({ sourceLang: "en", targetLang: "ru" });
  });

  it("works with pt/ru pair — Portuguese detected", () => {
    const result = determineDirection("pt", "ru", "pt");
    expect(result).toEqual({ sourceLang: "pt", targetLang: "ru" });
  });

  it("works with pt/ru pair — Russian detected", () => {
    const result = determineDirection("ru", "ru", "pt");
    expect(result).toEqual({ sourceLang: "ru", targetLang: "pt" });
  });
});
