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
    const userKey = req.headers.get("x-api-key");
    const apiKey = userKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key. Add your OpenAI key in Settings." },
        { status: 401 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const targetName = LANG_NAMES[targetLang] ?? targetLang;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the user's text to ${targetName}. Return only the translation, nothing else. Preserve tone and meaning faithfully.`,
        },
        { role: "user", content: text },
      ],
      temperature: 0.3,
    });

    const translation = completion.choices[0]?.message?.content?.trim() ?? "";

    return NextResponse.json({ translation });
  } catch (err) {
    console.error("Translate API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
