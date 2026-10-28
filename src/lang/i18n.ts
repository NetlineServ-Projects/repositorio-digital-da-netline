import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./resources/en.json";
import pt from "./resources/pt.json";

// Cada área tem o seu ficheiro (resources/<idioma>/<area>.json), carregado como t("<area>.chave")
const porArea = (ficheiros: Record<string, { default: Record<string, unknown> }>) =>
  Object.fromEntries(
    Object.entries(ficheiros).map(([caminho, m]) => [caminho.split("/").pop()!.replace(".json", ""), m.default]),
  );
const ptAreas = porArea(import.meta.glob("./resources/pt/*.json", { eager: true }));
const enAreas = porArea(import.meta.glob("./resources/en/*.json", { eager: true }));

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ...en, ...enAreas } },
      pt: { translation: { ...pt, ...ptAreas } },
    },
    fallbackLng: "pt",
    supportedLngs: ["pt", "en"],
    interpolation: {
      escapeValue: false, // React já escapa por padrão
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "idioma",
      caches: ["localStorage"],
    },
  });

export default i18n;