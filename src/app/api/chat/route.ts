import { getChatModel } from "@/lib/gemini";
import { ChatHistory } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, history }: { message: string; history: ChatHistory[] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const model = getChatModel();
    const chat = model.startChat({ history: history || [] });
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
