import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import type { FC } from "react";
import { Stack } from "@/components/unit/Stack";
import { Text } from "@/components/unit/Text";

const _Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  padding: 32px;
  cursor: pointer;
  background-color: var(${({ theme }) => theme.surface.primary});
  border-radius: 100%;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.16);
  position: relative;
  overflow: visible;
  fill: currentColor;
`;

const _rotateTextKeyframes = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const _RotateText = styled.svg<{ reverse?: boolean }>`
  position: absolute;
  inset: 0;
  margin: auto;
  animation: ${_rotateTextKeyframes} 32000ms linear infinite ${({ reverse }) => (reverse ? "reverse" : "normal")};
  overflow: visible;
`;

const _Label = styled(Text)`
  transform: rotate(-16deg);
`;

type Props = {
  onClick: () => void;
};

export const GlobalFootprintButton: FC<Props> = ({ onClick }) => {
  return (
    <_Button type="button" onClick={onClick}>
      <Stack position="absolute" inset={0} justifyContent="center" alignItems="center" aria-hidden>
        <_RotateText viewBox="0 0 160 160">
          <defs>
            <path id="circlePath" d="M 80,8 A 72,72 0 1,1 79.99,8" />
          </defs>
          <Text as="text" color="primary" fz={8} fw={300}>
            <textPath href="#circlePath" textAnchor="middle" startOffset="50%">
              - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              - - - - - - - - - - - -
            </textPath>
          </Text>
        </_RotateText>

        <_RotateText viewBox="0 0 160 160" width="88%" height="88%" reverse>
          <defs>
            <path id="circlePath" d="M 80,8 A 72,72 0 1,1 79.99,8" />
          </defs>
          <Text as="text" color="primary" fz={8} fw={300}>
            <textPath href="#circlePath" textAnchor="middle" startOffset="50%">
              Make Your Mark? Make Your Mark? Make Your Mark? Make Your Mark? Make Your Mark? Make Your Mark?
            </textPath>
          </Text>
        </_RotateText>
      </Stack>

      <_Label fz={12} fw={300} tt="capitalize" color="primary">
        <Stack as="span" direction="column" gap={8}>
          <Text as="span" width="fit-content" display="block" ff="Zen Old Mincho">
            Make
          </Text>
          <Text as="span" width="fit-content" display="block" ml={28} ff="Zen Old Mincho">
            your
          </Text>
          <Text as="span" width="fit-content" display="block" ml={16} ff="Zen Old Mincho">
            mark?
          </Text>
        </Stack>
      </_Label>
    </_Button>
  );
};
