import { describe, it, expect } from "vitest";
import { matchDetectedLang, getLangName } from "../matchLanguage";

describe("matchDetectedLang", () => {
  describe("exact full name match", () => {
    it("matches 'portuguese' to pt", () => {
      expect(matchDetectedLang("portuguese", "ru", "pt")).toBe("pt");
    });

    it("matches 'russian' to ru", () => {
      expect(matchDetectedLang("russian", "ru", "pt")).toBe("ru");
    });

    it("matches 'english' to en regardless of position", () => {
      expect(matchDetectedLang("english", "en", "ru")).toBe("en");
      expect(matchDetectedLang("english", "fr", "en")).toBe("en");
    });

    it("is case-insensitive", () => {
      expect(matchDetectedLang("PORTUGUESE", "ru", "pt")).toBe("pt");
      expect(matchDetectedLang("Russian", "ru", "pt")).toBe("ru");
    });

    it("trims whitespace", () => {
      expect(matchDetectedLang("  portuguese  ", "ru", "pt")).toBe("pt");
    });
  });

  describe("ISO code match", () => {
    it("matches 'pt' to pt", () => {
      expect(matchDetectedLang("pt", "ru", "pt")).toBe("pt");
    });

    it("matches 'ru' to ru", () => {
      expect(matchDetectedLang("ru", "ru", "pt")).toBe("ru");
    });

    it("matches 'zh' to zh", () => {
      expect(matchDetectedLang("zh", "en", "zh")).toBe("zh");
    });
  });

  describe("alias match", () => {
    it("matches 'mandarin' to zh", () => {
      expect(matchDetectedLang("mandarin", "en", "zh")).toBe("zh");
    });

    it("matches 'cantonese' to zh", () => {
      expect(matchDetectedLang("cantonese", "zh", "en")).toBe("zh");
    });

    it("matches 'castellano' to es", () => {
      expect(matchDetectedLang("castellano", "en", "es")).toBe("es");
    });

    it("matches 'flemish' to nl", () => {
      expect(matchDetectedLang("flemish", "nl", "fr")).toBe("nl");
    });

    it("matches 'brasileiro' to pt", () => {
      expect(matchDetectedLang("brasileiro", "ru", "pt")).toBe("pt");
    });
  });

  describe("partial match — the Portuguese bug fix", () => {
    it("matches 'brazilian portuguese' to pt", () => {
      expect(matchDetectedLang("brazilian portuguese", "ru", "pt")).toBe("pt");
    });

    it("matches 'european portuguese' to pt", () => {
      expect(matchDetectedLang("european portuguese", "en", "pt")).toBe("pt");
    });

    it("matches 'latin american spanish' to es", () => {
      expect(matchDetectedLang("latin american spanish", "es", "en")).toBe("es");
    });

    it("matches 'simplified chinese' to zh", () => {
      expect(matchDetectedLang("simplified chinese", "en", "zh")).toBe("zh");
    });

    it("matches 'traditional chinese' to zh", () => {
      expect(matchDetectedLang("traditional chinese", "zh", "ja")).toBe("zh");
    });
  });

  describe("reverse partial match", () => {
    it("matches short substring of known name", () => {
      // "port" is 4 chars, >= 3, and is contained in "portuguese"
      expect(matchDetectedLang("portug", "en", "pt")).toBe("pt");
    });

    it("rejects too-short substrings", () => {
      // "po" is only 2 chars, below the 3-char minimum
      expect(matchDetectedLang("po", "en", "pt")).toBeNull();
    });
  });

  describe("no match — returns null", () => {
    it("returns null for completely unknown language", () => {
      expect(matchDetectedLang("klingon", "en", "ru")).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(matchDetectedLang("", "en", "ru")).toBeNull();
    });

    it("returns null when detected doesn't match either code", () => {
      expect(matchDetectedLang("japanese", "en", "ru")).toBeNull();
    });
  });

  describe("direction correctness — the original bug scenario", () => {
    it("correctly identifies Portuguese as source when langA=ru, langB=pt", () => {
      // This is the exact bug scenario: user speaks Portuguese, pair is ru/pt
      const matched = matchDetectedLang("portuguese", "ru", "pt");
      expect(matched).toBe("pt"); // source should be pt, not ru
    });

    it("correctly identifies Portuguese as source even with variant name", () => {
      const matched = matchDetectedLang("brazilian portuguese", "ru", "pt");
      expect(matched).toBe("pt");
    });

    it("correctly identifies Russian as source when langA=pt, langB=ru", () => {
      const matched = matchDetectedLang("russian", "pt", "ru");
      expect(matched).toBe("ru");
    });
  });
});

describe("getLangName", () => {
  it("returns full name for known code", () => {
    expect(getLangName("ru")).toBe("russian");
    expect(getLangName("pt")).toBe("portuguese");
    expect(getLangName("en")).toBe("english");
  });

  it("returns code as-is for unknown code", () => {
    expect(getLangName("xx")).toBe("xx");
  });
});
