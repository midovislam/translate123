import { describe, it, expect } from "vitest";
import { LANGUAGES, getLang } from "../languages";

describe("LANGUAGES", () => {
  it("has 20 languages", () => {
    expect(LANGUAGES).toHaveLength(20);
  });

  it("has unique codes", () => {
    const codes = LANGUAGES.map((l) => l.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("every language has all required fields", () => {
    for (const lang of LANGUAGES) {
      expect(lang.code).toBeTruthy();
      expect(lang.name).toBeTruthy();
      expect(lang.short).toBeTruthy();
      expect(lang.nativeName).toBeTruthy();
      expect(lang.flag).toBeTruthy();
    }
  });

  it("includes key languages", () => {
    const codes = LANGUAGES.map((l) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("ru");
    expect(codes).toContain("pt");
    expect(codes).toContain("es");
    expect(codes).toContain("zh");
  });
});

describe("getLang", () => {
  it("returns correct language for known code", () => {
    const en = getLang("en");
    expect(en.code).toBe("en");
    expect(en.name).toBe("English");

    const ru = getLang("ru");
    expect(ru.code).toBe("ru");
    expect(ru.name).toBe("Russian");
  });

  it("returns fallback for unknown code", () => {
    const unknown = getLang("xx");
    expect(unknown.code).toBe("xx");
    expect(unknown.name).toBe("xx");
    expect(unknown.flag).toBeTruthy();
  });
});
