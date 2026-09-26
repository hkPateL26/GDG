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
        {/* Anti-flash: hide page immediately if a non-default language is stored.
            This inline script runs synchronously BEFORE React hydrates, so the user
            never sees a flash of Gujarati content before translation kicks in. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var lang = localStorage.getItem('nagrikseva_selected_lang');
    if (lang && lang !== 'gu') {
      document.documentElement.style.opacity = '0';
      document.documentElement.style.transition = 'opacity 0.25s ease';
      // Safety net: always restore after 4s max (in case translate script fails)
      setTimeout(function() {
        document.documentElement.style.opacity = '1';
      }, 4000);
    }
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
