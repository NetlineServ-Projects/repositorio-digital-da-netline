import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./resources/en.json";
import pt from "./resources/pt.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
    },
    fallbackLng: "pt",
    supportedLngs: ["pt", "en"],
    interpolation: {
      escapeValue: false, // React já escapa por padrão
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorageKey: "idioma", // mesma chave que já usas no http-client.ts
      caches: ["localStorage"],
    },
  });

export default i18n;