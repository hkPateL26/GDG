// =========================================================================
// GET /api/track - Look up application status or query large-scale dataset
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { queryApplications, calculateSystemStats, TOTAL_SYSTEM_RECORDS } from "@/lib/large-datasets";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();
    const search = searchParams.get("search")?.trim() || "";
    const district = searchParams.get("district")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const statsOnly = searchParams.get("stats") === "true";

    // 1. If stats requested
    if (statsOnly) {
      return NextResponse.json({
        success: true,
        stats: calculateSystemStats(),
        totalRecords: TOTAL_SYSTEM_RECORDS,
      });
    }

    // 2. If single application ID is requested
    if (id) {
      const cleanId = id.toUpperCase();

      // Check Firestore if configured
      if (db) {
        try {
          const docRef = doc(db, "applications", cleanId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            return NextResponse.json({
              application: snap.data(),
              source: "cloud-firestore",
              success: true,
            });
          }
        } catch (dbErr) {
          console.warn("Firestore lookup failed, checking large dataset:", dbErr);
        }
      }

      // Query from 5,000+ realistic dataset
      const result = queryApplications({ search: cleanId, page: 1, limit: 1 });
      if (result.records.length > 0) {
        const item = result.records[0];
        return NextResponse.json({
          application: {
            id: item.id,
            scheme: item.schemeName,
            schemeGu: item.schemeNameGu,
            schemeEmoji: item.schemeEmoji,
            status: item.status,
            date: item.appliedDate,
            lastUpdated: item.lastUpdated,
            citizenName: item.citizenName,
            citizenNameGu: item.citizenNameGu,
            district: item.district,
            districtGu: item.districtGu,
            taluka: item.taluka,
            village: item.village,
            aadhaarLast4: item.aadhaarLast4,
            remarks: item.remarksGu,
            remarksEn: item.remarksEn,
            benefitAmount: item.benefitAmount,
            officerDesignation: item.officerDesignation,
          },
          source: "enterprise-dataset",
          success: true,
        });
      }

      return NextResponse.json(
        { error: `No application found for "${id}". Please check your application ID.`, success: false },
        { status: 404 }
      );
    }

    // 3. Otherwise return paginated enterprise query
    const data = queryApplications({
      search,
      district,
      status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Track API error:", error);
    return NextResponse.json({ error: "Server error", success: false }, { status: 500 });
  }
}
