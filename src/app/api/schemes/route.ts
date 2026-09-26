// GET /api/schemes - Fetch schemes from Cloud Firestore with static fallback

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { SCHEMES_DATA, getSchemesByCategory } from "@/lib/schemes-data";

async function fetchFromFirestore(category?: string) {
  try {
    if (db) {
      const colRef = collection(db, "schemes");
      let q = query(colRef, where("isActive", "==", true));

      if (category && category !== "all") {
        q = query(colRef, where("category", "==", category), where("isActive", "==", true));
      }

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    }
  } catch (err) {
    console.warn("Firestore fetch error, falling back to local DB:", err);
  }

  // Fallback to static dataset if Firestore offline
  return category && category !== "all"
    ? getSchemesByCategory(category)
    : SCHEMES_DATA;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? "all";
    const search   = searchParams.get("search")   ?? "";

    let schemes = (await fetchFromFirestore(category)) as any[];

    if (search) {
      const q = search.toLowerCase();
      schemes = schemes.filter(
        (s: any) =>
          s.name?.toLowerCase().includes(q) ||
          s.nameGu?.includes(search) ||
          s.nameHi?.includes(search) ||
          s.description?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      schemes,
      total: schemes.length,
      source: "cloud-firestore",
      success: true,
    });
  } catch (error) {
    console.error("Schemes API error:", error);
    return NextResponse.json(
      { schemes: SCHEMES_DATA, total: SCHEMES_DATA.length, source: "fallback", success: true },
      { status: 200 }
    );
  }
}
