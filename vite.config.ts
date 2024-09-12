import { resolve } from "node:path";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { type UserConfig, defineConfig } from "vite";
import type { UserConfig as VitestUserConfig } from "vitest/dist/config.js";
import manifest from "./manifest.config";

export default defineConfig({
  // @see https://github.com/crxjs/chrome-extension-tools/issues/696
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        // see web_accessible_resources in the manifest config
        // welcome: join(__dirname, "src/welcome/welcome.html"),
      },
      output: {
        chunkFileNames: "assets/chunk-[hash].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "/src"),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ["styled-jsx/babel"],
      },
    }),
    crx({ manifest }),
  ],
  test: {
    /**
     * グローバルを許可する場合、tsconfig.jsonに以下を追加
     * {
     *  "compilerOptions": {
     *    ...
     *    "types": ["vitest/globals"]
     * }
     */
    globals: false,
    environment: "happy-dom",
    include: ["src/**/*.test.{js,ts,jsx,tsx}"],
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    setupFiles: ["./src/setup-tests.ts"],
  },
} as UserConfig & { test: VitestUserConfig["test"] });
