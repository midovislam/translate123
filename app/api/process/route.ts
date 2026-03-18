import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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

    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const langA = formData.get("langA") as string;
    const langB = formData.get("langB") as string;

    if (!audio || !langA || !langB) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const langAName = LANG_NAMES[langA] ?? langA;
    const langBName = LANG_NAMES[langB] ?? langB;

    // Step 1: Whisper transcription (language auto-detected)
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      response_format: "verbose_json",
    });

    const detectedLang = transcription.language; // e.g. "russian", "portuguese"
    const text = transcription.text.trim();

    if (!text) {
      return NextResponse.json({ error: "No speech detected" }, { status: 422 });
    }

    // Step 2: Determine direction from Whisper's detected language
    let sourceLang: string;
    let targetLang: string;
    let targetName: string;

    if (detectedLang && normalize(detectedLang) === normalize(langAName)) {
      sourceLang = langA;
      targetLang = langB;
      targetName = langBName;
    } else if (detectedLang && normalize(detectedLang) === normalize(langBName)) {
      sourceLang = langB;
      targetLang = langA;
      targetName = langAName;
    } else {
      // Fallback: assume langA if can't determine
      sourceLang = langA;
      targetLang = langB;
      targetName = langBName;
    }

    // Step 3: GPT-4o mini translation
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

    return NextResponse.json({
      original: text,
      translation,
      sourceLang,
      targetLang,
      detectedLang,
    });
  } catch (err) {
    console.error("API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function normalize(s: string) {
  return s.toLowerCase().trim();
}

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
