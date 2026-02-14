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
} from "@/components/styles/mixins";

interface Props extends BaseProps, MarginProps, PaddingProps, BorderProps {
  as?: keyof JSX.IntrinsicElements;
}

export const Box = styled.div<Props>`
  ${base}
  ${margins}
  ${paddings}
  ${borders};
`;
