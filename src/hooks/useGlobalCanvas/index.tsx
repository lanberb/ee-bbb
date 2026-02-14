import { createContext, type FC, type PropsWithChildren, useContext } from "react";
import { useCanvas } from "./internals/useCanvas";
import { useEngine } from "./internals/useEngine";
import { usePointer } from "./internals/usePointer";

type State = {
  el: ReturnType<typeof useCanvas>["el"];
  context2d: ReturnType<typeof useCanvas>["context2d"];
  canvasRef: ReturnType<typeof useCanvas>["canvasRef"];

  isDragging: ReturnType<typeof usePointer>["isDragging"];
  movement: ReturnType<typeof usePointer>["movement"];
  update: ReturnType<typeof usePointer>["update"];

  engine: ReturnType<typeof useEngine>;
};

const GlobalCanvasContext = createContext<State | null>(null);

export const GlobalCanvasProvider: FC<PropsWithChildren> = ({ children }) => {
  const canvas = useCanvas();
  const engine = useEngine(canvas.context2d);
  const pointer = usePointer(canvas.el);

  return (
    <GlobalCanvasContext.Provider
      value={{
        ...canvas,
        ...pointer,
        engine,
      }}
    >
      {children}
    </GlobalCanvasContext.Provider>
  );
};

export const useGlobalCanvas = () => {
  const context = useContext(GlobalCanvasContext);
  if (context == null) {
    throw new Error("CanvasEngineContext is not found");
  }
  return context;
};
