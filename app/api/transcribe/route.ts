import { NextRequest, NextResponse } from "next/server";
import { resolveOpenAI } from "@/lib/apikey";

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

export async function POST(req: NextRequest) {
  try {
    const result = await resolveOpenAI(req, "transcribe");
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

    const promptHint = [NATIVE_GREETINGS[langA], NATIVE_GREETINGS[langB]].filter(Boolean).join(" ");

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      response_format: "verbose_json",
      ...(promptHint && { prompt: promptHint }),
    });

    const text = transcription.text.trim();

    if (!text) {
      return NextResponse.json({ error: "No speech detected" }, { status: 422 });
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Transcribe API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
