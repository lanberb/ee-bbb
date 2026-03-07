import type { FC, PropsWithChildren } from "react";

interface Props {
  title: string;
}

export const PageLayout: FC<PropsWithChildren<Props>> = ({ title, children }) => {
  return (
    <>
      <title>{title}</title>
      <div style={{ paddingTop: 240, maxWidth: 960, marginInline: "auto", position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </>
  );
};
