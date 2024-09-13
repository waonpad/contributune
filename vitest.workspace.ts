import { resolve } from "node:path";
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    test: {
      name: "browser",
      include: ["src/**/*.browser.test.{js,ts,jsx,tsx}"],
      browser: {
        enabled: true,
        name: "chromium",
        provider: "playwright",
        // https://playwright.dev
        providerOptions: {},
      },
      globals: false,
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  },
  {
    extends: "vite.config.ts",
    test: {
      name: "node",
      include: ["src/**/*.node.test.{js,ts,jsx,tsx}"],
      environment: "happy-dom",
      setupFiles: ["./src/setup-tests.ts"],
      globals: false,
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  },
]);
