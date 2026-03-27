import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadConversation,
  saveConversation,
  clearConversation,
  loadPair,
  savePair,
  loadApiKey,
  saveApiKey,
  getDeviceId,
  hasOnboarded,
  setOnboarded,
  ConversationEntry,
} from "../storage";

beforeEach(() => {
  localStorage.clear();
});

describe("conversation storage", () => {
  const entry: ConversationEntry = {
    id: "1",
    timestamp: 1000,
    sourceLang: "en",
    targetLang: "ru",
    original: "hello",
    translation: "привет",
  };

  it("loadConversation returns empty array by default", () => {
    expect(loadConversation()).toEqual([]);
  });

  it("saveConversation + loadConversation round-trips", () => {
    saveConversation([entry]);
    expect(loadConversation()).toEqual([entry]);
  });

  it("clearConversation removes entries", () => {
    saveConversation([entry]);
    clearConversation();
    expect(loadConversation()).toEqual([]);
  });

  it("loadConversation returns [] on corrupt data", () => {
    localStorage.setItem("t123_conversation", "not json");
    expect(loadConversation()).toEqual([]);
  });
});

describe("pair storage", () => {
  it("loadPair returns default en/ru", () => {
    expect(loadPair()).toEqual({ langA: "en", langB: "ru" });
  });

  it("savePair + loadPair round-trips", () => {
    savePair({ langA: "pt", langB: "ru" });
    expect(loadPair()).toEqual({ langA: "pt", langB: "ru" });
  });

  it("loadPair returns default on corrupt data", () => {
    localStorage.setItem("t123_pair", "{bad");
    expect(loadPair()).toEqual({ langA: "en", langB: "ru" });
  });
});

describe("API key storage", () => {
  it("loadApiKey returns empty string by default", () => {
    expect(loadApiKey()).toBe("");
  });

  it("saveApiKey + loadApiKey round-trips", () => {
    saveApiKey("sk-test-123");
    expect(loadApiKey()).toBe("sk-test-123");
  });

  it("saveApiKey with empty string removes key", () => {
    saveApiKey("sk-test-123");
    saveApiKey("");
    expect(loadApiKey()).toBe("");
  });
});

describe("device ID", () => {
  it("generates and persists a UUID", () => {
    const id = getDeviceId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe("string");
    // Same on second call
    expect(getDeviceId()).toBe(id);
  });
});

describe("onboarding", () => {
  it("hasOnboarded returns false by default", () => {
    expect(hasOnboarded()).toBe(false);
  });

  it("setOnboarded makes hasOnboarded true", () => {
    setOnboarded();
    expect(hasOnboarded()).toBe(true);
  });
});
