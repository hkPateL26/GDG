import { NextRequest, NextResponse } from "next/server";
import { INITIAL_PUBLIC_NOTICES, PublicNotice } from "@/lib/public-notices-data";
import { redisCache } from "@/lib/redis-cache";
import { getOfficerSessionFromRequest } from "@/lib/officer-auth";

const CACHE_KEY_NOTICES = "cms:public_notices:v1";

export async function GET() {
  try {
    // 1. Check Redis / In-memory Edge cache (<1ms)
    const cached = await redisCache.get<PublicNotice[]>(CACHE_KEY_NOTICES);
    if (cached) {
      return NextResponse.json({
        success: true,
        count: cached.length,
        source: "redis-l1-cache",
        notices: cached,
      });
    }

    // 2. Fallback to initial notices
    await redisCache.set(CACHE_KEY_NOTICES, INITIAL_PUBLIC_NOTICES, 300);

    return NextResponse.json({
      success: true,
      count: INITIAL_PUBLIC_NOTICES.length,
      source: "static-source",
      notices: INITIAL_PUBLIC_NOTICES,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMsg, notices: INITIAL_PUBLIC_NOTICES },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const officer = await getOfficerSessionFromRequest(req);
    if (!officer || (!officer.canModifyPolicy && officer.tierLevel > 2)) {
      return NextResponse.json(
        { success: false, error: "અનધિકૃત ઍક્સેસ. ફક્ત સચિવાલય/જિલ્લા વહીવટી અધિકારીઓને પરવાનગી છે." },
        { status: 403 }
      );
    }

    const notice: PublicNotice = await req.json();
    if (!notice.id || !notice.titleGu) {
      return NextResponse.json(
        { success: false, error: "Notice ID and Gujarati Title are required." },
        { status: 400 }
      );
    }

    // Invalidate Redis Cache
    await redisCache.delete(CACHE_KEY_NOTICES);

    return NextResponse.json({
      success: true,
      message: "Notice saved successfully and Redis cache invalidated.",
      notice,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to save notice";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
