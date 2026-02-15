import styled from "@emotion/styled";
import { type CSSProperties, type FC, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import { MediaQuery } from "../../styles/media";
import { GLOBAL_TRANSITION_DURATION, type TransitionProps, transition } from "../../styles/mixins/transition";
import type { ThemeMode } from "../../styles/theme";
import { Box } from "../../unit/Box";
import { Icon } from "../../unit/Icon";
import { Link } from "../../unit/Link";
import { Stack } from "../../unit/Stack";
import { SegmentControl } from "../SegmentControl";

export const routes = {
  top: "/",
  blog: "/blog",
  gallery: "/gallery",
  contact: "/contact",
  hello: "/hello",
};

const navKeys: (keyof typeof routes)[] = ["top", "blog"];

const _NavigationCellWidth_PC = 84;
const _NavigationCellWidth_SP = 72;

const _NavigationTransitionItem = styled(Box)<TransitionProps>`
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.16);
  z-index: 9999;

  ${transition};
`;

const _NavigationCell = styled(Link)`
  flex-grow: 1;
  transition: ${GLOBAL_TRANSITION_DURATION}ms;
  font-size: 14px;

  @media ${MediaQuery.sp} {
    font-size: 14px;
  }

  &[data-selected="true"] {
    color: var(${({ theme }) => theme.text.primaryInversed});
  }

  &:not([data-selected="true"]):hover {
    background-color: var(${({ theme }) => theme.surface.primaryDisabled});
  }
`;

const _NavigationCellList = styled(Stack)`
  &::before {
    transition: ${GLOBAL_TRANSITION_DURATION}ms;
    display: block;
    content: "";
    position: absolute;
    border-radius: 6px;
    left: 0;
    width: ${_NavigationCellWidth_PC}px;
    height: 100%;
    transform: translateX(var(--pseudoElementPositionX));
    background-color: var(${({ theme }) => theme.surface.primaryInversed});
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.32);

    @media ${MediaQuery.sp} {
      width: ${_NavigationCellWidth_SP}px;
    }
  }
`;

export const GlobalNavigation: FC = () => {
  const location = useLocation();
  const theme = useTheme();

  const handleOnSelectTheme = useCallback(
    (mode: string) => {
      if (theme != null) {
        theme.change(mode as ThemeMode);
      }
    },
    [theme],
  );

  const pseudoElementPositionX = (() => {
    const index = navKeys.findIndex((route) => `/${route}` === location.pathname);
    const width = window.matchMedia(MediaQuery.sp).matches ? _NavigationCellWidth_SP : _NavigationCellWidth_PC;
    return width * Math.max(0, index);
  })();

  return (
    <_NavigationTransitionItem
      opacity={1}
      position="fixed"
      top={[
        { key: "pc", value: 64 },
        { key: "sp", value: 24 },
      ]}
      left={[
        { key: "pc", value: 64 },
        { key: "sp", value: 16 },
      ]}
      mx="auto"
    >
      <Stack wrap="nowrap" b={1} bc="primaryInversed" radius={8} width="fit-content" backgroundColor="primaryInversed">
        <_NavigationCellList
          as="nav"
          position="relative"
          alignItems="center"
          b={2}
          radius={7}
          backgroundColor="primary"
          style={
            {
              "--pseudoElementPositionX": `${pseudoElementPositionX}px`,
            } as CSSProperties
          }
        >
          {navKeys.map((key) => {
            const pathname = `/${key === "top" ? "" : key}`;
            return (
              <_NavigationCell
                key={key}
                href={routes[key]}
                ta="center"
                tt="capitalize"
                width={[
                  { key: "sp", value: _NavigationCellWidth_SP },
                  { key: "pc", value: _NavigationCellWidth_PC },
                ]}
                radius={6}
                py={4}
                position="relative"
                color="primary"
                zIndex={1}
                display="block"
                data-selected={pathname === location.pathname}
              >
                {key}
              </_NavigationCell>
            );
          })}
        </_NavigationCellList>

        <Stack alignItems="center" gap={24} px={24}>
          {/* <SegmentControl
            name="localizeLang"
            defaultKey={i18n.lang}
            items={[<span key="ja">JA</span>, <span key="en">EN</span>]}
            onSelect={handleOnSelectLang}
          /> */}
          <SegmentControl
            name="themeMode"
            defaultKey={theme?.mode}
            items={[<Icon key="light" name="modeLight" size={16} />, <Icon key="dark" name="modeDark" size={16} />]}
            onSelect={handleOnSelectTheme}
          />
        </Stack>
      </Stack>
    </_NavigationTransitionItem>
  );
};
