interface Quote {
  text: string;
  author: string;
}

const QUOTES: Record<string, Quote> = {
  en: { text: "To be or not to be, that is the question.", author: "Shakespeare" },
  ru: { text: "\u0414\u0443\u0448\u0430 \u043E\u0431\u044F\u0437\u0430\u043D\u0430 \u0442\u0440\u0443\u0434\u0438\u0442\u044C\u0441\u044F \u0438 \u0434\u0435\u043D\u044C \u0438 \u043D\u043E\u0447\u044C, \u0438 \u0434\u0435\u043D\u044C \u0438 \u043D\u043E\u0447\u044C.", author: "\u0417\u0430\u0431\u043E\u043B\u043E\u0446\u043A\u0438\u0439" },
  pt: { text: "A vida \u00E9 a arte do encontro, embora haja tanto desencontro pela vida.", author: "Vin\u00EDcius de Moraes" },
  es: { text: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme...", author: "Cervantes" },
  fr: { text: "On ne voit bien qu\u2019avec le c\u0153ur. L\u2019essentiel est invisible pour les yeux.", author: "Saint-Exup\u00E9ry" },
  de: { text: "Wovon man nicht sprechen kann, dar\u00FCber muss man schweigen.", author: "Wittgenstein" },
};

export function getQuote(code: string): Quote | null {
  return QUOTES[code] ?? null;
}
