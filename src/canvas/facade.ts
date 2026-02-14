import { createRenders } from "./render";
import { createSetters } from "./setter";

type Return = {
  setter: ReturnType<typeof createSetters>;
  render: ReturnType<typeof createRenders>;
};

export const createFacade = (context: CanvasRenderingContext2D): Return => {
  const setters = createSetters();
  const renders = createRenders(context);

  return {
    setter: setters,
    render: renders,
  };
};
