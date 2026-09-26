import { getChatModel } from "@/lib/gemini";
import { ChatHistory } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, history }: { message: string; history: ChatHistory[] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Gemini requires chat history to start with 'user' and alternate properly
    let sanitizedHistory: ChatHistory[] = [];
    if (Array.isArray(history)) {
      // Find the first user message
      const firstUserIdx = history.findIndex((h) => h.role === "user");
      if (firstUserIdx !== -1) {
        sanitizedHistory = history.slice(firstUserIdx).filter((h, idx, arr) => {
          // ensure no consecutive identical roles
          if (idx === 0) return h.role === "user";
          return h.role !== arr[idx - 1].role;
        });
      }
    }

    const model = getChatModel();
    const chat = model.startChat({ history: sanitizedHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return NextResponse.json({ reply, success: true });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "AI service unavailable. Please try again.", success: false },
      { status: 500 }
    );
  }
}
