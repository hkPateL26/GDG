import { NextRequest, NextResponse } from "next/server";
import { ChatSessionRecord } from "@/types";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query as fsQuery,
  where,
  orderBy,
  limit as fsLimit,
} from "firebase/firestore";

// Server-side in-memory store as fallback
const globalMemorySessions = new Map<string, ChatSessionRecord>();

function cleanForDb(obj: unknown): unknown {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(cleanForDb);
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (v !== undefined) {
      result[k] = cleanForDb(v);
    }
  }
  return result;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "guest";

    const sessions: ChatSessionRecord[] = [];

    if (db) {
      try {
        const colRef = collection(db, "chat_sessions");
        const q = fsQuery(
          colRef,
          where("citizenId", "==", userId),
          orderBy("updatedAt", "desc"),
          fsLimit(30)
        );
        const snap = await getDocs(q);
        snap.forEach((d) => {
          sessions.push(d.data() as ChatSessionRecord);
        });
      } catch (err) {
        console.warn("Firestore chat history read fallback:", err);
      }
    }

    if (sessions.length === 0) {
      // Fallback to in-memory store - STRICTLY ISOLATED BY userId
      for (const sess of globalMemorySessions.values()) {
        if (userId === "guest") {
          // Do NOT leak authenticated citizen sessions to guests!
          if (sess.citizenId === "guest") {
            sessions.push(sess);
          }
        } else if (sess.citizenId === userId) {
          sessions.push(sess);
        }
      }
      sessions.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return NextResponse.json({ sessions, success: true });
  } catch (error) {
    console.error("GET /api/chat/history error:", error);
    return NextResponse.json({ sessions: [], success: false, error: String(error) });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = body.session as ChatSessionRecord;

    if (!session || !session.id) {
      return NextResponse.json({ error: "Invalid session object" }, { status: 400 });
    }

    session.updatedAt = session.updatedAt || new Date().toISOString();
    session.createdAt = session.createdAt || new Date().toISOString();

    // Save in memory
    globalMemorySessions.set(session.id, session);

    // Save in Firestore if connected
    if (db) {
      try {
        const docRef = doc(db, "chat_sessions", session.id);
        await setDoc(docRef, cleanForDb(session) as Record<string, unknown>, { merge: true });
      } catch (err) {
        console.warn("Firestore save session fallback:", err);
      }
    }

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("POST /api/chat/history error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId") || "guest";
    const clearAll = searchParams.get("all") === "true";

    if (clearAll) {
      if (db) {
        try {
          const colRef = collection(db, "chat_sessions");
          const q = fsQuery(colRef, where("citizenId", "==", userId));
          const snap = await getDocs(q);
          const deletes = snap.docs.map((d) => deleteDoc(d.ref));
          await Promise.all(deletes);
        } catch {
          // ignore
        }
      }

      for (const [key, val] of globalMemorySessions.entries()) {
        if (userId === "guest") {
          if (val.citizenId === "guest") {
            globalMemorySessions.delete(key);
          }
        } else if (val.citizenId === userId) {
          globalMemorySessions.delete(key);
        }
      }

      return NextResponse.json({ success: true, clearedAll: true });
    }

    if (!id) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    globalMemorySessions.delete(id);

    if (db) {
      try {
        const docRef = doc(db, "chat_sessions", id);
        await deleteDoc(docRef);
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("DELETE /api/chat/history error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
