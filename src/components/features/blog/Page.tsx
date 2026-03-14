import { type FC, useEffect } from "react";
import { getSurfaceColor } from "../../../canvas/utils";
import { useDataFetch } from "../../../hooks/useDataFetch";
import { useGlobalCanvas } from "../../../hooks/useGlobalCanvas";
import { useTheme } from "../../../hooks/useTheme";
import type { TypeListBlogResponse } from "../../../server/schema";
import { PageLayout } from "../../shared/PageLayout";
import { PageTitle } from "../../shared/PageTitle";
import { BlogList } from "./components/BlogList";

export const Page: FC = () => {
  const theme = useTheme();
  const { engine } = useGlobalCanvas();

  const { data } = useDataFetch<TypeListBlogResponse>("/api/blogs");
  console.log(data);

  useEffect(() => {
    if (engine == null || theme == null) {
      return;
    }
    engine.render.drawBackgroundGrid(getSurfaceColor("backgroundGrid", theme));
  }, [engine, theme]);

  return (
    <PageLayout title="Blog｜EE-BBB.©">
      <PageTitle title="Blog" />
      <BlogList blogs={data?.blogs ?? []} />
    </PageLayout>
  );
};
