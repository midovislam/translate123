import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const userKey = req.headers.get("x-api-key");
    const apiKey = userKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "No API key" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { text, lang } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.audio.speech.create({
      model: "tts-1-hd",
      input: text,
      voice: "nova",
      response_format: "mp3",
    });

    return new Response(response.body, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    console.error("TTS error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
