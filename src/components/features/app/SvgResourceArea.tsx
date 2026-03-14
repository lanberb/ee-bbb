import type { FC } from "react";

/**
 * SVGを <use/> もしくは CSS で使用するために事前にHTMLに組み込んでおく。
 * Cloudflare上でSSRされ、クライアントでは再計算されないのでXSSの心配はない。
 */
const iconModules = import.meta.glob("../../../assets/images/icons/*.svg", { query: "?raw", eager: true });
const filterModules = import.meta.glob("../../../assets/filters/*.svg", { query: "?raw", eager: true });

const icons = Object.values(iconModules).map((m) => (m as { default: string }).default);
const filters = Object.values(filterModules).map((m) => (m as { default: string }).default);

export const SvgResourceArea: FC = () => {
  return (
    <>
      {/* icons */}
      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: For using SVG icons with <use> */}
      <div id="icons" style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: icons.join("") }} />

      {/* filters */}
      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: For using SVG filters within css */}
      <div id="filters" style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: filters.join("") }} />
    </>
  );
};
