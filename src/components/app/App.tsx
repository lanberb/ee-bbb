import { Global } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalCanvas } from '../modules/GlobalCanvas';
import { GlobalCanvasNavigator } from '../modules/GlobalCanvasNavigator';
import { GlobalFootprintDialog } from '../modules/GlobalFootprintDialog';
import { GlobalNavigation } from '../modules/GlobalNavigation';
import { Page as BlogPage } from '../pages/blog';
import { Page as TopPage } from '../pages/top';
import { createGlobalStyles } from '../styles/globalStyles';
import { GlobalCanvasProvider } from '../../hooks/useGlobalCanvas';
import { I18nStateProvider } from '../../hooks/useI18n';
import { ThemeStateProvider } from '../../hooks/useTheme';
import { routes } from '../../util/routes';
import { ErrorBoundary } from "./ErrorBoundary";

function App() {
  const queryClient = new QueryClient();

  return (
    <StrictMode>
      <ErrorBoundary fallback={<div>Something went wrong.</div>}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <I18nStateProvider>
              <ThemeStateProvider>
                <GlobalCanvasProvider>
                  <Global styles={createGlobalStyles} />
                  <GlobalCanvas />
                  <GlobalCanvasNavigator />
                  <GlobalNavigation />
                  <GlobalFootprintDialog />

                  <Routes>
                    <Route path={routes.top} element={<TopPage />} />
                    <Route path={routes.blog} element={<BlogPage />} />
                  </Routes>
                </GlobalCanvasProvider>
              </ThemeStateProvider>
            </I18nStateProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

export default App;
