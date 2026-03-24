import { NextRequest, NextResponse } from "next/server";
import { resolveOpenAI } from "@/lib/apikey";
import { NATIVE_GREETINGS } from "@/lib/languages";

function splitSentences(text: string): string {
  return text
    .replace(/([.!?。？！])\s+/g, "$1\n")
    .trim();
}

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

    const text = splitSentences(transcription.text.trim());

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
