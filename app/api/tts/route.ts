import { NextRequest } from "next/server";
import { resolveOpenAI } from "@/lib/apikey";

export async function POST(req: NextRequest) {
  try {
    const result = await resolveOpenAI(req, "tts");
    if ("error" in result) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: result.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { openai } = result;

    const { text, lang } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const langName = LANG_NAMES[lang];
    const input = langName
      ? `[Speaking in ${langName}] ${text}`
      : text;

    const response = await openai.audio.speech.create({
      model: "tts-1-hd",
      input,
      voice: "nova",
      response_format: "mp3",
    });

    return new Response(response.body, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err: unknown) {
    console.error("TTS error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

const LANG_NAMES: Record<string, string> = {
  ru: "Russian", pt: "Portuguese", en: "English", es: "Spanish",
  fr: "French", de: "German", it: "Italian", zh: "Chinese",
  ja: "Japanese", ko: "Korean", ar: "Arabic", tr: "Turkish",
  pl: "Polish", uk: "Ukrainian", nl: "Dutch", hi: "Hindi",
  he: "Hebrew", th: "Thai", vi: "Vietnamese", ro: "Romanian",
};
