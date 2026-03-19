import { NextRequest, NextResponse } from "next/server";
import { resolveOpenAI } from "@/lib/apikey";

const LANG_NAMES: Record<string, string> = {
  ru: "russian", pt: "portuguese", en: "english", es: "spanish",
  fr: "french", de: "german", it: "italian", zh: "chinese",
  ja: "japanese", ko: "korean", ar: "arabic", tr: "turkish",
  pl: "polish", uk: "ukrainian", nl: "dutch", hi: "hindi",
  he: "hebrew", th: "thai", vi: "vietnamese", ro: "romanian",
};

export async function POST(req: NextRequest) {
  try {
    const result = await resolveOpenAI(req, "translate-photo");
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const { openai } = result;
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

    // Step 1: OCR only — extract text and detect language
    const ocrResult = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Extract all visible text from the image. Detect if the text is mainly ${langAName} or ${langBName}. Reply with ONLY this JSON (no markdown): {"detected":"${langA}" or "${langB}","text":"<extracted text>"}`,
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

    const ocrRaw = ocrResult.choices[0]?.message?.content?.trim() ?? "";
    let detected: string;
    let original: string;

    try {
      const cleaned = ocrRaw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      const parsed = JSON.parse(cleaned);
      detected = parsed.detected;
      original = parsed.text;
    } catch {
      return NextResponse.json(
        { error: "Could not extract text from image" },
        { status: 422 }
      );
    }

    if (!original) {
      return NextResponse.json(
        { error: "No readable text found in image" },
        { status: 422 }
      );
    }

    // Step 2: Translate extracted text (separate call — reliable)
    const sourceLang = detected === langB ? langB : langA;
    const targetLang = sourceLang === langA ? langB : langA;
    const targetName = LANG_NAMES[targetLang] ?? targetLang;

    const translateResult = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the user's text to ${targetName}. Return only the translation, nothing else. Preserve tone and meaning faithfully.`,
        },
        { role: "user", content: original },
      ],
      temperature: 0.3,
    });

    const translation = translateResult.choices[0]?.message?.content?.trim() ?? "";

    if (!translation) {
      return NextResponse.json(
        { error: "Translation failed" },
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
