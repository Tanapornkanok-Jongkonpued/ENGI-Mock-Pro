import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import th from "./th.json";
import en from "./en.json";
import { storage } from "../utils/storage";

const savedLang = storage.get<{ language: string }>("user")?.language ?? "th";

i18n.use(initReactI18next).init({
  resources: { th: { translation: th }, en: { translation: en } },
  lng: savedLang,
  fallbackLng: "th",
  interpolation: { escapeValue: false },
});

export default i18n;
