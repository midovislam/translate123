export interface Language {
  code: string;
  name: string;
  short: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const LANGUAGES: Language[] = [
  // — Major world languages —
  { code: "en", name: "English", short: "Eng", nativeName: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", short: "Esp", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", short: "Fra", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", short: "Deu", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", short: "Por", nativeName: "Português", flag: "🇧🇷" },
  { code: "it", name: "Italian", short: "Ita", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "ru", name: "Russian", short: "Rus", nativeName: "Русский", flag: "🇷🇺" },
  { code: "uk", name: "Ukrainian", short: "Ukr", nativeName: "Українська", flag: "🇺🇦" },
  { code: "pl", name: "Polish", short: "Pol", nativeName: "Polski", flag: "🇵🇱" },
  { code: "nl", name: "Dutch", short: "Nld", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "ro", name: "Romanian", short: "Ron", nativeName: "Română", flag: "🇷🇴" },
  { code: "tr", name: "Turkish", short: "Tur", nativeName: "Türkçe", flag: "🇹🇷" },

  // — Nordic —
  { code: "sv", name: "Swedish", short: "Sve", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "da", name: "Danish", short: "Dan", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "no", name: "Norwegian", short: "Nor", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "fi", name: "Finnish", short: "Fin", nativeName: "Suomi", flag: "🇫🇮" },

  // — Central/Southeast European —
  { code: "cs", name: "Czech", short: "Ces", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "hu", name: "Hungarian", short: "Hun", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "sk", name: "Slovak", short: "Slk", nativeName: "Slovenčina", flag: "🇸🇰" },
  { code: "sl", name: "Slovenian", short: "Slv", nativeName: "Slovenščina", flag: "🇸🇮" },
  { code: "hr", name: "Croatian", short: "Hrv", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "sr", name: "Serbian", short: "Srp", nativeName: "Српски", flag: "🇷🇸" },
  { code: "bg", name: "Bulgarian", short: "Bul", nativeName: "Български", flag: "🇧🇬" },
  { code: "el", name: "Greek", short: "Ell", nativeName: "Ελληνικά", flag: "🇬🇷" },

  // — Baltic —
  { code: "lt", name: "Lithuanian", short: "Lit", nativeName: "Lietuvių", flag: "🇱🇹" },
  { code: "lv", name: "Latvian", short: "Lav", nativeName: "Latviešu", flag: "🇱🇻" },
  { code: "et", name: "Estonian", short: "Est", nativeName: "Eesti", flag: "🇪🇪" },

  // — Asian —
  { code: "zh", name: "Chinese", short: "Chn", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", short: "Jpn", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", short: "Kor", nativeName: "한국어", flag: "🇰🇷" },
  { code: "hi", name: "Hindi", short: "Hin", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", short: "Ben", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "th", name: "Thai", short: "Tha", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", short: "Vie", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", short: "Ind", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Malay", short: "Msa", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "fil", name: "Filipino", short: "Fil", nativeName: "Filipino", flag: "🇵🇭" },

  // — African —
  { code: "af", name: "Afrikaans", short: "Afr", nativeName: "Afrikaans", flag: "🇿🇦" },
  { code: "sw", name: "Swahili", short: "Swa", nativeName: "Kiswahili", flag: "🇰🇪" },

  // — RTL languages —
  { code: "ar", name: "Arabic", short: "Ara", nativeName: "العربية", flag: "🇸🇦", rtl: true },
  { code: "he", name: "Hebrew", short: "Heb", nativeName: "עברית", flag: "🇮🇱", rtl: true },
  { code: "ur", name: "Urdu", short: "Urd", nativeName: "اردو", flag: "🇵🇰", rtl: true },
  { code: "fa", name: "Persian", short: "Far", nativeName: "فارسی", flag: "🇮🇷", rtl: true },
];

export function getLang(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? { code, name: code, short: code, nativeName: code, flag: "🏳️" };
}

export function isRtl(code: string): boolean {
  return LANGUAGES.find((l) => l.code === code)?.rtl === true;
}

/** Whisper language name mapping (lowercase) — used for language detection */
export const LANG_NAMES: Record<string, string> = {
  en: "english", es: "spanish", fr: "french", de: "german",
  pt: "portuguese", it: "italian", ru: "russian", uk: "ukrainian",
  pl: "polish", nl: "dutch", ro: "romanian", tr: "turkish",
  sv: "swedish", da: "danish", no: "norwegian", fi: "finnish",
  cs: "czech", hu: "hungarian", sk: "slovak", sl: "slovenian",
  hr: "croatian", sr: "serbian", bg: "bulgarian", el: "greek",
  lt: "lithuanian", lv: "latvian", et: "estonian",
  zh: "chinese", ja: "japanese", ko: "korean",
  hi: "hindi", bn: "bengali", th: "thai", vi: "vietnamese",
  id: "indonesian", ms: "malay", fil: "filipino",
  af: "afrikaans", sw: "swahili",
  ar: "arabic", he: "hebrew", ur: "urdu", fa: "persian",
};

/** Native phrases to help Whisper identify the language and improve accuracy */
export const NATIVE_GREETINGS: Record<string, string> = {
  en: "Hello, how are you? The weather is nice today. Please tell me more.",
  es: "Hola, ¿cómo estás? Hoy hace buen tiempo. Cuéntame, por favor.",
  fr: "Bonjour, comment allez-vous? Il fait beau aujourd'hui. Dites-moi, s'il vous plaît.",
  de: "Hallo, wie geht es Ihnen? Das Wetter ist heute schön. Erzählen Sie mir bitte.",
  pt: "Olá, tudo bem? Hoje o tempo está bom. Me conta, por favor.",
  it: "Ciao, come stai? Oggi il tempo è bello. Raccontami, per favore.",
  ru: "Привет, как дела? Сегодня хорошая погода. Расскажи мне, пожалуйста.",
  uk: "Привіт, як справи? Сьогодні гарна погода. Розкажи мені, будь ласка.",
  pl: "Cześć, jak się masz? Dzisiaj jest ładna pogoda. Opowiedz mi, proszę.",
  nl: "Hallo, hoe gaat het? Het weer is mooi vandaag. Vertel me alsjeblieft.",
  ro: "Bună, ce mai faci? Azi e vreme frumoasă. Spune-mi, te rog.",
  tr: "Merhaba, nasılsınız? Bugün hava güzel. Lütfen bana anlatın.",
  sv: "Hej, hur mår du? Vädret är fint idag. Berätta för mig, tack.",
  da: "Hej, hvordan har du det? Vejret er godt i dag. Fortæl mig, tak.",
  no: "Hei, hvordan har du det? Været er fint i dag. Fortell meg, vær så snill.",
  fi: "Hei, mitä kuuluu? Sää on kaunis tänään. Kerro minulle, ole hyvä.",
  cs: "Ahoj, jak se máš? Dnes je hezké počasí. Řekni mi, prosím.",
  hu: "Szia, hogy vagy? Ma szép az idő. Mesélj, kérlek.",
  sk: "Ahoj, ako sa máš? Dnes je pekné počasie. Povedz mi, prosím.",
  sl: "Živijo, kako si? Danes je lepo vreme. Povej mi, prosim.",
  hr: "Bok, kako si? Danas je lijepo vrijeme. Reci mi, molim te.",
  sr: "Здраво, како си? Данас је лепо време. Реци ми, молим те.",
  bg: "Здравей, как си? Днес времето е хубаво. Разкажи ми, моля.",
  el: "Γεια σου, τι κάνεις; Ο καιρός είναι ωραίος σήμερα. Πες μου, σε παρακαλώ.",
  lt: "Sveiki, kaip sekasi? Šiandien gražus oras. Papasakok man, prašau.",
  lv: "Sveiki, kā jums klājas? Šodien ir skaists laiks. Pastāstiet man, lūdzu.",
  et: "Tere, kuidas läheb? Täna on ilus ilm. Räägi mulle, palun.",
  zh: "你好，你好吗？今天天气很好。请告诉我更多。",
  ja: "こんにちは、お元気ですか？今日はいい天気ですね。教えてください。",
  ko: "안녕하세요, 어떻게 지내세요? 오늘 날씨가 좋네요. 말씀해 주세요.",
  hi: "नमस्ते, आप कैसे हैं? आज मौसम अच्छा है। कृपया मुझे बताइए।",
  bn: "নমস্কার, আপনি কেমন আছেন? আজ আবহাওয়া ভালো। অনুগ্রহ করে আমাকে বলুন।",
  th: "สวัสดี สบายดีไหม? วันนี้อากาศดีนะ กรุณาบอกฉันด้วย",
  vi: "Xin chào, bạn khỏe không? Hôm nay thời tiết đẹp. Hãy kể cho tôi nghe.",
  id: "Halo, apa kabar? Cuaca hari ini bagus. Tolong ceritakan kepada saya.",
  ms: "Hai, apa khabar? Cuaca hari ini bagus. Sila ceritakan kepada saya.",
  fil: "Kumusta, kamusta ka? Maganda ang panahon ngayon. Pakisabi sa akin.",
  af: "Hallo, hoe gaan dit? Die weer is mooi vandag. Vertel my asseblief.",
  sw: "Habari, hujambo? Hali ya hewa ni nzuri leo. Tafadhali niambie.",
  ar: "مرحبا، كيف حالك؟ الطقس جميل اليوم. أخبرني من فضلك.",
  he: "שלום, מה שלומך? מזג האוויר יפה היום. ספר לי בבקשה.",
  ur: "السلام علیکم، آپ کیسے ہیں؟ آج موسم اچھا ہے۔ براہ کرم مجھے بتائیں۔",
  fa: "سلام، حال شما چطور است؟ امروز هوا خوب است. لطفاً به من بگویید.",
};
