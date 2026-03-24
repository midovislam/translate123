import { NextRequest, NextResponse } from "next/server";
import { resolveOpenAI } from "@/lib/apikey";
import { LANG_NAMES } from "@/lib/languages";

export async function POST(req: NextRequest) {
  try {
    const result = await resolveOpenAI(req, "translate");
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const { openai } = result;
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const targetName = LANG_NAMES[targetLang] ?? targetLang;

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

    return NextResponse.json({ translation });
  } catch (err) {
    console.error("Translate API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
