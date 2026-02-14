import styled from "@emotion/styled";
import type { JSX } from "react";
import {
  type BaseProps,
  type BorderProps,
  base,
  borders,
  type MarginProps,
  margins,
  type PaddingProps,
  paddings,
  type StackItemProps,
  type StackProps,
  stack,
  stackItem,
} from "@/components/styles/mixins";

interface Props extends BaseProps, MarginProps, PaddingProps, BorderProps, StackProps {
  as?: keyof JSX.IntrinsicElements;
}

export const Stack = styled.div<Props>`
  ${base}
  ${stack}
  ${margins}
  ${paddings}
  ${borders}
`;

export const StackItem = styled.div<StackItemProps>`
  ${stackItem}
`;
