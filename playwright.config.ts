import { defineConfig } from "@playwright/test";

const productionBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "tests",
  testMatch: /.*\.spec\.ts/,
  use: {
    baseURL: productionBaseURL ?? "http://localhost:3100",
    browserName: "chromium",
    launchOptions: {
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    },
  },
  webServer: productionBaseURL ? undefined : {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100/app/dealflow",
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
