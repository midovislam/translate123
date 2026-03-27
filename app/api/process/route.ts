import { NextRequest, NextResponse } from "next/server";
import { resolveOpenAI } from "@/lib/apikey";
import { matchDetectedLang, getLangName } from "@/lib/matchLanguage";

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

    const langAName = getLangName(langA);
    const langBName = getLangName(langB);

    // Step 1: Whisper transcription (no multi-language prompt — it biases Whisper
    // into transcribing speech in the wrong language, e.g. English speech → Russian text)
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      response_format: "verbose_json",
    });

    const detectedLang = transcription.language; // e.g. "russian", "portuguese"
    const text = splitSentences(transcription.text.trim());

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
      // Fallback: assume langA if can't determine
      console.warn(`[process] Could not match Whisper language "${detectedLang}" to ${langA}/${langB}, falling back to langA`);
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
          content: `You are a translator. Translate the user's text to ${targetName}. Return only the translation, nothing else. Preserve tone, meaning, and line breaks faithfully.`,
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
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[process] error:", JSON.stringify({ message, stack }));
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function splitSentences(text: string): string {
  return text
    .replace(/([.!?。？！])\s+/g, "$1\n")
    .trim();
}
