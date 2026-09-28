"use client";

import React, { createContext, useContext, useSyncExternalStore, ReactNode } from "react";
import { getStoredLanguage, applyLanguage, DEFAULT_LANGUAGE } from "@/lib/translation";
import { INDIAN_LANGUAGES, IndianLanguage } from "@/lib/languages";

function subscribeLanguage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("nagrikseva:languageChange", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("nagrikseva:languageChange", callback);
    window.removeEventListener("storage", callback);
  };
}

function getLanguageSnapshot(): string {
  return getStoredLanguage();
}

function getLanguageServerSnapshot(): string {
  return DEFAULT_LANGUAGE;
}

export interface Translations {
  nav: {
    home: string;
    eligibility: string;
    scanner: string;
    benefits: string;
    schemes: string;
    offices: string;
    track: string;
    chat: string;
    helpline: string;
    installApp: string;
    selectLanguage: string;
    allLanguages: string;
    originalLangBadge: string;
    backToGujarati: string;
  };
  common: {
    back: string;
    next: string;
    submit: string;
    search: string;
    download: string;
    close: string;
    verify: string;
    online: string;
    free: string;
  };
}

const UI_TRANSLATIONS: Record<string, Translations> = {
  gu: {
    nav: {
      home: "Home",
      eligibility: "પાત્રતા",
      scanner: "📸 AI સ્કેનર",
      benefits: "💰 લાભ ગણો",
      schemes: "Schemes",
      offices: "કચેરી",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "એપ ઇન્સ્ટોલ",
      selectLanguage: "ભાષા પસંદ કરો",
      allLanguages: "બધી ૧૬ ભાષાઓ »",
      originalLangBadge: "મૂળ",
      backToGujarati: "ગુજરાતી પર પાછા જાઓ",
    },
    common: {
      back: "પાછળ",
      next: "આગળ",
      submit: "જમા કરો",
      search: "શોધો",
      download: "ડાઉનલોડ",
      close: "બંધ કરો",
      verify: "ચકાસો",
      online: "ઓનલાઇન",
      free: "મફત",
    },
  },
  hi: {
    nav: {
      home: "Home",
      eligibility: "पात्रता",
      scanner: "📸 AI स्कैनर",
      benefits: "💰 लाभ गणना",
      schemes: "Schemes",
      offices: "सेवा केंद्र",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "ऐप इंस्टॉल",
      selectLanguage: "भाषा चुनें",
      allLanguages: "सभी १६ भाषाएँ »",
      originalLangBadge: "मूल",
      backToGujarati: "गुजराती पर वापस जाएं",
    },
    common: {
      back: "पीछे",
      next: "आगे",
      submit: "जमा करें",
      search: "खोजें",
      download: "डाउनलोड",
      close: "बंद करें",
      verify: "सत्यापित करें",
      online: "ऑनलाइन",
      free: "निःशुल्क",
    },
  },
  en: {
    nav: {
      home: "Home",
      eligibility: "Eligibility",
      scanner: "📸 AI Scanner",
      benefits: "💰 Benefits",
      schemes: "Schemes",
      offices: "Offices",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "Install App",
      selectLanguage: "Select Language",
      allLanguages: "All 16 Languages »",
      originalLangBadge: "Default",
      backToGujarati: "Switch back to Gujarati",
    },
    common: {
      back: "Back",
      next: "Next",
      submit: "Submit",
      search: "Search",
      download: "Download",
      close: "Close",
      verify: "Verify",
      online: "Online",
      free: "Free",
    },
  },
  mr: {
    nav: {
      home: "Home",
      eligibility: "पात्रता",
      scanner: "📸 AI स्कॅनर",
      benefits: "💰 लाभ मोजा",
      schemes: "Schemes",
      offices: "कचेरी",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "अॅप इन्स्टॉल",
      selectLanguage: "भाषा निवडा",
      allLanguages: "सर्व १६ भाषा »",
      originalLangBadge: "मूळ",
      backToGujarati: "गुजरातीवर परत जा",
    },
    common: {
      back: "मागे",
      next: "पुढे",
      submit: "सबमिट करा",
      search: "शोधा",
      download: "डाउनलोड",
      close: "बंद करा",
      verify: "तपासा",
      online: "ऑनलाइन",
      free: "मोफत",
    },
  },
  bn: {
    nav: {
      home: "Home",
      eligibility: "যোগ্যতা",
      scanner: "📸 AI স্ক্যানার",
      benefits: "💰 সুবিধা",
      schemes: "Schemes",
      offices: "অফিস",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "অ্যাপ ইনস্টল",
      selectLanguage: "ভাষা নির্বাচন করুন",
      allLanguages: "সব ১৬টি ভাষা »",
      originalLangBadge: "ডিফল্ট",
      backToGujarati: "গুজরাটি ভাষায় ফিরুন",
    },
    common: {
      back: "পিছনে",
      next: "পরবর্তী",
      submit: "জমা দিন",
      search: "অনুসন্ধান",
      download: "ডাউনলোড",
      close: "বন্ধ",
      verify: "যাচাই করুন",
      online: "অনলাইন",
      free: "বিনামূল্যে",
    },
  },
  te: {
    nav: {
      home: "Home",
      eligibility: "అర్హత",
      scanner: "📸 AI స్కానర్",
      benefits: "💰 లబ్ధి",
      schemes: "Schemes",
      offices: "కేంద్రాలు",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "యాప్ ఇన్‌స్టాల్",
      selectLanguage: "భాష ఎంచుకోండి",
      allLanguages: "మొత్తం 16 భాషలు »",
      originalLangBadge: "డిఫాల్ట్",
      backToGujarati: "గుజరాతీకి మారండి",
    },
    common: {
      back: "వెనుకకు",
      next: "తదుపరి",
      submit: "సమర్పించు",
      search: "శోధించండి",
      download: "డౌన్‌లోడ్",
      close: "మూసివేయి",
      verify: "ధృవీకరించు",
      online: "ఆన్‌లైన్",
      free: "ఉచితం",
    },
  },
  ta: {
    nav: {
      home: "Home",
      eligibility: "தகுதி",
      scanner: "📸 AI ஸ்கேனர்",
      benefits: "💰 நன்மைகள்",
      schemes: "Schemes",
      offices: "அலுவலகம்",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "செயலி நிறுவு",
      selectLanguage: "மொழியைத் தேர்வுசெய்க",
      allLanguages: "அனைத்து 16 மொழிகள் »",
      originalLangBadge: "இயல்புநிலை",
      backToGujarati: "குஜராத்திக்கு திரும்பு",
    },
    common: {
      back: "பின்",
      next: "அடுத்து",
      submit: "சமர்ப்பிக்கவும்",
      search: "தேடுக",
      download: "பதிவிறக்க",
      close: "மூடு",
      verify: "சரிபார்க்கவும்",
      online: "ஆன்லைன்",
      free: "இலவசம்",
    },
  },
  kn: {
    nav: {
      home: "Home",
      eligibility: "ಅರ್ಹತೆ",
      scanner: "📸 AI ಸ್ಕ್ಯಾನರ್",
      benefits: "💰 ಸೌಲಭ್ಯಗಳು",
      schemes: "Schemes",
      offices: "ಕಛೇರಿಗಳು",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ",
      selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
      allLanguages: "ಎಲ್ಲಾ 16 ಭಾಷೆಗಳು »",
      originalLangBadge: "ಮೂಲ",
      backToGujarati: "ಗುಜರಾತಿಗೆ ಹಿಂತಿರುಗಿ",
    },
    common: {
      back: "ಹಿಂದೆ",
      next: "ಮುಂದೆ",
      submit: "ಸಲ್ಲಿಸಿ",
      search: "ಹುಡುಕಿ",
      download: "ಡೌನ್‌ಲೋಡ್",
      close: "ಮುಚ್ಚಿ",
      verify: "ಪರಿಶೀಲಿಸಿ",
      online: "ಆನ್‌ಲೈನ್",
      free: "ಉಚಿತ",
    },
  },
  ml: {
    nav: {
      home: "Home",
      eligibility: "യോഗ്യത",
      scanner: "📸 AI സ്കാനർ",
      benefits: "💰 ആനുകൂല്യം",
      schemes: "Schemes",
      offices: "ഓഫീസുകൾ",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "ആപ്പ് ഇൻസ്റ്റാൾ",
      selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
      allLanguages: "എല്ലാ 16 ഭാഷകളും »",
      originalLangBadge: "സ്ഥിരസ്ഥിതി",
      backToGujarati: "ഗുജറാത്തിയിലേക്ക് മടങ്ങുക",
    },
    common: {
      back: "തിരികെ",
      next: "അടുത്തത്",
      submit: "സമർപ്പിക്കുക",
      search: "തിരയുക",
      download: "ഡൗൺലോഡ്",
      close: "അടയ്ക്കുക",
      verify: "പരിശോധിക്കുക",
      online: "ഓൺലൈൻ",
      free: "സൗജന്യം",
    },
  },
  pa: {
    nav: {
      home: "Home",
      eligibility: "ਯੋਗਤਾ",
      scanner: "📸 AI ਸਕੈਨਰ",
      benefits: "💰 ਲਾਭ ਗਿਣੋ",
      schemes: "Schemes",
      offices: "ਦਫ਼ਤਰ",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "ਐਪ ਇੰਸਟਾਲ",
      selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
      allLanguages: "ਸਾਰੀਆਂ 16 ਭਾਸ਼ਾਵਾਂ »",
      originalLangBadge: "ਮੂਲ",
      backToGujarati: "ਗੁਜਰਾਤੀ ਤੇ ਵਾਪਸ ਜਾਓ",
    },
    common: {
      back: "ਪਿੱਛੇ",
      next: "ਅੱਗੇ",
      submit: "ਜਮ੍ਹਾਂ ਕਰੋ",
      search: "ਖੋਜੋ",
      download: "ਡਾਊਨਲੋਡ",
      close: "ਬੰਦ ਕਰੋ",
      verify: "ਤਸਦੀਕ ਕਰੋ",
      online: "ਆਨਲਾਈਨ",
      free: "ਮੁਫ਼ਤ",
    },
  },
  or: {
    nav: {
      home: "Home",
      eligibility: "ଯୋଗ୍ୟତା",
      scanner: "📸 AI ସ୍କାନର୍",
      benefits: "💰 ଲାଭ",
      schemes: "Schemes",
      offices: "କାର୍ଯ୍ୟାଳୟ",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "ଆପ୍ ଇନଷ୍ଟଲ",
      selectLanguage: "ଭାଷା ବାଛନ୍ତୁ",
      allLanguages: "ସମସ୍ତ ୧୬ ଭାଷା »",
      originalLangBadge: "ମୂଳ",
      backToGujarati: "ଗୁଜରାଟୀକୁ ଫେରନ୍ତୁ",
    },
    common: {
      back: "ପଛକୁ",
      next: "ଆଗକୁ",
      submit: "ଦାଖଲ କରନ୍ତୁ",
      search: "ସନ୍ଧାନ",
      download: "ଡାଉନଲୋଡ୍",
      close: "ବନ୍ଦ",
      verify: "ଯାଞ୍ଚ କରନ୍ତୁ",
      online: "ଅନଲାଇନ୍",
      free: "ମାଗଣା",
    },
  },
  ur: {
    nav: {
      home: "Home",
      eligibility: "اہلیت",
      scanner: "📸 AI اسکینر",
      benefits: "💰 فوائد",
      schemes: "Schemes",
      offices: "دفاتر",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "ایپ انسٹال",
      selectLanguage: "زبان منتخب کریں",
      allLanguages: "تمام 16 زبانیں »",
      originalLangBadge: "بنیادی",
      backToGujarati: "گجراتی پر واپس جائیں",
    },
    common: {
      back: "پیچھے",
      next: "آگے",
      submit: "جمع کریں",
      search: "تلاش",
      download: "ڈاؤن لوڈ",
      close: "بند کریں",
      verify: "تصدیق کریں",
      online: "آن لائن",
      free: "مفت",
    },
  },
  as: {
    nav: {
      home: "Home",
      eligibility: "যোগ্যতা",
      scanner: "📸 AI স্ক্যানাৰ",
      benefits: "💰 সুবিধা",
      schemes: "Schemes",
      offices: "কাৰ্যালয়",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "এপ ইনষ্টল",
      selectLanguage: "ভাষা বাছক",
      allLanguages: "সকলো ১৬টা ভাষা »",
      originalLangBadge: "মূল",
      backToGujarati: "গুজৰাটীলৈ উভতি যাওক",
    },
    common: {
      back: "পিছলৈ",
      next: "আগলৈ",
      submit: "দাখিল কৰক",
      search: "সন্ধান",
      download: "ডাউনলোড",
      close: "বন্ধ",
      verify: "পৰীক্ষা কৰক",
      online: "অনলাইন",
      free: "বিনামূলীয়া",
    },
  },
  sa: {
    nav: {
      home: "Home",
      eligibility: "पात्रता",
      scanner: "📸 AI सूक्ष्मचित्रक",
      benefits: "💰 लाभाः",
      schemes: "Schemes",
      offices: "कार्यालयः",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "अनुप्रयोग स्थापनम्",
      selectLanguage: "भाषां चिनोतु",
      allLanguages: "सर्वाः १६ भाषाः »",
      originalLangBadge: "मूलम्",
      backToGujarati: "गुजराती प्रति निवर्तताम्",
    },
    common: {
      back: "पृष्ठतः",
      next: "अग्रतः",
      submit: "समर्पयतु",
      search: "अन्वेषणम्",
      download: "अवतरणम्",
      close: "पिदधातु",
      verify: "सत्यापयतु",
      online: "अन्तर्जालस्थम्",
      free: "निःशुल्कम्",
    },
  },
  ne: {
    nav: {
      home: "Home",
      eligibility: "योग्यता",
      scanner: "📸 AI स्क्यानर",
      benefits: "💰 लाभ गणना",
      schemes: "Schemes",
      offices: "कार्यालय",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "एप स्थापना",
      selectLanguage: "भाषा छान्नुहोस्",
      allLanguages: "सबै १६ भाषाहरू »",
      originalLangBadge: "मूल",
      backToGujarati: "गुजरातीमा फर्कनुहोस्",
    },
    common: {
      back: "पछाडि",
      next: "अगाडि",
      submit: "पेश गर्नुहोस्",
      search: "खोज्नुहोस्",
      download: "डाउनलोड",
      close: "बन्द",
      verify: "प्रमाणित गर्नुहोस्",
      online: "अनलाइन",
      free: "निःशुल्क",
    },
  },
};

interface LanguageContextType {
  currentLang: string;
  setLanguage: (lang: string) => void;
  t: Translations;
  languages: IndianLanguage[];
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: UI_TRANSLATIONS.gu,
  languages: INDIAN_LANGUAGES,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const currentLang = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  );

  const changeLang = (lang: string) => {
    applyLanguage(lang);
  };

  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.hi || UI_TRANSLATIONS.en || UI_TRANSLATIONS.gu;

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setLanguage: changeLang,
        t,
        languages: INDIAN_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
