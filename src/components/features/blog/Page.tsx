import { type FC, useEffect } from "react";
import { getSurfaceColor } from "../../../canvas/utils";
import { useDataFetch } from "../../../hooks/useDataFetch";
import { useGlobalCanvas } from "../../../hooks/useGlobalCanvas";
import { useTheme } from "../../../hooks/useTheme";
import { PageLayout } from "../../modules/PageLayout";
import { BlogList } from "./components/BlogList";

export const Page: FC = () => {
  const theme = useTheme();
  const { engine } = useGlobalCanvas();

  const { data } = useDataFetch<BlogMeta[]>("/api/blogs");

  useEffect(() => {
    if (engine == null || theme == null) {
      return;
    }
    engine.render.drawBackgroundGrid(getSurfaceColor("backgroundGrid", theme));
  }, [engine, theme]);

  return (
    <PageLayout title="Blog｜EE-BBB.©">
      <div style={{ position: "relative" }}>
        <BlogList blogs={data ?? []} />
      </div>
    </PageLayout>
  );
};
