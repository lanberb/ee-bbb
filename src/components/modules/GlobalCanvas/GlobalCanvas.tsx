import { css } from "@emotion/react";
import styled from "@emotion/styled";
import type { FC } from "react";
import { useGlobalCanvas } from "../../../hooks/useGlobalCanvas";
import { useGlobalStore } from "../../../hooks/useGlobalStore";
import { type BaseProps, base } from "../../styles/mixins";

const grabbableStyle = css`
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const Canvas = styled.canvas<BaseProps & { grabbable: boolean }>`
  ${base}
  ${({ grabbable = false }) => grabbable && grabbableStyle}
`;

export const GlobalCanvas: FC = () => {
  const { canvasRef } = useGlobalCanvas();
  const globalStore = useGlobalStore();

  return (
    <Canvas
      ref={canvasRef}
      grabbable={globalStore.isGrabbable}
      position="fixed"
      inset={0}
      width="100%"
      minHeight="100%"
    />
  );
};
