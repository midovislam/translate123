import { NextRequest, NextResponse } from "next/server";
import { resolveOpenAI } from "@/lib/apikey";

export async function POST(req: NextRequest) {
  try {
    const result = await resolveOpenAI(req, "stream-chunk");
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const { openai } = result;

    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const langA = formData.get("langA") as string;
    const langB = formData.get("langB") as string;

    if (!audio || !langA || !langB) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const langAName = LANG_NAMES[langA] ?? langA;
    const langBName = LANG_NAMES[langB] ?? langB;

    // Step 1: Whisper transcription (lightweight — no native greetings prompt)
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      response_format: "verbose_json",
    });

    const detectedLang = transcription.language;
    const text = transcription.text.trim();

    if (!text) {
      return NextResponse.json({ error: "No speech detected" }, { status: 422 });
    }

    // Step 2: Determine direction from Whisper's detected language
    const matched = detectedLang ? matchDetectedLang(detectedLang, langA, langB) : null;

    let sourceLang: string;
    let targetLang: string;
    let targetName: string;

    if (matched === langA) {
      sourceLang = langA;
      targetLang = langB;
      targetName = langBName;
    } else if (matched === langB) {
      sourceLang = langB;
      targetLang = langA;
      targetName = langAName;
    } else {
      sourceLang = langA;
      targetLang = langB;
      targetName = langBName;
    }

    // Step 3: GPT-4o-mini translation (minimal prompt for speed)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Translate to ${targetName}. Return only the translation.`,
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
    });
  } catch (err) {
    console.error("Stream chunk error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function normalize(s: string) {
  return s.toLowerCase().trim();
}

const WHISPER_ALIASES: Record<string, string> = {
  mandarin: "zh",
  cantonese: "zh",
  brasileiro: "pt",
  castellano: "es",
  farsi: "fa",
  persian: "fa",
  flemish: "nl",
};

function matchDetectedLang(detected: string, codeA: string, codeB: string): string | null {
  const d = normalize(detected);
  const nameA = normalize(LANG_NAMES[codeA] ?? "");
  const nameB = normalize(LANG_NAMES[codeB] ?? "");

  if (d === nameA) return codeA;
  if (d === nameB) return codeB;
  if (d === codeA) return codeA;
  if (d === codeB) return codeB;

  const aliasCode = WHISPER_ALIASES[d];
  if (aliasCode === codeA) return codeA;
  if (aliasCode === codeB) return codeB;

  if (nameA && d.includes(nameA)) return codeA;
  if (nameB && d.includes(nameB)) return codeB;
  if (nameA && nameA.includes(d) && d.length >= 3) return codeA;
  if (nameB && nameB.includes(d) && d.length >= 3) return codeB;

  return null;
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
