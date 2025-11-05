import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { title: "Bilingual Flashcards" } },
      es: { translation: { title: "Tarjetas Bilingües" } },
      zh: { translation: { title: "双语闪卡" } }
    },
    lng: "en",
    fallbackLng: "en"
  });

export default i18n;
