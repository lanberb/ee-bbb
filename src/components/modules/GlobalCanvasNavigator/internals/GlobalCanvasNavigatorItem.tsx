import styled from "@emotion/styled";
import { type CSSProperties, type FC, useCallback, useEffect, useState } from "react";
import { useGlobalCanvas } from "../../../../hooks/useGlobalCanvas";
import { MediaQuery } from "../../../styles/media";
import type { IconName } from "../../../unit/Icon";
import { IconButton } from "../../IconButton";

const ITEM_SIZE = 64;
const ITEM_POSITION_OFFSET = ITEM_SIZE / 4;

const Item = styled.li`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: var(${({ theme }) => theme.surface.primaryInversed});
  border-radius: 100%;
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;
  transition: translate 50ms, scale 300ms;
  translate: var(--positionX) var(--positionY);
  transform-origin: center;
  scale: var(--scale);
  pointer-events: initial;

  @media ${MediaQuery.sp} {
    transition: translate 0ms, scale 300ms;
  }
`;

interface ItemProps {
  name: IconName;
  invisibleArea: {
    startX: number;
    startY: number;
  };
  onClick: () => void;
}

export const GlobalCanvasNavigatorItem: FC<ItemProps> = ({ name, invisibleArea, onClick }) => {
  const { el, movement, isDragging } = useGlobalCanvas();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleOnPointerMove = useCallback(() => {
    if (el == null || isDragging === false) return;

    // 右端を超えた場合
    const isOverRight = movement.x + invisibleArea.startX < el.clientWidth * -1;
    // 左端を超えた場合
    const isOverLeft = el.clientWidth < movement.x + invisibleArea.startX;
    // 下端を超えた場合
    const isOverBottom = movement.y + invisibleArea.startY < el.clientHeight * -1;
    // 上端を超えた場合
    const isOverTop = el.clientHeight < movement.y + invisibleArea.startY;

    const visible = isOverRight || isOverLeft || isOverBottom || isOverTop;
    if (visible) {
      const x = Math.max(
        -ITEM_POSITION_OFFSET,
        Math.min(
          movement.x + invisibleArea.startX + el.clientWidth / 2 - ITEM_SIZE / 2,
          el.clientWidth - ITEM_SIZE + ITEM_POSITION_OFFSET,
        ),
      );
      const y = Math.max(
        -ITEM_POSITION_OFFSET,
        Math.min(
          movement.y + invisibleArea.startY + el.clientHeight / 2 - ITEM_SIZE / 2,
          el.clientHeight - ITEM_SIZE + ITEM_POSITION_OFFSET,
        ),
      );
      setPosition({ x, y });
    }

    setVisible(visible);
  }, [el, movement, isDragging, invisibleArea]);

  /**
   * マウスイベント登録
   */
  useEffect(() => {
    el?.addEventListener("pointermove", handleOnPointerMove);
    return () => {
      el?.removeEventListener("pointermove", handleOnPointerMove);
    };
  }, [el, handleOnPointerMove]);

  return (
    <Item
      style={
        {
          "--scale": visible ? 1 : 0,
          "--positionX": `${position?.x}px`,
          "--positionY": `${position?.y}px`,
        } as CSSProperties
      }
    >
      <IconButton name={name} color="primaryInversed" onClick={onClick} />
    </Item>
  );
};
