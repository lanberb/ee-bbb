import Locales from "./localize.json";

export const localeKeyMap = {
  en: Locales.en,
  ja: Locales.ja,
} as const;

export type LocaleKey = keyof typeof localeKeyMap;
