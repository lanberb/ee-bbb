import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ThemeMode } from "@/components/styles/theme";

type Store = {
  themeMode: ThemeMode | null;
  setThemeMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<Store>()(
  persist(
    (set) => ({
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
