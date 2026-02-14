import styled from "@emotion/styled";
import { type FC, useCallback } from "react";
import { useGlobalCanvas } from '../../../hooks/useGlobalCanvas';
import { useTheme } from '../../../hooks/useTheme';
import { useGlobalStore } from '../../../hooks/useGlobalStore';
import { getSurfaceColor } from '../../../util/canvas';
import { GlobalCanvasNavigatorItem } from "./internals/GlobalCanvasNavigatorItem";

const List = styled.ul<{ showBorder: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;
  list-style: none;
  pointer-events: none;
  filter: url("#filter");

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-style: solid;
    border-color: var(${({ theme }) => theme.surface.primaryInversed});
    border-width: ${({ showBorder }) => (showBorder ? 8 : 0)}px;
    transition: 200ms border-width;
    box-sizing: border-box;
  }
`;

export const GlobalCanvasNavigator: FC = () => {
  const themeState = useTheme();
  const { engine, movement, update } = useGlobalCanvas();
  const globalStore = useGlobalStore();

  const handleOnClickHomeButton = useCallback(() => {
    if (themeState == null || engine == null) return;
    engine.render.onNavigatorClick(
      getSurfaceColor("backgroundGrid", themeState),
      getSurfaceColor("primaryInversed", themeState),
      movement.x,
      movement.y,
      0,
      0,
      () => {
        update(0, 0);
      },
    );
  }, [themeState, engine, movement, update]);

  const handleOnClickBlogButton = useCallback(() => {
    if (themeState == null || engine == null) return;
    engine.render.onNavigatorClick(
      getSurfaceColor("backgroundGrid", themeState),
      getSurfaceColor("primaryInversed", themeState),
      movement.x,
      movement.y,
      -1200,
      -200,
      () => {
        update(-1200, -200);
      },
    );
  }, [themeState, engine, movement, update]);

  return (
    <List showBorder={globalStore.isEndedOpeningAnimation}>
      {globalStore.isEndedOpeningAnimation && (
        <>
          <GlobalCanvasNavigatorItem
            name="modeDark"
            invisibleArea={{ startX: 1200, startY: 200 }}
            onClick={handleOnClickBlogButton}
          />
          <GlobalCanvasNavigatorItem
            name="home"
            invisibleArea={{ startX: 0, startY: 0 }}
            onClick={handleOnClickHomeButton}
          />
        </>
      )}
    </List>
  );
};
