import { useCallback, useRef } from "react";

/**
 * 慣性アニメーションの設定
 */
interface InertiaConfig {
  /** 速度の減衰率 (0-1の範囲。値が大きいほど長く動く) */
  friction: number;
  /** 停止とみなす最小速度の閾値（ピクセル/フレーム） */
  minVelocity: number;
}

/**
 * 慣性設定のプリセット
 */
const INERTIA_PRESETS: Record<string, InertiaConfig> = {
  /** 軽めの慣性（すぐに止まる） */
  light: {
    friction: 0.91,
    minVelocity: 0.5,
  } as InertiaConfig,
  /** 中程度の慣性（自然な感じ） */
  medium: {
    friction: 0.94,
    minVelocity: 0.5,
  } as InertiaConfig,
  /** 強めの慣性（滑らかに長く動く） */
  strong: {
    friction: 0.97,
    minVelocity: 0.3,
  } as InertiaConfig,
  /** 慣性なし */
  none: {
    friction: 0,
    minVelocity: 0,
  } as InertiaConfig,
} as const;

export const useInertia = () => {
  const velocityRef = useRef({ x: 0, y: 0 });
  const inertiaFrameIdRef = useRef<number | null>(null);
  const inertiaConfigRef = useRef<InertiaConfig>(INERTIA_PRESETS.medium);

  /**
   * 慣性アニメーションを停止
   */
  const stopInertia = useCallback(() => {
    if (inertiaFrameIdRef.current != null) {
      cancelAnimationFrame(inertiaFrameIdRef.current);
      inertiaFrameIdRef.current = null;
    }
  }, []);

  /**
   * 慣性アニメーションを開始
   */
  const startInertia = useCallback((fn: (x: number, y: number) => void) => {
    const animate = () => {
      // 速度を減衰
      velocityRef.current.x *= inertiaConfigRef.current.friction;
      velocityRef.current.y *= inertiaConfigRef.current.friction;

      // 速度が閾値を下回ったら停止
      const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2);

      if (speed > inertiaConfigRef.current.minVelocity) {
        fn(velocityRef.current.x, velocityRef.current.y);
        inertiaFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        inertiaFrameIdRef.current = null;
        velocityRef.current.x = 0;
        velocityRef.current.y = 0;
      }
    };

    inertiaFrameIdRef.current = requestAnimationFrame(animate);
  }, []);

  /**
   * 速度を設定
   */
  const setInertiaVelocity = useCallback((moveX: number, moveY: number) => {
    velocityRef.current.x = moveX;
    velocityRef.current.y = moveY;
  }, []);

  return {
    setInertiaVelocity,
    startInertia,
    stopInertia,
  };
};
