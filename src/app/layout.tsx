import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import FloatingInstallBanner from "@/components/FloatingInstallBanner";
import MobileBottomNav from "@/components/MobileBottomNav";
import HapticFeedbackProvider from "@/components/HapticFeedbackProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ScrollRestoration from "@/components/ScrollRestoration";
import GoogleTranslateScript from "@/components/GoogleTranslateScript";
import GlobalModalScrollLocker from "@/components/GlobalModalScrollLocker";
import AppSplashScreen from "@/components/AppSplashScreen";
import OfficialGovernmentUpdateModal from "@/components/OfficialGovernmentUpdateModal";
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
  maximumScale: 1,
  themeColor: "#ea580c",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="gu" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <AppSplashScreen />
          <OfficialGovernmentUpdateModal />
          <ScrollRestoration />
          <ServiceWorkerRegister />
          <HapticFeedbackProvider />
          <GlobalModalScrollLocker />
          {children}
          <Footer />
          <MobileBottomNav />
          <FloatingInstallBanner />
          <GoogleTranslateScript />
        </LanguageProvider>
      </body>
    </html>
  );
}
