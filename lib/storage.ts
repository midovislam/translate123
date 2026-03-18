export interface ConversationEntry {
  id: string;
  timestamp: number;
  sourceLang: string;
  targetLang: string;
  original: string;
  translation: string;
}

export interface LanguagePair {
  langA: string;
  langB: string;
}

const CONVERSATION_KEY = "t123_conversation";
const PAIR_KEY = "t123_pair";
const API_KEY_KEY = "t123_api_key";

export function loadConversation(): ConversationEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONVERSATION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveConversation(entries: ConversationEntry[]): void {
  localStorage.setItem(CONVERSATION_KEY, JSON.stringify(entries));
}

export function clearConversation(): void {
  localStorage.removeItem(CONVERSATION_KEY);
}

export function loadPair(): LanguagePair {
  if (typeof window === "undefined") return { langA: "ru", langB: "pt" };
  try {
    const raw = localStorage.getItem(PAIR_KEY);
    return raw ? JSON.parse(raw) : { langA: "ru", langB: "pt" };
  } catch {
    return { langA: "ru", langB: "pt" };
  }
}

export function savePair(pair: LanguagePair): void {
  localStorage.setItem(PAIR_KEY, JSON.stringify(pair));
}

export function loadApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(API_KEY_KEY) ?? "";
}

export function saveApiKey(key: string): void {
  if (key) {
    localStorage.setItem(API_KEY_KEY, key);
  } else {
    localStorage.removeItem(API_KEY_KEY);
  }
}
