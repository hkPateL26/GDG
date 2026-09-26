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
        'gap:16px',
        'visibility:visible'  /* override parent visibility:hidden */
      ].join(';');
      el.innerHTML = [
        '<style>@keyframes _ns{to{transform:rotate(360deg)}}</style>',
        '<div style="width:52px;height:52px;border:4px solid #fed7aa;border-top:4px solid #ea580c;border-radius:50%;animation:_ns 0.75s linear infinite"></div>',
        '<div style="font-size:13px;font-weight:700;color:#9a3412;letter-spacing:0.5px;font-family:sans-serif">&#2728;&#2750;&#2711;&#2736;&#2752;&#2709;&#2744;&#2759;&#2703;&#2750; AI</div>'
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
