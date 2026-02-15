import { type FC, useEffect } from "react";
import { getSurfaceColor } from "../../../canvas/canvas";
import { useGlobalCanvas } from "../../../hooks/useGlobalCanvas";
import { useTheme } from "../../../hooks/useTheme";
import { BlogList } from "../../modules/BlogList";
import { PageLayout } from "../../modules/PageLayout";

export const Page: FC = () => {
  const theme = useTheme();
  const { engine } = useGlobalCanvas();

  const blogs = [] as [];

  useEffect(() => {
    if (engine == null || theme == null) {
      return;
    }
    console.log("Draw background grid on Blog page");
    engine.render.drawBackgroundGrid(getSurfaceColor("backgroundGrid", theme));
  }, [engine, theme]);

  return (
    <PageLayout title="Blog｜EE-BBB.©">
      <div style={{ position: "relative" }}>
        <BlogList blogs={blogs} />
      </div>
    </PageLayout>
  );
};
