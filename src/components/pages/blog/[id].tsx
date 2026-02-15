import type { FC } from "react";
import Markdown from "react-markdown";
import { Stack } from "../../unit/Stack";
import { Text } from "../../unit/Text";

interface Props {
  content: string;
}

const Page: FC<Props> = ({ content }) => {
  return (
    <Stack mx="auto" maxWidth={960} mt={160}>
      <Markdown
        components={{
          h1: ({ children }) => (
            <Text as="h1" ff="Zen Old Mincho" fw={400} fz={32} lh="140%">
              {children}
            </Text>
          ),
          h2: ({ children }) => <Text as="h2">{children}</Text>,
          h3: ({ children }) => <Text as="h3">{children}</Text>,
          h4: ({ children }) => <Text as="h4">{children}</Text>,
          h5: ({ children }) => <Text as="h5">{children}</Text>,
          h6: ({ children }) => <Text as="h6">{children}</Text>,
          p: ({ children }) => <Text as="p">{children}</Text>,
        }}
      >
        {content}
      </Markdown>
    </Stack>
  );
};

export default Page;
