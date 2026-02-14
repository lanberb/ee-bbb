import { type FC, useCallback } from "react";
import { Box } from "@/components/unit/Box";
import { Stack, StackItem } from "@/components/unit/Stack";
import { useDialogStore } from "@/state/useDialogStore";
import { Dialog } from "../../unit/Dialog";

export const GlobalFootprintDialog: FC = () => {
  const dialogStore = useDialogStore();

  const handleOnRequestClose = useCallback(() => {
    dialogStore.closeCreateStickerDialog();
  }, [dialogStore]);

  return (
    <Dialog open={dialogStore.isOpenCreateStickerDialog} onRequestClose={handleOnRequestClose}>
      <Stack direction="column" height="100%">
        <StackItem grow={1}>
          <Stack height="100%">
            <StackItem grow={1} shrink={0}>
              あいうえお
            </StackItem>
            <StackItem grow={0} shrink={0}>
              あいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえお
            </StackItem>
          </Stack>
        </StackItem>

        <StackItem grow={0} shrink={0}>
          <Box height={80} />
        </StackItem>
      </Stack>
    </Dialog>
  );
};
