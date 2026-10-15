import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import {
  getAllActiveOffices,
  saveCustomOffice,
  deleteCustomOffice,
  ExtendedOffice,
} from "@/lib/offices-data";
import { redisCache } from "@/lib/redis-cache";

export const dynamic = "force-dynamic";

const CACHE_KEY_OFFICES_PREFIX = "offices:all:v1";

/**
 * Helper to execute Firestore operations with strict timeout
 * so the API NEVER hangs indefinitely if Firestore stream retries.
 */
function firestoreTimeout<T>(promise: Promise<T>, ms = 1200): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms`)), ms)
    ),
  ]);
}

export async function GET(req: NextRequest) {
  const startTime = performance.now();

  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district")?.trim();
    const search = searchParams.get("search")?.trim() || "";

    const bundled = getAllActiveOffices();
    let allOffices = bundled;

    // Optional Firestore sync with strict 1.2s timeout
    if (db) {
      try {
        const colRef = collection(db, "offices");
        const snapshot = await firestoreTimeout(getDocs(colRef), 1200);

        if (snapshot && !snapshot.empty) {
          const dbDocs = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as (ExtendedOffice & { _deleted?: boolean })[];

          const dbMap = new Map<string, ExtendedOffice & { _deleted?: boolean }>();
          dbDocs.forEach((d) => dbMap.set(d.id, d));

          const merged: ExtendedOffice[] = [];

          // 1. Add active db docs
          dbDocs.forEach((d) => {
            if (!d._deleted) {
              merged.push(d);
            }
          });

          // 2. Add bundled not overridden
          bundled.forEach((o) => {
            if (!dbMap.has(o.id)) {
              merged.push(o);
            }
          });

          allOffices = merged;
        }
      } catch (dbErr: any) {
        // Fallback to local memory immediately without hanging
        console.warn("Firestore offices fetch warning (using memory):", dbErr?.message || dbErr);
      }
    }

    let filtered = allOffices;

    if (district && district.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (o) => o.district.toLowerCase() === district.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          (o.nameGu && o.nameGu.includes(search)) ||
          o.address.toLowerCase().includes(q) ||
          o.district.toLowerCase().includes(q) ||
          (o.taluka && o.taluka.toLowerCase().includes(q)) ||
          o.services.some((s) => s.toLowerCase().includes(q) || s.includes(search))
      );
    }

    const elapsed = Math.round(performance.now() - startTime);

    return NextResponse.json({
      success: true,
      offices: filtered,
      total: filtered.length,
      totalAll: allOffices.length,
      latencyMs: elapsed,
    });
  } catch (err) {
    console.error("Offices GET API error:", err);
    const fallback = getAllActiveOffices();
    return NextResponse.json({
      success: true,
      offices: fallback,
      total: fallback.length,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.name || !body.district) {
      return NextResponse.json(
        { success: false, error: "કચેરીનું નામ અને જિલ્લો ફરજિયાત છે." },
        { status: 400 }
      );
    }

    const cleanId = (
      body.id ||
      `${body.district.toLowerCase()}-${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
    )
      .trim()
      .replace(/^-+|-+$/g, "");

    const office: ExtendedOffice = {
      id: cleanId,
      name: body.name.trim(),
      nameGu: body.nameGu?.trim() || body.name.trim(),
      type: body.type || "Jan Seva Kendra & Mamlatdar",
      district: body.district.trim(),
      taluka: body.taluka?.trim() || body.city?.trim() || "",
      category: body.category || "jan-seva",
      address: body.address?.trim() || `તાલુકા સેવા સદન, ${body.district}`,
      city: body.city?.trim() || body.district.trim(),
      state: "Gujarat",
      pincode: body.pincode?.trim() || "360001",
      phone: body.phone?.trim() || "1800-233-5500",
      timings: body.timings?.trim() || "૧૦:૩૦ AM - ૦૫:૩૦ PM (સોમ થી શનિ)",
      services:
        Array.isArray(body.services) && body.services.length > 0
          ? body.services
          : [
              "આવકનો દાખલો (Income Certificate)",
              "જાતિનો દાખલો (Caste Certificate)",
              "રેશનકાર્ડ સેવાઓ (Ration Card Services)",
              "ડિજિટલ ગુજરાત પોર્ટલ સેવાઓ",
            ],
      mapQuery: body.mapQuery?.trim() || `${body.name}+${body.district}+Gujarat`,
      lat: typeof body.lat === "number" ? body.lat : 22.3039,
      lng: typeof body.lng === "number" ? body.lng : 70.8022,
      crowdLevel: body.crowdLevel || "medium",
      estimatedWaitMins: body.estimatedWaitMins || 15,
    };

    // 1. In-memory & Local Storage Registry (Instant <1ms)
    saveCustomOffice(office);

    // 2. Bust Redis Cache
    try {
      await redisCache.del(CACHE_KEY_OFFICES_PREFIX);
    } catch {
      // cache non-fatal
    }

    // 3. Firestore (Non-blocking background save with timeout safety - NEVER blocks HTTP response)
    if (db) {
      firestoreTimeout(setDoc(doc(db, "offices", office.id), office), 1500).catch(
        (dbErr: any) => {
          console.warn("Firestore office background save warning (skipped):", dbErr?.message || dbErr);
        }
      );
    }

    return NextResponse.json({
      success: true,
      office,
      message: "સરકારી કચેરી / જન સેવા કેન્દ્ર સફળતાપૂર્વક સાચવવામાં આવી છે.",
    });
  } catch (error) {
    console.error("Save office error:", error);
    return NextResponse.json(
      { success: false, error: "કચેરી સાચવવામાં ક્ષતિ આવી." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id")?.trim();

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id?.trim();
      } catch {
        // No body
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Office ID required." },
        { status: 400 }
      );
    }

    // 1. In-memory Registry (Instant <1ms)
    deleteCustomOffice(id);

    // 2. Bust Redis Cache
    try {
      await redisCache.del(CACHE_KEY_OFFICES_PREFIX);
    } catch {
      // cache non-fatal
    }

    // 3. Firestore (Non-blocking background delete with timeout safety)
    if (db) {
      firestoreTimeout(
        setDoc(doc(db, "offices", id), { id, _deleted: true }, { merge: true }),
        1500
      ).catch((dbErr: any) => {
        console.warn("Firestore office background delete warning (skipped):", dbErr?.message || dbErr);
      });
    }

    return NextResponse.json({
      success: true,
      id,
      message: "કચેરી સફળતાપૂર્વક રદ કરવામાં આવી છે.",
    });
  } catch (error) {
    console.error("Delete office error:", error);
    return NextResponse.json(
      { success: false, error: "કચેરી રદ કરવામાં ક્ષતિ આવી." },
      { status: 500 }
    );
  }
}
