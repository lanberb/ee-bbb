import { css } from "@emotion/react";
import bgNoise from "../../assets/images/common/bg_noise.png";
import { PrefersColorScheme, PrefersReducedMotion } from "./media";
import { type Theme, themeKeyMap } from "./theme";

export const createGlobalStyles = (_: Theme) => {
  return css`
    :root {
      ${themeKeyMap.light.surface.primary}: #E4E4E4;
      ${themeKeyMap.light.surface.primaryDisabled}: #969696;
      ${themeKeyMap.light.surface.primaryHover}: #c8c8c8;
      ${themeKeyMap.light.text.primary}: #0A0A0A;
      ${themeKeyMap.light.text.primaryDisabled}: #969696;
      ${themeKeyMap.light.surface.backgroundGrid}: #c4c4c4;

      ${themeKeyMap.dark.surface.primary}: #0A0A0A;
      ${themeKeyMap.dark.surface.primaryDisabled}: #323232;
      ${themeKeyMap.dark.surface.primaryHover}: #161616;
      ${themeKeyMap.dark.text.primary}: #FFFFFF;
      ${themeKeyMap.dark.text.primaryDisabled}: #323232;
      ${themeKeyMap.dark.surface.backgroundGrid}: #1b1b1b;
    }

    /**
     * デバイスのシステムカラーにのみ依存する(emotionのthemeStateに依存しない)色を使いたい場合
     * emotionのthemeはuseEffectでsetされるため、初期マウント時のFOUCを防止するためにCSS側でもthemeを定義する
     */
    @media (${PrefersColorScheme.light}) {
      :root {
        --color-surcface-primary: var(${themeKeyMap.light.surface.primary});
      }
    }
    @media (${PrefersColorScheme.dark}) {
      :root {
        --color-surcface-primary: var(${themeKeyMap.dark.surface.primary});
      }
    }

    * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      transition-duration: 500ms;
    }
    @media (${PrefersReducedMotion}) {
      *,
      ::before,
      ::after {
        transition-duration: 0ms !important;
        animation-duration: 0ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
      }
    }

    html,
    body {
      font-family: "Roboto", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      font-style: normal;
      letter-spacing: 0.08rem;
      /* -webkit-font-smoothing: antialiased; */
      touch-action: none;
      min-height: 100svh;
    }

    body {
      position: relative;

      &::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        background-image: url(${bgNoise});
        background-size: 80px 80px;
        background-repeat: repeat;
      }

      &[data-theme-mode="light"] {
        background-color: var(--theme-light-color-surface-primary);
        &::before{
          opacity: 0.24;
        }
      }

      &[data-theme-mode="dark"] {
        background-color: var(--theme-dark-color-surface-primary);
        &::before{
          opacity: 0.02;
        }
      }
    }

    a {
      color: inherit;
      text-decoration: none;
      height: fit-content;
    }

    button {
      appearance: none;
      border: none;
      background: none;
      cursor: pointer;
      color: inherit;
    }

    dialog {
      background-color: transparent;
      border: none;
      max-width: none;
      max-height: none;
      padding: 0;
      margin: 0;
    }

    :root:has(dialog[open]) {
      overflow: hidden;
      scrollbar-gutter: stable;
    }

    ::selection {
      background-color: olivedrab;
    }
  `;
};
