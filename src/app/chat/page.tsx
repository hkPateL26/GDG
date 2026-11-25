"use client";

import ChatBot from "@/components/ChatBot";
import Navbar from "@/components/Navbar";
import { useIsPwaInstalled } from "@/lib/usePwaInstall";
import { useLanguage } from "@/context/LanguageContext";

export default function ChatPage() {
  const { isStandalone } = useIsPwaInstalled();
  const { currentLang } = useLanguage();

  const getLocalizedSubtitle = (lang: string) => {
    switch (lang) {
      case "te": return "గుజరాత్ ప్రజా సేవ & ప్రభుత్వ సంక్షేమ పథకాల సహాయకుడు (GRTSA 2013, NFSA 2013)";
      case "mr": return "महाराष्ट्र व गुजरात सार्वजनिक सेवा हक्क व शासकीय योजना सहाय्यक (GRTSA २०१३, NFSA २०१३)";
      case "hi": return "गुजरात लोक सेवा गारंटी एवं सरकारी योजना सहायक (GRTSA २०१३, NFSA २०१३)";
      case "en": return "Public Service Guarantee & Government Welfare Schemes Assistant (GRTSA 2013, NFSA 2013)";
      case "ml": return "പൗര സേവന ഗ്യാരണ്ടിയും സർക്കാർ ക്ഷേമ പദ്ധതി അസിസ്റ്റന്റും (GRTSA 2013, NFSA 2013)";
      case "kn": return "ಸಾರ್ವಜನಿಕ ಸೇವಾ ಖಾತರಿ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಸಹಾಯಕ (GRTSA 2013, NFSA 2013)";
      case "ta": return "பொது சேவை உத்தரவாதம் மற்றும் அரசு திட்டங்கள் உதவியாளர் (GRTSA 2013, NFSA 2013)";
      case "bn": return "সরকারি জনসেবা ও কল্যাণমূলক প্রকল্প সহায়ক (GRTSA 2013, NFSA 2013)";
      case "pa": return "ਜਨਤਕ ਸੇਵਾ ਗਾਰੰਟੀ ਅਤੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਸਹਾਇਕ (GRTSA 2013, NFSA 2013)";
      case "or": return "ଲୋକସେବା ଅଧିକାର ଓ ସରକାରୀ ଯୋଜନା ସହାୟକ (GRTSA 2013, NFSA 2013)";
      case "ur": return "عوامی خدمات کی گارنٹی اور سرکاری اسکیموں کا معاون (GRTSA 2013, NFSA 2013)";
      case "as": return "জনসেৱা নিশ্চয়তা আৰু চৰকাৰী আঁচনি সহায়ক (GRTSA 2013, NFSA 2013)";
      case "sa": return "लोकसेवा-प्रत्याभूतिः सर्वकार-कल्याणकारी-योजना-सहायकः (GRTSA २०१३, NFSA २०१३)";
      case "ne": return "सार्वजनिक सेवा ग्यारेन्टी र सरकारी योजना सहायक (GRTSA २०१३, NFSA २०१३)";
      default:   return "ગુજરાત જાહેર સેવા & સરકારી યોજના સહાયક (GRTSA ૨૦૧૩, NFSA ૨૦૧૩)";
    }
  };

  return (
    <div
      className="fixed inset-x-0 top-0 bottom-[calc(4.45rem+env(safe-area-inset-bottom,0px))] sm:static sm:h-auto sm:min-h-screen xl:bottom-0 xl:pb-0 flex flex-col overflow-hidden sm:overflow-visible bg-slate-100 sm:bg-gradient-to-br sm:from-orange-50 sm:via-white sm:to-green-50 z-30 sm:z-auto"
    >
      <Navbar />
      <main className="flex-1 min-h-0 overflow-hidden sm:overflow-visible p-0 sm:py-5 lg:py-6 sm:px-4 flex flex-col">
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto flex-1 min-h-0 flex flex-col h-full">
          {/* Desktop Heading - Hidden on mobile to let ChatBot header be the clean single native title */}
          <div className="hidden sm:block text-center mb-3 px-2">
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
              🤖 AI <span className="text-orange-500">Chat</span> Assistant
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {getLocalizedSubtitle(currentLang)}
            </p>
          </div>

          {/* Full Height ChatBot View */}
          <div className="flex-1 min-h-0 w-full flex flex-col h-full">
            <ChatBot />
          </div>

          {/* Desktop Footer */}
          <div className="hidden sm:block mt-2.5 text-center text-xs text-gray-400">
            Powered by Google Gemini AI • 24/7 Digital Public Infrastructure
          </div>
        </div>
      </main>
    </div>
  );
}
