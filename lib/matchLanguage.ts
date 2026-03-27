const LANG_NAMES: Record<string, string> = {
  ru: "russian",
  pt: "portuguese",
  en: "english",
  es: "spanish",
  fr: "french",
  de: "german",
  it: "italian",
  zh: "chinese",
  ja: "japanese",
  ko: "korean",
  ar: "arabic",
  tr: "turkish",
  pl: "polish",
  uk: "ukrainian",
  nl: "dutch",
  hi: "hindi",
  he: "hebrew",
  th: "thai",
  vi: "vietnamese",
  ro: "romanian",
};

const WHISPER_ALIASES: Record<string, string> = {
  mandarin: "zh",
  cantonese: "zh",
  brasileiro: "pt",
  castellano: "es",
  farsi: "fa",
  persian: "fa",
  flemish: "nl",
};

function normalize(s: string) {
  return s.toLowerCase().trim();
}

/**
 * Match Whisper's detected language string to one of two language codes.
 * Handles full names ("portuguese"), variants ("brazilian portuguese"),
 * ISO codes ("pt"), and known aliases ("mandarin" → "zh").
 */
export function matchDetectedLang(detected: string, codeA: string, codeB: string): string | null {
  const d = normalize(detected);

  const nameA = normalize(LANG_NAMES[codeA] ?? "");
  const nameB = normalize(LANG_NAMES[codeB] ?? "");

  // Exact match on full name
  if (d === nameA) return codeA;
  if (d === nameB) return codeB;

  // Exact match on ISO code
  if (d === codeA) return codeA;
  if (d === codeB) return codeB;

  // Known aliases
  const aliasCode = WHISPER_ALIASES[d];
  if (aliasCode === codeA) return codeA;
  if (aliasCode === codeB) return codeB;

  // Partial: "brazilian portuguese" contains "portuguese"
  if (nameA && d.includes(nameA)) return codeA;
  if (nameB && d.includes(nameB)) return codeB;

  // Reverse partial: detected substring matches name
  if (nameA && nameA.includes(d) && d.length >= 3) return codeA;
  if (nameB && nameB.includes(d) && d.length >= 3) return codeB;

  return null;
}

export function getLangName(code: string): string {
  return LANG_NAMES[code] ?? code;
}
