import { describe, it, expect } from "vitest";
import { getQuote } from "../quotes";

describe("getQuote", () => {
  it("returns a quote for English", () => {
    const q = getQuote("en");
    expect(q).not.toBeNull();
    expect(q!.text).toBeTruthy();
    expect(q!.author).toBeTruthy();
  });

  it("returns a quote for Russian", () => {
    const q = getQuote("ru");
    expect(q).not.toBeNull();
  });

  it("returns null for unsupported language", () => {
    expect(getQuote("xx")).toBeNull();
    expect(getQuote("ja")).toBeNull();
  });
});
