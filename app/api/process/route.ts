import { NextRequest, NextResponse } from "next/server";
import { resolveOpenAI } from "@/lib/apikey";

export async function POST(req: NextRequest) {
  try {
    const result = await resolveOpenAI(req, "process");
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

    // Step 1: Whisper transcription with language prompt hint
    const promptHint = [NATIVE_GREETINGS[langA], NATIVE_GREETINGS[langB]].filter(Boolean).join(" ");

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      response_format: "verbose_json",
      ...(promptHint && { prompt: promptHint }),
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

// Native phrases help Whisper identify the language and improve accuracy
const NATIVE_GREETINGS: Record<string, string> = {
  ru: "Привет, как дела?",
  pt: "Olá, tudo bem?",
  en: "Hello, how are you?",
  es: "Hola, ¿cómo estás?",
  fr: "Bonjour, comment allez-vous?",
  de: "Hallo, wie geht es Ihnen?",
  it: "Ciao, come stai?",
  zh: "你好，你好吗？",
  ja: "こんにちは、お元気ですか？",
  ko: "안녕하세요, 어떻게 지내세요?",
  ar: "مرحبا، كيف حالك؟",
  tr: "Merhaba, nasılsınız?",
  pl: "Cześć, jak się masz?",
  uk: "Привіт, як справи?",
  nl: "Hallo, hoe gaat het?",
  hi: "नमस्ते, आप कैसे हैं?",
  he: "שלום, מה שלומך?",
  th: "สวัสดี สบายดีไหม?",
  vi: "Xin chào, bạn khỏe không?",
  ro: "Bună, ce mai faci?",
};

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
