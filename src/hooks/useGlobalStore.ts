import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ThemeMode } from "../components/styles/theme";

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

  // StickerDialogの状態
  isOpenCreateStickerDialog: boolean;
  openCreateStickerDialog: () => void;
  closeCreateStickerDialog: () => void;

  // Theme
  themeMode: ThemeMode | null;
  setThemeMode: (mode: ThemeMode) => void;
};

export const useGlobalStore = create<Store>()(
  persist(
    (set) => ({
      expressionLevel: null,
      setExpressionLevel: (expressionLevel: ExpressionLevel) => set({ expressionLevel }),

      isPlayedOnce: false,
      setIsPlayedOnce: () => set({ isPlayedOnce: true }),

      isEndedOpeningAnimation: false,
      setIsEndedOpeningAnimation: () => set({ isEndedOpeningAnimation: true }),

      isGrabbable: false,
      setIsGrabbable: (isGrabbable: boolean) => set({ isGrabbable }),

      isOpenCreateStickerDialog: false,
      openCreateStickerDialog: () => set({ isOpenCreateStickerDialog: true }),
      closeCreateStickerDialog: () => set({ isOpenCreateStickerDialog: false }),

      themeMode: null,
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: "theme-store",
      partialize: (state) => ({ themeMode: state.themeMode }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
