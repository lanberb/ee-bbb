import { css, type SerializedStyles } from "@emotion/react";
import type { Theme } from "../theme";
import { base } from "./base";
import { borders } from "./border";
import { paddings } from "./padding";
import { stack } from "./stack";
import { typography } from "./typography";

type ButtonVariant = "filled" | "outlined";

const getVariantStyles = (variant: ButtonVariant, theme?: Theme): SerializedStyles => {
  switch (variant) {
    case "outlined": {
      return css`
        ${borders({ theme, b: 1, bs: "solid", bc: "primaryInversed" })}
        ${base({ theme, height: 30, radius: "full" })}
        ${typography({ theme, color: "primary" })}
      `;
    }
    default: {
      return css`
        ${base({
          theme,
          backgroundColor: "primaryInversed",
          height: 30,
          radius: "full",
        })}
        ${typography({
          theme,
          color: "primaryInversed",
        })}
      `;
    }
  }
};

export interface ButtonProps {
  theme?: Theme;
  variant: ButtonVariant;
}

export const button = ({ variant, theme }: ButtonProps): SerializedStyles => {
  return css`
    &:hover {
      opacity: 0.64;
    }

    ${stack({
      direction: "row",
      gap: 8,
      justifyContent: "center",
      alignItems: "center",
    })}
    ${paddings({ px: 32 })}

    ${getVariantStyles(variant, theme)}
  `;
};
