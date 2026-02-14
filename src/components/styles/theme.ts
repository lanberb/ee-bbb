export type Theme = {
  surface: {
    primary: string;
    primaryHover: string;
    primaryDisabled: string;
    primaryInversed: string;
    backgroundGrid: string;
  };
  text: {
    primary: string;
    primaryDisabled: string;
    primaryInversed: string;
  };
};
export type ThemeMode = "light" | "dark";
export type ThemeState = {
  theme: Theme;
  mode: ThemeMode;
  change: (e: ThemeMode) => void;
};

export const themeKeyMap: Record<ThemeMode, Theme> = {
  light: {
    surface: {
      primary: "--theme-light-color-surface-primary",
      primaryHover: "--theme-light-color-surface-primary-hover",
      primaryDisabled: "--theme-light-color-surface-primary-disabled",
      primaryInversed: "--theme-dark-color-surface-primary",
      backgroundGrid: "--theme-light-color-surface-background-grid",
    },
    text: {
      primary: "--theme-light-color-text-primary",
      primaryDisabled: "--theme-light-color-text-primary-disabled",
      primaryInversed: "--theme-dark-color-text-primary",
    },
  },
  dark: {
    surface: {
      primary: "--theme-dark-color-surface-primary",
      primaryHover: "--theme-dark-color-surface-primary-hover",
      primaryDisabled: "--theme-dark-color-surface-primary-disabled",
      primaryInversed: "--theme-light-color-surface-primary",
      backgroundGrid: "--theme-dark-color-surface-background-grid",
    },
    text: {
      primary: "--theme-dark-color-text-primary",
      primaryDisabled: "--theme-dark-color-text-primary-disabled",
      primaryInversed: "--theme-light-color-text-primary",
    },
  },
};

export type Color = keyof Theme["text"];
export type BackgroundColor = keyof Theme["surface"];
export type BorderColor = keyof Theme["surface"];
export type FontFamily = "Roboto" | "Zen Old Mincho";
export type LineHeight = "100%" | "140%" | "180%";
