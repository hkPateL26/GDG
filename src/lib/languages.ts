export interface IndianLanguage {
  code: string;
  name: string;        // Native script name
  englishName: string; // English name
  state: string;       // State/Region
  isDefault?: boolean;
}

export const INDIAN_LANGUAGES: IndianLanguage[] = [
  {
    code: "gu",
    name: "ગુજરાતી",
    englishName: "Gujarati",
    state: "ગુજરાત (મૂળ ભાષા)",
    isDefault: true,
  },
  {
    code: "hi",
    name: "हिन्दी",
    englishName: "Hindi",
    state: "રાષ્ટ્રીય ભાષા (National)",
  },
  {
    code: "en",
    name: "English",
    englishName: "English",
    state: "International",
  },
  {
    code: "mr",
    name: "मराठी",
    englishName: "Marathi",
    state: "મહારાષ્ટ્ર",
  },
  {
    code: "bn",
    name: "বাংলা",
    englishName: "Bengali",
    state: "પશ્ચિમ બંગાળ",
  },
  {
    code: "te",
    name: "తెలుగు",
    englishName: "Telugu",
    state: "આંધ્ર પ્રદેશ & તેલંગાણા",
  },
  {
    code: "ta",
    name: "தமிழ்",
    englishName: "Tamil",
    state: "તમિલનાડુ",
  },
  {
    code: "kn",
    name: "ಕನ್ನಡ",
    englishName: "Kannada",
    state: "કર્ણાટક",
  },
  {
    code: "ml",
    name: "മലയാളം",
    englishName: "Malayalam",
    state: "કેરળ",
  },
  {
    code: "pa",
    name: "ਪੰਜਾਬੀ",
    englishName: "Punjabi",
    state: "પંજાબ",
  },
  {
    code: "or",
    name: "ଓଡ଼ିଆ",
    englishName: "Odia",
    state: "ઓડિશા",
  },
  {
    code: "ur",
    name: "اردو",
    englishName: "Urdu",
    state: "ભારત",
  },
  {
    code: "as",
    name: "অসমীয়া",
    englishName: "Assamese",
    state: "આસામ",
  },
  {
    code: "sa",
    name: "संस्कृतम्",
    englishName: "Sanskrit",
    state: "પ્રાચીન રાષ્ટ્રીય ભાષા",
  },
  {
    code: "ne",
    name: "नेपाली",
    englishName: "Nepali",
    state: "સિક્કિમ & ઉત્તર ભારત",
  },
];
