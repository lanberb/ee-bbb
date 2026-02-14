import { createContext, type FC, type PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { type LocaleKey, localeKeyMap } from "@/util/i18n/localize";

const getInitialLang = (): LocaleKey => {
  // 1) HTML の lang 属性
  const htmlLang = typeof document !== "undefined" ? document.documentElement.lang : undefined;
  if (htmlLang === "en") return "en";
  if (htmlLang === "ja") return "ja";

  // 2) ブラウザの言語設定
  const navLang = typeof navigator !== "undefined" ? navigator.language : undefined;
  if (navLang?.startsWith("en")) return "en";

  // デフォルトは日本語
  return "ja";
};

export interface I18nState {
  lang: LocaleKey;
  t: Record<string, string>;
  change: (lang: LocaleKey) => void;
}

const I18nStateContext = createContext<I18nState | null>(null);

export const I18nStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [lang, setLang] = useState<LocaleKey>(getInitialLang());

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const change = useCallback((next: LocaleKey) => {
    setLang(next);
  }, []);

  const state: I18nState = {
    lang,
    t: localeKeyMap[lang],
    change,
  };

  return <I18nStateContext.Provider value={state}>{children}</I18nStateContext.Provider>;
};

export const useI18n = (): I18nState => {
  const state = useContext(I18nStateContext);
  if (state == null) {
    throw new Error("useI18n must be used within I18nStateProvider");
  }
  return state;
};
