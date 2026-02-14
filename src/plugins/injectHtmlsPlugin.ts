import type { PluginOption } from "vite";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

export const injectHtmlsPlugin = (): PluginOption => {
  return {
    name: "inject-html-plugin",
    transformIndexHtml: async (html) => {
      const DOM = new JSDOM(html);

      // icons
      await (async() => {
        const iconsDir = path.resolve(__dirname, "../assets/images/icons/");
        const iconImageNames = fs.readdirSync(iconsDir);

        const tasks = iconImageNames.map((iconImageName) => fs.readFileSync(path.resolve(iconsDir, iconImageName), "utf-8"));
        const iconHtmlString = (await Promise.all(tasks)).join("").replace(/\n/g, "");

        const iconsContainer = DOM.window.document.querySelector("#icons");
        if (iconsContainer) {
          iconsContainer.innerHTML = iconHtmlString;
        }
      })();

      // filters
      await (async() => {
        const filtersDir = path.resolve(__dirname, "../assets/filters/");
        const filterImageNames = fs.readdirSync(filtersDir);

        const tasks = filterImageNames.map((filterImageName) => fs.readFileSync(path.resolve(filtersDir, filterImageName), "utf-8"));
        const filterHtmlString = (await Promise.all(tasks)).join("").replace(/\n/g, "");

        const filtersContainer = DOM.window.document.querySelector("#filters");
        if (filtersContainer) {
          filtersContainer.innerHTML = filterHtmlString;
        }
      })();

      return DOM.serialize();
    },
  };
};
