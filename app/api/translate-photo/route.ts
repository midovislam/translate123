import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const LANG_NAMES: Record<string, string> = {
  ru: "russian", pt: "portuguese", en: "english", es: "spanish",
  fr: "french", de: "german", it: "italian", zh: "chinese",
  ja: "japanese", ko: "korean", ar: "arabic", tr: "turkish",
  pl: "polish", uk: "ukrainian", nl: "dutch", hi: "hindi",
  he: "hebrew", th: "thai", vi: "vietnamese", ro: "romanian",
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key. Add your OpenAI key in Settings." },
        { status: 401 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const langA = formData.get("langA") as string;
    const langB = formData.get("langB") as string;

    if (!image || !langA || !langB) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const langAName = LANG_NAMES[langA] ?? langA;
    const langBName = LANG_NAMES[langB] ?? langB;

    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = image.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a translator. The user works with exactly two languages: ${langAName} (code "${langA}") and ${langBName} (code "${langB}"). No other languages exist for you.

Step 1: Extract all visible text from the image.
Step 2: Decide which of the two languages the extracted text is MAINLY written in.
Step 3: Translate the extracted text into THE OTHER language. If the text is in ${langAName}, you MUST translate it to ${langBName}. If the text is in ${langBName}, you MUST translate it to ${langAName}. The "translation" field must NEVER be in the same language as the "original" field.

Reply with ONLY this JSON (no markdown, no explanation):
{"detected":"${langA}" or "${langB}","original":"<extracted text>","translation":"<translated text in the OTHER language>"}`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: dataUrl, detail: "high" },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 2048,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    let detected: string;
    let original: string;
    let translation: string;

    try {
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      const parsed = JSON.parse(cleaned);
      detected = parsed.detected;
      original = parsed.original;
      translation = parsed.translation;
    } catch {
      return NextResponse.json(
        { error: "Could not extract text from image" },
        { status: 422 }
      );
    }

    if (!original || !translation) {
      return NextResponse.json(
        { error: "No readable text found in image" },
        { status: 422 }
      );
    }

    // Normalize detected to one of the two valid codes
    const sourceLang = detected === langB ? langB : langA;
    const targetLang = sourceLang === langA ? langB : langA;

    // Safety: if model returned same text as both original and translation, it didn't translate
    if (original.trim() === translation.trim()) {
      return NextResponse.json(
        { error: "Translation failed — please try again" },
        { status: 422 }
      );
    }

    return NextResponse.json({ original, translation, sourceLang, targetLang });
  } catch (err) {
    console.error("Translate-photo API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
