import { MediaQuery, PrefersReducedMotion } from "@/components/styles/media";
import type { Theme, ThemeState } from "@/components/styles/theme";
import { getIsBrowser } from "./app";

interface Size {
  width: number;
  height: number;
}
export interface Position {
  x: number;
  y: number;
}

export const getCenterizePosition = (container: Size, item: Size): Position => {
  return {
    x: (container.width - item.width) / 2,
    y: (container.height - item.height) / 2,
  };
};

export const isMobile = () => {
  return window.matchMedia(MediaQuery.sp).matches;
};

export const isPrefersReducedMotion = () => {
  return getIsBrowser() && window.matchMedia(PrefersReducedMotion).matches;
};

export const getMobileFullWidthWithMargin = (width: number, margin = 16) => {
  if (isMobile()) {
    return document.documentElement.clientWidth - margin * 2;
  }
  return width;
};

/**
 * @summary keyをもとにglobalStyleに登録されているRGBAを返す
 */
export const getSurfaceColor = (key: keyof Theme["surface"], themeState: ThemeState) => {
  const color = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(themeState.theme.surface[key])
    .trim();
  return color;
};
