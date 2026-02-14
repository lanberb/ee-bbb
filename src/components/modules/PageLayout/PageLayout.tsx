import type { FC, PropsWithChildren } from "react";

interface Props {
  title: string;
}

export const PageLayout: FC<PropsWithChildren<Props>> = ({ title, children }) => {
  return (
    <>
      <title>{title}</title>
      {children}
    </>
  );
};
