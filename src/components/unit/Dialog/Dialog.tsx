import styled from "@emotion/styled";
import { type FC, type MouseEvent, type PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MediaQuery } from "@/components/styles/media";
import { GLOBAL_TRANSITION_DURATION } from "@/components/styles/mixins/transition";
import { Stack } from "../Stack";

const _Dialog = styled.dialog`
  position: fixed;
  width: auto;
  min-width: 320px;
  max-width: 800px;
  height: 100%;
  max-height: min(640px, 100svh - 32px);
  margin: auto;
  overflow: hidden;

  @media ${MediaQuery.sp} {
    margin: auto 16px;
  }

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.64);
    opacity: 0;
    transition: 
      opacity ${GLOBAL_TRANSITION_DURATION}ms ease-in-out,
      overlay ${GLOBAL_TRANSITION_DURATION}ms allow-discrete,
      display ${GLOBAL_TRANSITION_DURATION}ms allow-discrete;
  }

  &[open]{
    &::backdrop {
      opacity: 1;
      @starting-style {
        opacity: 0;
      }
    }
  }
`;

interface _FrameProps {
  open: boolean;
  onRequestClose: () => void;
}

export const Dialog: FC<_FrameProps & PropsWithChildren> = ({ children, open, onRequestClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const stopPropagation = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  return createPortal(
    <_Dialog aria-modal="true" role="dialog" ref={dialogRef} onClick={onRequestClose} onClose={onRequestClose}>
      <Stack direction="column" height="100%" backgroundColor="primary" radius={12} onClick={stopPropagation}>
        {children}
      </Stack>
    </_Dialog>,
    document.body,
  );
};
