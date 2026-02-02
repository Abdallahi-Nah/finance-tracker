import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import ar from "./ar.json";
import fr from "./fr.json";

// الحصول على اللغة المحفوظة أو استخدام الإنجليزية كافتراضي
const savedLanguage = localStorage.getItem("language") || "en";

// تعيين اتجاه الصفحة حسب اللغة المحفوظة
document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    fr: { translation: fr },
  },
  lng: savedLanguage, // استخدام اللغة المحفوظة
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// حفظ اللغة عند تغييرها
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
