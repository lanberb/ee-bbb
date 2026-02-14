import { useEffect, useState } from "react";
import { createFacade } from "@/canvas";

export const useEngine = (context2d: CanvasRenderingContext2D | null) => {
  const [facade, setFacade] = useState<ReturnType<typeof createFacade> | null>(null);

  useEffect(() => {
    if (context2d != null) {
      setFacade(createFacade(context2d));
    }
  }, [context2d]);

  return facade;
};
