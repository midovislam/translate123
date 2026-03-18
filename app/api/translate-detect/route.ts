import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const LANG_NAMES: Record<string, string> = {
  ru: "russian", pt: "portuguese", en: "english", es: "spanish",
  fr: "french", de: "german", it: "italian", zh: "chinese",
  ja: "japanese", ko: "korean", ar: "arabic", tr: "turkish",
  pl: "polish", uk: "ukrainian", nl: "dutch", hi: "hindi",
  he: "hebrew", th: "thai", vi: "vietnamese", ro: "romanian",
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key. Add your OpenAI key in Settings." },
        { status: 401 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const { text, langA, langB } = await req.json();

    if (!text || !langA || !langB) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const langAName = LANG_NAMES[langA] ?? langA;
    const langBName = LANG_NAMES[langB] ?? langB;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a translator. The user's text is in either ${langAName} or ${langBName}. Detect which language the text is written in, then translate it to the other language. Reply with ONLY a JSON object: {"detected":"${langA}" or "${langB}","translation":"..."}. No other text.`,
        },
        { role: "user", content: text },
      ],
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    let detected: string;
    let translation: string;

    try {
      const parsed = JSON.parse(raw);
      detected = parsed.detected;
      translation = parsed.translation;
    } catch {
      // Fallback: assume langA → langB
      detected = langA;
      translation = raw;
    }

    const sourceLang = detected === langB ? langB : langA;
    const targetLang = sourceLang === langA ? langB : langA;

    return NextResponse.json({
      original: text,
      translation,
      sourceLang,
      targetLang,
    });
  } catch (err) {
    console.error("Translate-detect API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
