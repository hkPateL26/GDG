// GET /api/track?id=APP001 - Look up application status from Cloud Firestore

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const FALLBACK_APPLICATIONS: Record<string, any> = {
  APP001: { scheme: "PM Kisan Samman Nidhi", schemeEmoji: "🌾", status: "approved",   date: "2026-09-01", remarks: "₹2000 successfully credited to your linked bank account." },
  APP002: { scheme: "Ayushman Bharat PM-JAY", schemeEmoji: "🏥", status: "processing", date: "2026-09-10", remarks: "Documents under verification. Expected in 7 working days." },
  APP003: { scheme: "PM Awas Yojana",         schemeEmoji: "🏠", status: "pending",    date: "2026-09-15", remarks: "Awaiting field officer verification at your address." },
  APP004: { scheme: "Mudra Loan (Kishore)",   schemeEmoji: "💼", status: "rejected",   date: "2026-09-05", remarks: "Income proof document missing. Please reapply with proper documents." },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim().toUpperCase();

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    try {
      if (db) {
        const docRef = doc(db, "applications", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          return NextResponse.json({ application: snap.data(), source: "cloud-firestore", success: true });
        }
      }
    } catch (dbErr) {
      console.warn("Firestore lookup failed, checking fallback:", dbErr);
    }

    // Fallback lookup
    const fallback = FALLBACK_APPLICATIONS[id];
    if (fallback) {
      return NextResponse.json({ application: fallback, source: "fallback", success: true });
    }

    return NextResponse.json({ error: "Application not found", success: false }, { status: 404 });
  } catch (error) {
    console.error("Track API error:", error);
    return NextResponse.json({ error: "Server error", success: false }, { status: 500 });
  }
}
