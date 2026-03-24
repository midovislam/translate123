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

// TTS uses capitalized names for the speaking hint
const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German",
  pt: "Portuguese", it: "Italian", ru: "Russian", uk: "Ukrainian",
  pl: "Polish", nl: "Dutch", ro: "Romanian", tr: "Turkish",
  sv: "Swedish", da: "Danish", no: "Norwegian", fi: "Finnish",
  cs: "Czech", hu: "Hungarian", sk: "Slovak", sl: "Slovenian",
  hr: "Croatian", sr: "Serbian", bg: "Bulgarian", el: "Greek",
  lt: "Lithuanian", lv: "Latvian", et: "Estonian",
  zh: "Chinese", ja: "Japanese", ko: "Korean",
  hi: "Hindi", bn: "Bengali", th: "Thai", vi: "Vietnamese",
  id: "Indonesian", ms: "Malay", fil: "Filipino",
  af: "Afrikaans", sw: "Swahili",
  ar: "Arabic", he: "Hebrew", ur: "Urdu", fa: "Persian",
};
