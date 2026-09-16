import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 30000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 1512, height: 982 },
    headless: true,
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node node_modules/vite/bin/vite.js --host 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
