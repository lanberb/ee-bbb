import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, } from "react-router-dom";
import { App } from "./components/app/App";
import { ErrorBoundary } from "./components/app/ErrorBoundary";
import { GlobalCanvasProvider } from "./hooks/useGlobalCanvas";
import { ThemeStateProvider } from "./hooks/useTheme";

const main = () => {
  hydrateRoot(
    document,
    <StrictMode>
      <ErrorBoundary fallback={<div>Something went wrong.</div>}>
        <ThemeStateProvider>
          <GlobalCanvasProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </GlobalCanvasProvider>
        </ThemeStateProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
};

main();
