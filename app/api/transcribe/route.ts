import { NextRequest, NextResponse } from "next/server";
import { resolveOpenAI } from "@/lib/apikey";

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

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      response_format: "verbose_json",
    });

    const text = splitSentences(transcription.text.trim());

    if (!text) {
      return NextResponse.json({ error: "No speech detected" }, { status: 422 });
    }

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[transcribe] error:", JSON.stringify({ message, stack }));
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
