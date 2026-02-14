import { css, type SerializedStyles } from "@emotion/react";
import type { CSSProperties } from "react";
import { px } from "../helpers";

export interface PaddingProps {
  p?: CSSProperties["padding"];
  pt?: CSSProperties["paddingTop"];
  pl?: CSSProperties["paddingLeft"];
  pr?: CSSProperties["paddingRight"];
  pb?: CSSProperties["paddingBottom"];
  px?: CSSProperties["paddingInline"];
  py?: CSSProperties["paddingBlock"];
}

export const paddings = ({
  p = 0,
  pb = 0,
  pl = 0,
  pr = 0,
  pt = 0,
  py = 0,
  px: paddingInline = 0,
}: PaddingProps): SerializedStyles => {
  return css`
    ${p && `padding: ${px(p)}`};
    ${pt && `padding-top: ${px(pt)}`};
    ${pl && `padding-left: ${px(pl)}`};
    ${pr && `padding-right: ${px(pr)}`};
    ${pb && `padding-bottom: ${px(pb)}`};
    ${py && `padding-block: ${px(py)}`};
    ${paddingInline && `padding-inline: ${px(paddingInline)}`};
  `;
};
