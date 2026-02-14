import { create } from "zustand";

type Store = {
  isOpenCreateStickerDialog: boolean;
  openCreateStickerDialog: () => void;
  closeCreateStickerDialog: () => void;
};

export const useDialogStore = create<Store>((set) => ({
  isOpenCreateStickerDialog: false,
  openCreateStickerDialog: () => set({ isOpenCreateStickerDialog: true }),
  closeCreateStickerDialog: () => set({ isOpenCreateStickerDialog: false }),
}));
