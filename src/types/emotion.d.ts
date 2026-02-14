import "@emotion/react";
import type { Theme as AppTheme } from "@/components/styles/theme";

declare module "@emotion/react" {
  export interface Theme extends AppTheme {}
}
