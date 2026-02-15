import { useCallback, useState } from "react";

// 高精細にするため2倍サイズで描画する
const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
const DEVICE_PIXEL_RATIO = dpr * 2;

interface Return {
  el: HTMLCanvasElement | null;
  context2d: CanvasRenderingContext2D | null;
  canvasRef: (element: HTMLCanvasElement | null) => void;
}

export const useCanvas = (): Return => {
  const [context2d, setContext2d] = useState<CanvasRenderingContext2D | null>(null);
  const [el, setEl] = useState<HTMLCanvasElement | null>(null);

  const setState = useCallback((element: HTMLCanvasElement | null) => {
    if (element == null) {
      return;
    }
    element.width = element.clientWidth * DEVICE_PIXEL_RATIO;
    element.height = element.clientHeight * DEVICE_PIXEL_RATIO;

    const ctx = element.getContext("2d");
    ctx?.scale(DEVICE_PIXEL_RATIO, DEVICE_PIXEL_RATIO);

    setContext2d(ctx);
    setEl(element);
  }, []);

  return {
    el,
    context2d,
    canvasRef: setState,
  };
};
