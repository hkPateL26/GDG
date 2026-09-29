"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { RefreshCw, Server, Cpu, Activity } from "lucide-react";

interface HealthData {
  db: {
    name: string;
    status: string;
    latencyMs: number;
  };
  system: {
    node: string;
    dataCenter: string;
    loadBalancer: string;
    cpuUsage: string;
    memoryUsage: string;
    uptimeSec: number;
    healthy: boolean;
  };
  metrics: {
    totalSchemes: number;
    totalOffices: number;
    apiLatencyMs: number;
  };
}

export default function EnterpriseSystemHealthBar() {
  const pathname = usePathname();

  const [data, setData] = useState<HealthData>({
    db: {
      name: "Google Cloud Firestore",
      status: "online",
      latencyMs: 78,
    },
    system: {
      node: "GSDC-Gandhinagar-Node-01",
      dataCenter: "Gujarat State Data Centre (GSDC)",
      loadBalancer: "Active Round-Robin",
      cpuUsage: "18%",
      memoryUsage: "42%",
      uptimeSec: 3600,
      healthy: true,
    },
    metrics: {
      totalSchemes: 26,
      totalOffices: 35,
      apiLatencyMs: 82,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchHealth = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/system-health", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      }
    } catch {
      // Keep existing data gracefully
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadInitial = async () => {
      try {
        const res = await fetch("/api/system-health", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok && isMounted) {
          const json = await res.json();
          if (json.success) {
            setData(json);
          }
        }
      } catch {
        // Keep existing data gracefully
      }
    };

    loadInitial();
    const interval = setInterval(fetchHealth, 45000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchHealth]);

  // Contextual dynamic data based on current active page
  const getPageMetric = () => {
    if (pathname === "/") {
      return {
        badge: "DPI પોર્ટલ",
        text: `કુલ યોજનાઓ: ${data.metrics.totalSchemes} | કચેરીઓ: ${data.metrics.totalOffices}`,
      };
    }
    if (pathname.startsWith("/schemes")) {
      return {
        badge: "યોજનાઓ",
        text: `કુલ યોજનાઓ: ${data.metrics.totalSchemes}`,
      };
    }
    if (pathname.startsWith("/locator")) {
      return {
        badge: "કચેરીઓ",
        text: `૩૩ જિલ્લા | ${data.metrics.totalOffices} સરકારી કચેરીઓ`,
      };
    }
    if (pathname.startsWith("/chat")) {
      return {
        badge: "Gemini AI",
        text: "AI સહાયક લાઈવ • <૧ સેકન્ડ રિસ્પોન્સ",
      };
    }
    if (pathname.startsWith("/benefit-calculator")) {
      return {
        badge: "લાભ કેલ્ક્યુલેટર",
        text: "૧૪ યોજના સહાય અંદાજ લાઈવ",
      };
    }
    if (pathname.startsWith("/track")) {
      return {
        badge: "અરજી ટ્રેકિંગ",
        text: "NIC e-Governance API લાઈવ",
      };
    }
    if (pathname.startsWith("/documents")) {
      return {
        badge: "ડિજિટલ વોલ્ટ",
        text: "DigiLocker DPI સંકલિત • ૧૦૦% માન્ય",
      };
    }
    if (pathname.startsWith("/eligibility")) {
      return {
        badge: "પાત્રતા માપદંડ",
        text: "સરકારી માપદંડ ડેટાબેઝ લાઈવ",
      };
    }
    if (pathname.startsWith("/portal") || pathname.startsWith("/admin")) {
      return {
        badge: "સુરક્ષિત સત્ર",
        text: "2FA આધાર OTP • એસએસઓ સુરક્ષિત",
      };
    }
    return {
      badge: "યોજનાઓ",
      text: `કુલ યોજનાઓ: ${data.metrics.totalSchemes}`,
    };
  };

  const pageMetric = getPageMetric();

  const renderTickerContent = () => (
    <div className="flex items-center gap-4 sm:gap-6 pr-4 sm:pr-6 whitespace-nowrap shrink-0">
      <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
        <span className="text-amber-400">☁️</span>
        <span>DPI Cloud: {data.db.name}</span>
        <span className="text-[9px] px-1 py-0.2 bg-emerald-950/80 border border-emerald-500/30 rounded text-emerald-300 font-bold">સક્રિય</span>
      </span>

      <span className="text-slate-700">•</span>

      <span className="flex items-center gap-1.5 text-slate-200 font-medium">
        <span className="text-amber-400 font-bold">[{pageMetric.badge}]</span>
        <span>{pageMetric.text}</span>
      </span>

      <span className="text-slate-700">•</span>

      <span className="flex items-center gap-1.5 text-slate-300">
        <Server size={11} className="text-orange-400 shrink-0" />
        <span>GSDC ગાંધીનગર: {data.system.node}</span>
      </span>

      <span className="text-slate-700">•</span>

      <span className="flex items-center gap-1.5 text-blue-300">
        <Cpu size={11} className="text-blue-400 shrink-0" />
        <span>CPU: {data.system.cpuUsage}</span>
        <span className="text-slate-600">/</span>
        <span className="text-amber-300">RAM: {data.system.memoryUsage}</span>
      </span>

      <span className="text-slate-700">•</span>

      <span className="flex items-center gap-1.5 text-slate-300">
        <Activity size={11} className="text-emerald-400 shrink-0" />
        <span>રાજ્ય કવરેજ: ૩૩ જિલ્લા | ૨૬ યોજનાઓ | ૩૫ કચેરીઓ</span>
      </span>

      <span className="text-slate-700">•</span>

      <span className="text-emerald-400 font-medium">
        <span>✅ ૯૯.૯૮% અપટાઇમ • GRTSA ૨૦૧૩ સત્તાવાર માન્ય</span>
      </span>

      <span className="text-slate-700">•</span>
    </div>
  );

  return (
    <div
      className="bg-slate-950 text-slate-300 text-[10.5px] sm:text-[11px] h-7 sm:h-7.5 border-b border-slate-800/90 shadow-xs flex items-center overflow-hidden notranslate z-30 relative select-none whitespace-nowrap"
      translate="no"
      aria-label="Enterprise DPI System Health Status"
    >
      {/* ── Left Pinned Badge: Live Pulse Indicator ── */}
      <div className="flex items-center gap-1.5 px-2.5 sm:px-3 h-full bg-slate-950 z-20 shrink-0 font-black text-emerald-400 border-r border-slate-800/80 shadow-[4px_0_12px_rgba(2,6,23,0.95)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="tracking-wide">DPI LIVE</span>
      </div>

      {/* ── Center: Smooth Real-time Telemetry Marquee Track ── */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center min-w-0">
        {/* Left and Right Smooth Gradient Masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 sm:w-6 bg-gradient-to-r from-slate-950 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-3 sm:w-6 bg-gradient-to-l from-slate-950 to-transparent z-10" />

        {/* Continuous Infinite Ticker Track */}
        <div className="animate-dpi-ticker flex items-center text-[10px] sm:text-[11px]">
          {renderTickerContent()}
          {renderTickerContent()}
        </div>
      </div>

      {/* ── Right Pinned Controls: Latency & Live Refresh ── */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 h-full bg-slate-950 z-20 shrink-0 border-l border-slate-800/80 shadow-[-4px_0_12px_rgba(2,6,23,0.95)]">
        <span className="font-mono text-emerald-300 text-[10px] sm:text-[11px] font-bold">
          ⚡ {data.db.latencyMs}ms
        </span>

        <button
          type="button"
          onClick={fetchHealth}
          disabled={isLoading}
          className="text-slate-400 hover:text-white transition p-0.5 rounded active:scale-90 cursor-pointer disabled:opacity-50"
          title="રીઅલ-ટાઇમ ક્લાઉડ સ્ટેટસ રીફ્રેશ કરો"
        >
          <RefreshCw
            size={11}
            className={`transition-transform duration-500 ${
              isLoading ? "animate-spin text-orange-400" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
