import { NextRequest, NextResponse } from "next/server";

function splitTextIntoSpeechChunks(text: string, maxChunkLength = 160): string[] {
  const chunks: string[] = [];
  // Split on sentence terminators: '.', '।', '\n', '?', '!', ';'
  const rawSegments = text.split(/(?<=[.।\n?!;])\s+/);

  let current = "";
  for (const seg of rawSegments) {
    const trimmed = seg.trim();
    if (!trimmed) continue;

    if ((current + " " + trimmed).trim().length <= maxChunkLength) {
      current = (current + " " + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length <= maxChunkLength) {
        current = trimmed;
      } else {
        // Split long sentence by comma or words
        const words = trimmed.split(/\s+/);
        let sub = "";
        for (const w of words) {
          if ((sub + " " + w).trim().length <= maxChunkLength) {
            sub = (sub + " " + w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        current = sub;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.slice(0, 20); // Support up to 20 continuous sentences (~3000 chars)
}

async function generateAudioStream(rawText: string, lang: string) {
  if (!rawText.trim()) {
    return new NextResponse("Text is required", { status: 400 });
  }

  // Clean text for natural, fluent spoken playback
  let clean = rawText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip markdown links
    .replace(/[*#_~`>•]/g, " ") // strip markdown formatting symbols
    .replace(/https?:\/\/\S+/g, "") // strip urls
    .replace(/APP-GUJ-\d+/gi, (m) => m.replace(/-/g, " "))
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "") // strip emojis
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) {
    clean = lang === "hi" ? "नमस्ते" : lang === "en" ? "Hello" : "નમસ્તે";
  }

  const langCode = lang === "hi" ? "hi" : lang === "en" ? "en-IN" : "gu";
  const chunks = splitTextIntoSpeechChunks(clean);

  if (chunks.length === 0) {
    chunks.push(clean.slice(0, 160));
  }

  // Fetch all chunks concurrently to drastically reduce latency while preserving sentence order
  const chunkResults = await Promise.all(
    chunks.map(async (chunk) => {
      if (!chunk.trim()) return null;
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
        langCode
      )}&q=${encodeURIComponent(chunk.trim())}`;

      try {
        const ttsRes = await fetch(googleTtsUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });

        if (ttsRes.ok) {
          const arrBuf = await ttsRes.arrayBuffer();
          return Buffer.from(arrBuf);
        }
      } catch (chunkErr) {
        console.warn("TTS chunk fetch error:", chunkErr);
      }
      return null;
    })
  );

  const audioBuffers: Buffer[] = [];
  for (const buf of chunkResults) {
    if (buf) audioBuffers.push(buf);
  }

  if (audioBuffers.length === 0) {
    return new NextResponse("TTS generation failed", { status: 502 });
  }

  const combinedAudio = Buffer.concat(audioBuffers);

  return new NextResponse(combinedAudio, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawText = searchParams.get("text") || "";
    const lang = searchParams.get("lang") || "gu";
    return await generateAudioStream(rawText, lang);
  } catch (error) {
    console.error("TTS generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawText = body.text || "";
    const lang = body.lang || "gu";
    return await generateAudioStream(rawText, lang);
  } catch (error) {
    console.error("TTS POST generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
