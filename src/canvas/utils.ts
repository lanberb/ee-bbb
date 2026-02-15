import { MediaQuery, PrefersReducedMotion } from "../components/styles/media";
import type { Theme, ThemeState } from "../components/styles/theme";

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
  return typeof window !== "undefined" && window.matchMedia(MediaQuery.sp).matches;
};

export const isPrefersReducedMotion = () => {
  return typeof window !== "undefined" && window.matchMedia(PrefersReducedMotion).matches;
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

/**
 * @summary (与えられた幅 - (行数 - 1) * グリッドの幅)を引いた値を2で割る
 * @param width 描画する領域幅
 * @param lineCount グリッドの本数
 * @param dist ドラッグなどによる描画位置のズレ量
 */
export const caluculateFirstLineStart = (width: number, lineCount: number, gap: number, dist: number) => {
  return (width - (lineCount - 1) * gap) / 2 + dist;
};

/**
 * @summary グリッド線の開始位置を配列で返す
 */
export const caluculateLineStartArray = (startPosition: number, lineCount: number, gap: number) => {
  return Array.from({ length: lineCount }, (_, i) => {
    return startPosition + i * gap;
  });
};
