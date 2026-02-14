import { css, type SerializedStyles } from "@emotion/react";
import type { CSSProperties } from "react";

export interface StackProps {
  direction?: CSSProperties["flexDirection"];
  wrap?: CSSProperties["flexWrap"];
  gap?: number;
  alignContent?: CSSProperties["alignContent"];
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
}

export const stack = ({
  direction,
  wrap,
  gap,
  alignContent,
  alignItems,
  justifyContent,
}: StackProps): SerializedStyles => css`
  display: flex;
  ${direction && `flex-direction: ${direction}`};
  ${wrap && `flex-wrap: ${wrap}`};
  ${gap && `gap: ${gap}px`};
  ${alignContent && `align-content: ${alignContent}`};
  ${alignItems && `align-items: ${alignItems}`};
  ${justifyContent && `justify-content: ${justifyContent}`};
`;

export interface StackItemProps {
  basis?: CSSProperties["flexBasis"];
  shrink?: CSSProperties["flexShrink"];
  grow?: CSSProperties["flexGrow"];
  alignSelf?: CSSProperties["alignSelf"];
  justifySelf?: CSSProperties["justifySelf"];
  order?: CSSProperties["order"];
}

export const stackItem = ({
  alignSelf,
  basis,
  shrink,
  grow,
  justifySelf,
  order,
}: StackItemProps): SerializedStyles => css`
  ${basis && `flex-basis: ${basis}`};
  ${grow && `flex-grow: ${grow}`};
  ${shrink && `flex-shrink: ${shrink}`};
  ${alignSelf && `align-self: ${alignSelf}`};
  ${justifySelf && `justify-content: ${justifySelf}`};
  ${order && `order: ${order}`};
`;
