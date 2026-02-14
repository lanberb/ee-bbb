import { css, type SerializedStyles } from "@emotion/react";
import type { CSSProperties } from "react";
import { px } from "../helpers";

export interface GridProps {
  gap?: CSSProperties["gap"];
  templateColumns?: CSSProperties["gridTemplateColumns"];
  templateRows?: CSSProperties["gridTemplateRows"];
  templateAreas?: CSSProperties["gridTemplateAreas"];
}

export const grid = ({ gap, templateColumns, templateRows, templateAreas }: GridProps): SerializedStyles => {
  return css`
    display: grid;
    width: fit-content;
    ${templateColumns && `grid-template-columns: ${templateColumns}`};
    ${templateRows && `grid-template-rows: ${templateRows}`};
    ${templateAreas && `grid-template-areas: ${templateAreas}`};
    ${gap && `gap: ${px(gap)}`};
  `;
};

export interface GridItemProps {
  column?: CSSProperties["gridColumn"];
  row?: CSSProperties["gridRow"];
  area?: CSSProperties["gridArea"];
}

export const gridItem = ({ column, row, area }: GridItemProps): SerializedStyles => {
  return css`
    width: fit-content;
    ${column && `grid-column: ${column}`};
    ${row && `grid-row: ${row}`};
    ${area && `grid-area: ${area}`};
  `;
};
