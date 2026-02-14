import { type State, state } from "./state";

const createSetter = <T extends unknown[]>(fn: (state: State, ...arg: T) => void) => {
  return (...arg: T) => {
    fn(state, ...arg);
  };
};

export const createSetters = () => {
  return {
    addOpeningAnimationImage: createSetter((state, image: { image: HTMLImageElement; x: number; y: number }) => {
      state.images.push({ ...image, scale: 1.2, opacity: 0 });
    }),
  };
};
