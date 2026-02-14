import { useCallback, useEffect, useRef, useState } from "react";

type State = {
  isDragging: boolean;
  movement: {
    x: number;
    y: number;
  };
  update: (x: number, y: number) => void;
};

export const usePointer = (el: HTMLElement | null): State => {
  const [isDragging, setIsDragging] = useState(false);
  const { current: movement } = useRef<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (isDragging === false) {
        return;
      }
      movement.x += e.movementX;
      movement.y += e.movementY;
    },
    [isDragging],
  );

  const update = useCallback((x: number, y: number) => {
    movement.x = x;
    movement.y = y;
  }, []);

  useEffect(() => {
    el?.addEventListener("pointerout", handlePointerUp);
    el?.addEventListener("pointerup", handlePointerUp);
    el?.addEventListener("pointerdown", handlePointerDown);
    el?.addEventListener("pointermove", handlePointerMove);

    return () => {
      el?.removeEventListener("pointerout", handlePointerUp);
      el?.removeEventListener("pointerup", handlePointerUp);
      el?.removeEventListener("pointerdown", handlePointerDown);
      el?.removeEventListener("pointermove", handlePointerMove);
    };
  }, [el, handlePointerUp, handlePointerDown, handlePointerMove]);

  return {
    isDragging,
    movement,
    update,
  };
};
