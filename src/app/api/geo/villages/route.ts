// =========================================================================
// GET /api/geo/villages - Ultra-Fast Redis-Cached Gujarat Village API
// Supports: search query, district filter, taluka filter, and latency timing.
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import { searchGujaratVillages, getTalukasForDistrict, GUJARAT_DISTRICTS_MASTER } from "@/lib/gujarat-geo-engine";
import { redisCache } from "@/lib/redis-cache";

export async function GET(req: NextRequest) {
  const startTime = performance.now();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const district = searchParams.get("district")?.trim() || "";
  const taluka = searchParams.get("taluka")?.trim() || "";
  const mode = searchParams.get("mode")?.trim() || "villages"; // "villages" | "talukas" | "districts"

  // 1. Districts List Request
  if (mode === "districts") {
    return NextResponse.json({
      success: true,
      districts: GUJARAT_DISTRICTS_MASTER,
      latencyMs: Math.round(performance.now() - startTime),
    });
  }

  // 2. Talukas List Request for a District
  if (mode === "talukas") {
    const cacheKey = `talukas_${district}`;
    const cachedTalukas = await redisCache.get(cacheKey);
    if (cachedTalukas) {
      return NextResponse.json({
        success: true,
        district,
        talukas: cachedTalukas,
        source: "redis-l1-cache",
        latencyMs: Math.round(performance.now() - startTime),
      });
    }

    const talukas = getTalukasForDistrict(district);
    await redisCache.set(cacheKey, talukas, 3600); // 1 hour TTL
    return NextResponse.json({
      success: true,
      district,
      talukas,
      source: "geo-engine",
      latencyMs: Math.round(performance.now() - startTime),
    });
  }

  // 3. Search Villages Request
  const cacheKey = `villages_${district}_${taluka}_${q}`;
  const cachedVillages = await redisCache.get(cacheKey);
  if (cachedVillages) {
    return NextResponse.json({
      success: true,
      villages: cachedVillages,
      source: "redis-l1-cache",
      latencyMs: Math.round(performance.now() - startTime),
    });
  }

  const villages = searchGujaratVillages(q, district, taluka, 25);
  await redisCache.set(cacheKey, villages, 600); // 10 min TTL

  return NextResponse.json({
    success: true,
    count: villages.length,
    villages,
    source: "geo-engine",
    latencyMs: Math.round(performance.now() - startTime),
  });
}
