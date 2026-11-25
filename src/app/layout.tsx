import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import FloatingInstallBanner from "@/components/FloatingInstallBanner";
import FloatingVoiceHotlineButton from "@/components/FloatingVoiceHotlineButton";
import AndroidNativeBridge from "@/components/AndroidNativeBridge";
import MobileBottomNav from "@/components/MobileBottomNav";
import HapticFeedbackProvider from "@/components/HapticFeedbackProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ScrollRestoration from "@/components/ScrollRestoration";
import GoogleTranslateScript from "@/components/GoogleTranslateScript";
import GlobalModalScrollLocker from "@/components/GlobalModalScrollLocker";
import AppSplashScreen from "@/components/AppSplashScreen";
import OfficialGovernmentUpdateModal from "@/components/OfficialGovernmentUpdateModal";
import NetworkStatusBanner from "@/components/NetworkStatusBanner";
import OfficialGovNotificationBanner from "@/components/OfficialGovNotificationBanner";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"], display: "swap", preload: false });

export const metadata: Metadata = {
  title: "NagrikSeva AI – Government Schemes Assistant",
  description:
    "AI-powered assistant to find government schemes, check eligibility and required documents. Available in Gujarati, Hindi and English.",
  keywords: ["government schemes", "PM Kisan", "Ayushman Bharat", "nagrik seva", "AI assistant"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NagrikSeva AI",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ea580c",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="gu" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 antialiased pb-20 xl:pb-0" suppressHydrationWarning>
        <LanguageProvider>
          <AppSplashScreen />
          <OfficialGovernmentUpdateModal />
          <ScrollRestoration />
          <ServiceWorkerRegister />
          <NetworkStatusBanner />
          <OfficialGovNotificationBanner />
          <HapticFeedbackProvider />
          <GlobalModalScrollLocker />
          <AndroidNativeBridge />
          {/* ── Accessible Skip to Main Content Link (WCAG 2.2 AA SC 2.4.1 Bypass Blocks) ── */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[99999] focus:px-4 focus:py-2.5 focus:bg-orange-600 focus:text-white focus:font-black focus:text-sm focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-orange-300 focus:outline-none transition-all duration-150"
          >
            મુખ્ય સામગ્રી પર જાઓ (Skip to main content)
          </a>
          <div id="main-content">
            {children}
          </div>
          <Footer />
          <MobileBottomNav />
          <FloatingVoiceHotlineButton />
          <FloatingInstallBanner />
          <GoogleTranslateScript />
        </LanguageProvider>
      </body>
    </html>
  );
}
