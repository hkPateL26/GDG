import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import FloatingInstallBanner from "@/components/FloatingInstallBanner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ScrollRestoration from "@/components/ScrollRestoration";
import GoogleTranslateScript from "@/components/GoogleTranslateScript";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "NagrikSeva AI – Government Schemes Assistant",
  description:
    "AI-powered assistant to find government schemes, check eligibility and required documents. Available in Gujarati, Hindi and English.",
  keywords: ["government schemes", "PM Kisan", "Ayushman Bharat", "nagrik seva", "AI assistant"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "નાગરિકસેવા AI",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ea580c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="gu" className={inter.className} suppressHydrationWarning>
      <head>
        {/*
          ANTI-FLASH LOADER — runs synchronously before React hydrates.
          
          Key trick: visibility:hidden on <body> hides all page content.
          The injected spinner div has visibility:visible which OVERRIDES
          the parent's hidden state (unlike opacity which cannot be overridden).
          
          So: user sees spinner immediately from frame 1 — zero Gujarati flash.
          GoogleTranslateScript fires nagrikseva:pageReady → content revealed.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var lang = localStorage.getItem('nagrikseva_selected_lang');
    if (!lang || lang === 'gu') return; // Gujarati: no loader needed

    // Hide all page content (visibility can be overridden by children)
    document.documentElement.style.visibility = 'hidden';

    // Map: lang code → { native name, loading text in that language }
    var langInfo = {
      hi: { name: 'हिंदी', loading: 'लोड हो रहा है...' },
      en: { name: 'English', loading: 'Loading...' },
      mr: { name: 'मराठी', loading: 'लोड होत आहे...' },
      bn: { name: 'বাংলা', loading: 'লোড হচ্ছে...' },
      te: { name: 'తెలుగు', loading: 'లోడ్ అవుతోంది...' },
      ta: { name: 'தமிழ்', loading: 'ஏற்றுகிறது...' },
      kn: { name: 'ಕನ್ನಡ', loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...' },
      ml: { name: 'മലയാളം', loading: 'ലോഡ് ചെയ്യുന്നു...' },
      pa: { name: 'ਪੰਜਾਬੀ', loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...' },
      or: { name: 'ଓଡ଼ିଆ', loading: 'ଲୋଡ୍ ହେଉଛି...' },
      ur: { name: 'اردو', loading: 'لوڈ ہو رہا ہے...' },
      as: { name: 'অসমীয়া', loading: 'লোড হৈছে...' },
      sa: { name: 'संस्कृतम्', loading: 'लोड भवति...' },
      ne: { name: 'नेपाली', loading: 'लोड हुँदैछ...' }
    };
    var info = langInfo[lang] || { name: lang.toUpperCase(), loading: 'Loading...' };

    // Inject spinner overlay with explicit visibility:visible (overrides parent hidden)
    function injectLoader() {
      if (document.getElementById('nagrik-preloader')) return;
      var el = document.createElement('div');
      el.id = 'nagrik-preloader';
      el.style.cssText = [
        'position:fixed',
        'inset:0',
        'background:#f9fafb',
        'z-index:2147483647',
        'display:flex',
        'flex-direction:column',
        'align-items:center',
        'justify-content:center',
        'gap:14px',
        'visibility:visible'  /* override parent visibility:hidden */
      ].join(';');
      el.innerHTML = [
        '<style>@keyframes _ns{to{transform:rotate(360deg)}}</style>',
        /* Spinner */
        '<div style="width:52px;height:52px;border:4px solid #fed7aa;border-top:4px solid #ea580c;border-radius:50%;animation:_ns 0.75s linear infinite"></div>',
        /* Selected language name — large, bold */
        '<div style="font-size:22px;font-weight:800;color:#ea580c;font-family:sans-serif;line-height:1">' + info.name + '</div>',
        /* Loading text in selected language — subtle */
        '<div style="font-size:12px;font-weight:500;color:#9a3412;font-family:sans-serif;opacity:0.8">' + info.loading + '</div>',
        /* App name below — small */
        '<div style="font-size:11px;font-weight:600;color:#c2410c;font-family:sans-serif;margin-top:4px;letter-spacing:0.3px">&#2728;&#2750;&#2711;&#2736;&#2752;&#2709;&#2744;&#2759;&#2703;&#2750; AI</div>'
      ].join('');
      document.body ? document.body.appendChild(el) : document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(el); });
    }

    // Try to inject immediately
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectLoader, {once:true});
    }
    injectLoader(); // also try right now (works if script is in body/after body open)

    // Safety net: always restore after 4s
    setTimeout(function(){
      document.documentElement.style.visibility = '';
      var el = document.getElementById('nagrik-preloader');
      if (el) el.remove();
    }, 4000);

    // Listen for pageReady signal from GoogleTranslateScript
    window.addEventListener('nagrikseva:pageReady', function(){
      document.documentElement.style.visibility = '';
      var el = document.getElementById('nagrik-preloader');
      if (el) {
        el.style.transition = 'opacity 0.25s ease';
        el.style.opacity = '0';
        setTimeout(function(){ el.remove(); }, 280);
      }
    }, {once: true});

  } catch(e) {}
})();
`,
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <ScrollRestoration />
          <ServiceWorkerRegister />
          {children}
          <FloatingInstallBanner />
          <GoogleTranslateScript />
        </LanguageProvider>
      </body>
    </html>
  );
}
