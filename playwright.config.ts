import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "http://localhost:3100",
    browserName: "chromium",
    launchOptions: {
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    },
  },
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100/dealflow",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
