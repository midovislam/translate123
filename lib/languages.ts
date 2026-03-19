export interface Language {
  code: string;
  name: string;
  short: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", short: "Eng", nativeName: "English", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "ru", name: "Russian", short: "Rus", nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", flag: "\u{1F1F7}\u{1F1FA}" },
  { code: "pt", name: "Portuguese", short: "Por", nativeName: "Portugu\u00EAs", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "es", name: "Spanish", short: "Esp", nativeName: "Espa\u00F1ol", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "fr", name: "French", short: "Fra", nativeName: "Fran\u00E7ais", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "de", name: "German", short: "Deu", nativeName: "Deutsch", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "it", name: "Italian", short: "Ita", nativeName: "Italiano", flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "zh", name: "Chinese", short: "Chn", nativeName: "\u4E2D\u6587", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "ja", name: "Japanese", short: "Jpn", nativeName: "\u65E5\u672C\u8A9E", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "ko", name: "Korean", short: "Kor", nativeName: "\uD55C\uAD6D\uC5B4", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "ar", name: "Arabic", short: "Ara", nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "tr", name: "Turkish", short: "Tur", nativeName: "T\u00FCrk\u00E7e", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "pl", name: "Polish", short: "Pol", nativeName: "Polski", flag: "\u{1F1F5}\u{1F1F1}" },
  { code: "uk", name: "Ukrainian", short: "Ukr", nativeName: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430", flag: "\u{1F1FA}\u{1F1E6}" },
  { code: "nl", name: "Dutch", short: "Nld", nativeName: "Nederlands", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "hi", name: "Hindi", short: "Hin", nativeName: "\u0939\u093F\u0928\u094D\u0926\u0940", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "he", name: "Hebrew", short: "Heb", nativeName: "\u05E2\u05D1\u05E8\u05D9\u05EA", flag: "\u{1F1EE}\u{1F1F1}" },
  { code: "th", name: "Thai", short: "Tha", nativeName: "\u0E44\u0E17\u0E22", flag: "\u{1F1F9}\u{1F1ED}" },
  { code: "vi", name: "Vietnamese", short: "Vie", nativeName: "Ti\u1EBFng Vi\u1EC7t", flag: "\u{1F1FB}\u{1F1F3}" },
  { code: "ro", name: "Romanian", short: "Ron", nativeName: "Rom\u00E2n\u0103", flag: "\u{1F1F7}\u{1F1F4}" },
];

export function getLang(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? { code, name: code, short: code, nativeName: code, flag: "\u{1F3F3}\u{FE0F}" };
}
