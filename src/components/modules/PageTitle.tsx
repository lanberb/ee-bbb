import type { FC } from "react";
import { Text } from "../unit/Text";

type Props = {
  title: string;
};

export const PageTitle: FC<Props> = ({ title }) => {
  return (
    <Text as="h2" ff="Zen Old Mincho" fw="lighter" fz={32} color="primary" mb={54}>
      {title}
    </Text>
  );
};
