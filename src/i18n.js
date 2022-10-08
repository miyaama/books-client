import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./shared/localizations/en.json";
import ru from "./shared/localizations/ru.json";
import { LANGUAGE } from "./shared/constants/localStorageKeys";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: true,
    fallbackLng: "en",
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
    },
    lng: localStorage.getItem(LANGUAGE) || "en",
  });
