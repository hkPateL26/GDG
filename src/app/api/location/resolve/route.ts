import { NextRequest, NextResponse } from "next/server";
import { resolveLocationFromCoordinates } from "@/lib/location-resolver";

export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json();

    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    // First, resolve against local Gujarat administrative database
    const localResolved = resolveLocationFromCoordinates(lat, lng);

    // Also attempt fast reverse geocoding via OpenStreetMap Nominatim
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=gu,en`;
      const geoRes = await fetch(geoUrl, {
        headers: {
          "User-Agent": "NagrikSevaAI-GovPortal/1.0",
        },
        signal: AbortSignal.timeout(3000), // 3s timeout
      });

      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const address = geoData.address || {};
        const rawCandidate =
          address.village ||
          address.town ||
          address.suburb ||
          address.neighbourhood ||
          address.city ||
          "";

        // Filter out generic admin words like 'તાલુકા', 'taluka', 'rural', 'district'
        const isGenericWord =
          !rawCandidate ||
          rawCandidate.includes("તાલુકા") ||
          rawCandidate.toLowerCase().includes("taluka") ||
          rawCandidate.toLowerCase().includes("rural") ||
          rawCandidate.includes("જિલ્લો") ||
          rawCandidate.toLowerCase() === "gondal" ||
          rawCandidate === "ગોંડલ";

        const village = isGenericWord ? localResolved.village : rawCandidate;
        const villageGu =
          village === "Gomta" || village === "Momta" || village.includes("ગોમટા")
            ? "ગોમટા"
            : isGenericWord
            ? localResolved.villageGu
            : village;

        const taluka = localResolved.taluka || "Gondal";
        const talukaGu = localResolved.talukaGu || "ગોંડલ";
        const district = (address.state_district || address.county || localResolved.district).replace(/ District| જિલ્લો/gi, "");
        const districtGu = localResolved.districtGu || "રાજકોટ";

        return NextResponse.json({
          success: true,
          location: {
            ...localResolved,
            village,
            villageGu,
            taluka,
            talukaGu,
            district,
            districtGu,
            formattedAddress: geoData.display_name,
          },
        });
      }
    } catch {
      // ignore, fallback to local
    }

    return NextResponse.json({
      success: true,
      location: localResolved,
    });
  } catch (error) {
    console.error("Location resolve error:", error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        location: {
          village: "Gomta",
          villageGu: "ગોમટા",
          taluka: "Gondal",
          talukaGu: "ગોંડલ",
          district: "Rajkot",
          districtGu: "રાજકોટ",
          nearestOffice: "Taluka Seva Sadan & Mamlatdar Office, Gondal",
          nearestOfficeGu: "તાલુકા સેવા સદન & મામલતદાર કચેરી, ગોંડલ",
          distanceKm: 0,
          latitude: 21.9619,
          longitude: 70.7997,
        },
      },
      { status: 200 }
    );
  }
}
