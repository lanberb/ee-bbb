import { css, type SerializedStyles } from "@emotion/react";
import type { CSSProperties } from "react";
import type { BorderColor, Theme } from "../theme";

const createBorderSyntaxString = (
  arg: NonNullable<CSSProperties["border"]>,
  style: NonNullable<CSSProperties["borderStyle"]>,
  bc?: BorderColor,
  theme?: Theme,
): string => {
  return `${style} ${arg}px var(${(bc && theme?.surface[bc]) || theme?.surface.primary})`;
};

export interface BorderProps {
  theme?: Theme;
  b?: number;
  bt?: number;
  bl?: number;
  br?: number;
  bb?: number;
  bx?: number;
  by?: number;
  bs?: CSSProperties["borderStyle"];
  bc?: BorderColor;
}

export const borders = ({ theme, b, bb, bl, br, bt, by, bx, bs = "solid", bc }: BorderProps): SerializedStyles => {
  return css`
    ${b && `border: ${createBorderSyntaxString(b, bs, bc, theme)}`};
    ${bt && `border-top: ${createBorderSyntaxString(bt, bs, bc, theme)}`};
    ${bl && `border-left: ${createBorderSyntaxString(bl, bs, bc, theme)}`};
    ${br && `border-right: ${createBorderSyntaxString(br, bs, bc, theme)}`};
    ${bb && `border-bottom: ${createBorderSyntaxString(bb, bs, bc, theme)}`};
    ${by && `border-block: ${createBorderSyntaxString(by, bs, bc, theme)}`};
    ${bx && `border-inline: ${createBorderSyntaxString(bx, bs, bc, theme)}`};
  `;
};
