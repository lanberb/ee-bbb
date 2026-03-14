import { Global } from "@emotion/react";
import type { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { createGlobalStyles } from "../../styles/globalStyles";
import { Page as BlogPage } from "../blog/Page";
import { Page as TopPage } from "../top/Page";
import { GlobalCanvas } from "./components/GlobalCanvas";
import { GlobalFootprintDialog } from "./components/GlobalFootprintDialog";
import { GlobalNavigation } from "./components/GlobalNavigation";
import { SvgResourceArea } from "./SvgResourceArea";

export const App: FC = () => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        <title>EE-BBB.©</title>
      </head>
      <body>
        <div>
          <Global styles={createGlobalStyles} />
          <GlobalCanvas />
          <GlobalNavigation />
          <GlobalFootprintDialog />

          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/blog" element={<BlogPage />} />
          </Routes>
        </div>
        <SvgResourceArea />
      </body>
    </html>
  );
};
