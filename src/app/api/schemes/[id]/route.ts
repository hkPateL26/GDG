// =========================================================================
// GET /api/schemes/[id] - Dynamic Single Scheme Endpoint from Cloud Firestore
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getSchemeById } from "@/lib/schemes-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = performance.now();
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Scheme ID required", success: false }, { status: 400 });
  }

  // 1. Check Cloud Firestore
  if (db) {
    try {
      const docRef = doc(db, "schemes", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const elapsed = Math.round(performance.now() - startTime);
        return NextResponse.json({
          success: true,
          scheme: { id: snap.id, ...snap.data() },
          source: "cloud-firestore",
          serverCluster: "GSDC-Gandhinagar-Node-01",
          latencyMs: elapsed,
        });
      }
    } catch (err) {
      console.warn("Firestore single scheme fetch error:", err);
    }
  }

  // 2. Fallback to local registry
  const localScheme = getSchemeById(id);
  if (localScheme) {
    return NextResponse.json({
      success: true,
      scheme: localScheme,
      source: "fallback",
      serverCluster: "Local-Edge-Fallback",
      latencyMs: Math.round(performance.now() - startTime),
    });
  }

  return NextResponse.json(
    { success: false, error: `Scheme with ID "${id}" was not found.` },
    { status: 404 }
  );
}
