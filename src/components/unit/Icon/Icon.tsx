import type { FC, SVGProps } from "react";

export type IconName =
  | "modeLight"
  | "modeDark"
  | "footprint"
  | "close"
  | "home"
  | "arrowRight"
  | "arrowLeft"
  | "arrowTop"
  | "arrowBottom";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  name: IconName;
  size?: number;
}

export const Icon: FC<IconProps> = ({ name, size = 24 }) => {
  return (
    <svg width={size} height={size}>
      <title>{name}</title>
      <use href={`#${name}`} fill="currentColor" />
    </svg>
  );
};
