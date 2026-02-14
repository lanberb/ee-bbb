import { css, type SerializedStyles } from "@emotion/react";
import type { CSSProperties } from "react";
import { px } from "../helpers";

export interface MarginProps {
  m?: CSSProperties["margin"];
  mt?: CSSProperties["marginTop"];
  ml?: CSSProperties["marginLeft"];
  mr?: CSSProperties["marginRight"];
  mb?: CSSProperties["marginBottom"];
  my?: CSSProperties["marginBlock"];
  mx?: CSSProperties["marginInline"];
}

export const margins = ({
  m = 0,
  mb = 0,
  ml = 0,
  mr = 0,
  mt = 0,
  my = 0,
  mx = 0,
}: MarginProps): SerializedStyles => css`
  ${m && `margin: ${px(m)}`};
  ${mt && `margin-top: ${px(mt)}`};
  ${ml && `margin-left: ${px(ml)}`};
  ${mr && `margin-right: ${px(mr)}`};
  ${mb && `margin-bottom: ${px(mb)}`};
  ${mx && `margin-inline: ${px(mx)}`};
  ${my && `margin-block: ${px(my)}`};
`;
