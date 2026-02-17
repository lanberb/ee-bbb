import { Global } from "@emotion/react";
import type { FC, PropsWithChildren } from "react";
import { Route, Routes } from "react-router-dom";
import { GlobalCanvas } from "../modules/GlobalCanvas";
import { GlobalCanvasNavigator } from "../modules/GlobalCanvasNavigator";
import { GlobalFootprintDialog } from "../modules/GlobalFootprintDialog";
import { GlobalNavigation } from "../modules/GlobalNavigation";
import { Page as BlogPage } from "../pages/blog";
import { Page as TopPage } from "../pages/top";
import { createGlobalStyles } from "../styles/globalStyles";

const Renderer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap&text=%22Extend Expression, Bit by Bit.Nao Sasaki / Lanberb, A Creative Developer based in Tokyo.%22© 2026"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&family=Zen+Old+Mincho&display=swap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>EE-BBB.©</title>
      </head>
      <body>
        <div>{children}</div>
        <div id="icons" style={{ display: "none" }} />
        <div id="filters" style={{ display: "none" }} />
      </body>
    </html>
  );
};

export const App: FC = () => {
  return (
    <Renderer>
      <Global styles={createGlobalStyles} />
      <GlobalCanvas />
      <GlobalCanvasNavigator />
      <GlobalNavigation />
      <GlobalFootprintDialog />

      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </Renderer>
  );
};
