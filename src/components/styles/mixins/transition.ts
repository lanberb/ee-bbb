import { css, type SerializedStyles } from "@emotion/react";
import type { CSSProperties } from "react";

export const GLOBAL_TRANSITION_DURATION = 350; // ms

export interface TransitionProps {
  behavior?: CSSProperties["transitionBehavior"];
  duration?: number;
  delay?: number;
}

export const transition = ({
  behavior = "allow-discrete",
  duration = GLOBAL_TRANSITION_DURATION,
  delay,
}: TransitionProps): SerializedStyles => {
  return css`
    transition-behavior: ${behavior};
    transition-duration: ${duration}ms;
    ${delay && `transition-delay: ${delay}ms`};
  `;
};
