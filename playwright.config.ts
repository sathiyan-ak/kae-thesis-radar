import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: /.*\.spec\.ts/,
  use: {
    baseURL: "http://localhost:3100",
    browserName: "chromium",
    launchOptions: {
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    },
  },
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100/app/dealflow",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
