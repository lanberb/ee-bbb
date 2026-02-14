import styled from "@emotion/styled";
import type { FC, MouseEvent } from "react";
import { GLOBAL_TRANSITION_DURATION } from "@/components/styles/mixins";
import type { Color } from "@/components/styles/theme";
import { Icon, type IconProps } from "@/components/unit/Icon";

const _buttonBackgroundSize = 32;

const _Button = styled.button<{ color: Color }>`
  position: relative;
  width: 24px;
  height: 24px;
  color: var(${({ theme, color }) => theme.text[color]});

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: -1;
    width: ${_buttonBackgroundSize}px;
    height: ${_buttonBackgroundSize}px;
    transition: ${GLOBAL_TRANSITION_DURATION}ms;
    transform: translate(-50%, -50%) scale(0);
    border-radius: 100%;
    background-color: var(${({ theme }) => theme.surface.primaryInversed});
    opacity: 0.16;
  }

  &:hover::before {
    transform: translate(-50%, -50%) scale(1);
  }
`;

interface Props extends IconProps {
  color?: Color;
  onClick: (e: MouseEvent<HTMLOrSVGElement>) => void;
}

export const IconButton: FC<Props> = ({ onClick, color = "primary", ...rest }) => {
  return (
    <_Button type="button" color={color} onClick={onClick}>
      <Icon {...rest} />
    </_Button>
  );
};
