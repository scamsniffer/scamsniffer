import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en-US.json";
import zhCN from "./locales/zh-CN.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // bind react-i18next to the instance
  .init({
    fallbackLng: "en-US",
    // debug: true,
    resources: {
    },
  });

i18n.addResourceBundle("en-US", "translation", enUS);
i18n.addResourceBundle("zh-CN", "translation", zhCN);

export default i18n;
