import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory LRU response cache for instant repeated results (< 5ms)
const responseCache = new Map<string, { text: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

function getCached(key: string): string | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry.text;
}

function setCache(key: string, text: string) {
  if (responseCache.size > 200) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(key, { text, timestamp: Date.now() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, topic = "monograph", stream = true } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Valid prompt is required" }, { status: 400 });
    }

    const cleanPrompt = prompt.trim().slice(0, 500); // Guard against excessively large prompts
    const cacheKey = `${topic}:${cleanPrompt.toLowerCase()}`;

    // Fast cache hit: returns in < 5ms without Gemini API call
    const cachedResponse = getCached(cacheKey);
    if (cachedResponse) {
      if (stream) {
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(cachedResponse));
            controller.close();
          },
        });
        return new Response(readable, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600",
            "X-Cache": "HIT",
          },
        });
      }
      return NextResponse.json({ text: cachedResponse, cached: true });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = `Fine art study documenting architectural silence, light gradation, and volumetric presence across ${cleanPrompt}.`;
      return NextResponse.json({ text: fallback, fallback: true });
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1. FASTEST GEMINI MODEL FOR ROUTINE TASKS (gemini-3.1-flash-lite)
    // 2. CONCISE SYSTEM INSTRUCTION & TOKEN REDUCTION
    // 3. STRICT REASONABLE maxOutputTokens (250 tokens for millisecond response times)
    const model = "gemini-3.1-flash-lite";

    if (stream) {
      // 4. STREAMING RESPONSES INSTEAD OF WAITING FOR FULL RESULT
      const streamResult = await ai.models.generateContentStream({
        model,
        contents: cleanPrompt,
        config: {
          maxOutputTokens: 250,
          temperature: 0.6,
          systemInstruction:
            "You are an editorial photography curator for Still Studio. Provide concise, atmospheric, 2-3 sentence curatorial analysis.",
        },
      });

      const encoder = new TextEncoder();
      let fullResponseText = "";

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamResult) {
              const text = chunk.text || "";
              if (text) {
                fullResponseText += text;
                controller.enqueue(encoder.encode(text));
              }
            }
            if (fullResponseText) {
              setCache(cacheKey, fullResponseText);
            }
          } catch (err) {
            controller.error(err);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
          "X-Cache": "MISS",
        },
      });
    } else {
      const result = await ai.models.generateContent({
        model,
        contents: cleanPrompt,
        config: {
          maxOutputTokens: 250,
          temperature: 0.6,
          systemInstruction:
            "You are an editorial photography curator for Still Studio. Provide concise, atmospheric, 2-3 sentence curatorial analysis.",
        },
      });

      const responseText = result.text || "";
      setCache(cacheKey, responseText);
      return NextResponse.json({ text: responseText, cached: false });
    }
  } catch (error: any) {
    console.error("Curator API error:", error);
    return NextResponse.json(
      { error: "Failed to generate curatorial critique", details: error?.message || "" },
      { status: 500 }
    );
  }
}
