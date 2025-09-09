import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./intl/locales/en";
import fr from "./intl/locales/fr";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },

    fr: { translation: fr }
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already escapes
  },
});

export default i18n;
