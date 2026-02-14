import { create } from "zustand";

export type ExpressionLevel = "low" | "high";

type Store = {
  // サイト全体のビジュアル表現強度
  expressionLevel: ExpressionLevel | null;
  setExpressionLevel: (expressionLevel: ExpressionLevel) => void;

  // ユーザーの操作状態を管理するstate
  isPlayedOnce: boolean;
  setIsPlayedOnce: () => void;

  // CanvasEngineのstate管理
  isEndedOpeningAnimation: boolean;
  setIsEndedOpeningAnimation: () => void;

  // CanvasEngineのグラブ可能状態を管理するstate
  isGrabbable: boolean;
  setIsGrabbable: (isGrabbable: boolean) => void;
};

export const useGlobalStore = create<Store>((set) => ({
  expressionLevel: null,
  setExpressionLevel: (expressionLevel: ExpressionLevel) => set({ expressionLevel }),

  isPlayedOnce: false,
  setIsPlayedOnce: () => set({ isPlayedOnce: true }),

  isEndedOpeningAnimation: false,
  setIsEndedOpeningAnimation: () => set({ isEndedOpeningAnimation: true }),

  isGrabbable: false,
  setIsGrabbable: (isGrabbable: boolean) => set({ isGrabbable }),
}));
