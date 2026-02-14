import styled from "@emotion/styled";
import type { FC, PropsWithChildren } from "react";
import { Link as InternalLink } from "react-router-dom";
import {
  type BaseProps,
  base,
  type MarginProps,
  margins,
  type PaddingProps,
  paddings,
  type TypographyProps,
  typography,
} from "@/components/styles/mixins";
import { protocol } from "@/util/routes";
import { Text } from "../Text";

interface Props extends TypographyProps, BaseProps, MarginProps, PaddingProps {
  href: string;
}

const ExternalLink = styled.a<Props>`
  ${base};
  ${typography};
  ${margins};
  ${paddings};
`;

export const Link: FC<PropsWithChildren<Props>> = ({ children, href, ...rest }) => {
  const isExternal = href.startsWith(protocol.http) || href.startsWith(protocol.https);

  if (isExternal) {
    return (
      <ExternalLink href={href} rel="noopener" target="_blank" height="fit-content" {...rest}>
        {children}
      </ExternalLink>
    );
  }

  return (
    <InternalLink to={href}>
      <Text as="span" {...rest}>
        {children}
      </Text>
    </InternalLink>
  );
};
