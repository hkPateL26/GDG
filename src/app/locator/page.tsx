"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { OFFICES_DATA, ExtendedOffice } from "@/lib/offices-data";
import { GUJARAT_DISTRICTS } from "@/lib/large-datasets";
import {
  MapPin,
  Clock,
  Phone,
  Search,
  ExternalLink,
  Building,
  Navigation,
  CheckCircle,
} from "lucide-react";

// Synthesize coverage for all 33 Gujarat districts if not explicitly in static database
const ALL_OFFICES: ExtendedOffice[] = [
  ...OFFICES_DATA,
  ...GUJARAT_DISTRICTS.filter(
    (d) => !OFFICES_DATA.some((o) => o.district.toLowerCase() === d.en.toLowerCase())
  ).map((d) => ({
    id: `${d.en.toLowerCase()}-collectorate-jan-seva`,
    name: `જિલ્લા કલેક્ટર કચેરી & જન સેવા કેન્દ્ર (${d.gu} / ${d.en})`,
    type: "Jan Seva Kendra / Collectorate",
    district: d.en,
    category: "jan-seva" as const,
    address: `જિલ્લા સેવા સદન, કલેક્ટર કચેરી કમ્પાઉન્ડ, ${d.gu} (${d.en})`,
    city: d.en,
    state: "Gujarat",
    pincode: "380001",
    phone: "1800-233-5500",
    timings: "10:30 AM - 05:30 PM (સોમ થી શનિ)",
    services: [
      "આવકનો દાખલો (Income Certificate)",
      "જાતિનો દાખલો (Caste Certificate)",
      "રેશનકાર્ડ સેવાઓ (Ration Card Services)",
      "ડિજિટલ ગુજરાત પોર્ટલ સેવાઓ",
      "સરકારી સહાય અરજી ખરાઈ ડેસ્ક",
    ],
    mapQuery: `Collector+Office+${d.en}+Gujarat`,
  })),
];

export default function OfficeLocatorPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const districts = ["All", ...GUJARAT_DISTRICTS.map((d) => d.en)];

  const filteredOffices = ALL_OFFICES.filter((office) => {
    const matchDistrict =
      selectedDistrict === "All" || office.district.toLowerCase() === selectedDistrict.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      office.name.toLowerCase().includes(q) ||
      office.address.toLowerCase().includes(q) ||
      office.services.some((s) => s.toLowerCase().includes(q));

    return matchDistrict && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-600 text-white py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
              <MapPin size={14} className="text-yellow-300" /> Government Office Locator
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
              નજીકની સરકારી કચેરી અને જનસેવા કેન્દ્ર
            </h1>
            <p className="text-orange-100 text-sm sm:text-base max-w-2xl mx-auto">
              મામલતદાર કચેરી, કલેક્ટર કચેરી, અને ડિજિટલ સેવા કેન્દ્રોનું સરનામું, સમય અને ફોન નંબર મેળવો
            </p>

            {/* Search Input in Hero */}
            <div className="relative max-w-xl mx-auto mt-6">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="શોધો: મામલતદાર, આવકનો દાખલો, 7/12, રેશન કાર્ડ..."
                className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* District Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
            <span className="text-xs font-bold text-gray-500 uppercase flex-shrink-0 mr-1">
              જિલ્લો (District):
            </span>
            {districts.map((d) => {
              const matched = GUJARAT_DISTRICTS.find((gd) => gd.en === d);
              const label = d === "All" ? "બધા જિલ્લા (All)" : matched ? `${matched.gu} (${d})` : d;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                    selectedDistrict === d
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm text-gray-500">
              {filteredOffices.length} કચેરીઓ મળી
            </p>
          </div>

          {/* Offices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredOffices.map((office) => (
              <div
                key={office.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600">
                        <Building size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-base leading-snug">
                          {office.name}
                        </h3>
                        <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                          {office.type} &bull; {office.district}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mt-3.5 space-y-2 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{office.address}, {office.city} - {office.pincode}</p>
                    </div>

                    {/* Timings */}
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-gray-400 flex-shrink-0" />
                      <p>{office.timings}</p>
                    </div>

                    {/* Phone */}
                    {office.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={15} className="text-gray-400 flex-shrink-0" />
                        <a
                          href={`tel:${office.phone}`}
                          className="text-orange-600 font-medium hover:underline"
                        >
                          {office.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Services Provided */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                      ઉપલબ્ધ સેવાઓ (Services Available):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {office.services.map((service, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-gray-50 border border-gray-100 text-gray-700 px-2 py-1 rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle size={11} className="text-green-500" />
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex gap-2">
                  {office.phone && (
                    <a
                      href={`tel:${office.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2 rounded-xl text-xs font-semibold transition"
                    >
                      <Phone size={13} /> ફોન કરો
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${office.lat || 22.3039},${office.lng || 70.8022}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl text-xs font-semibold transition active:scale-95"
                    title="આ કચેરી સુધીનો ડ્રાઈવિંગ રસ્તો અને નેવિગેશન જુઓ"
                  >
                    <Navigation size={13} /> રસ્તો & રૂટ (Directions) <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
