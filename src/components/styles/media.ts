import type { ThemeMode } from "./theme";

export const PrefersColorScheme: Record<ThemeMode, string> = {
  light: "(prefers-color-scheme: light)",
  dark: "(prefers-color-scheme: dark)",
};

export const PrefersReducedMotion = "(prefers-reduced-motion: reduce)";

export const MediaQuery = {
  pc: "(min-width: 801px)",
  sp: "(max-width: 800px)",
} as const;
