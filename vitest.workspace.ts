import { resolve } from "node:path";
import { defineWorkspace } from "vitest/config";
import type { ProjectConfig } from "vitest/node";

const baseConfig: Partial<ProjectConfig> = {
  globals: false,
  alias: {
    "@": resolve(__dirname, "./src"),
  },
  restoreMocks: true,
};

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    test: {
      ...baseConfig,
      name: "browser",
      include: ["src/**/*.browser.test.{ts,tsx}"],
      browser: {
        enabled: true,
        name: "chromium",
        provider: "playwright",
        // https://playwright.dev
        providerOptions: {},
        headless: true,
      },
    },
  },
  {
    extends: "vite.config.ts",
    test: {
      ...baseConfig,
      name: "node",
      include: ["src/**/*.node.test.{ts,tsx}"],
      environment: "happy-dom",
      setupFiles: ["./src/test/setup-tests.ts"],
    },
  },
]);
