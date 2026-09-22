import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL: "http://localhost:37841",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- --port 37841",
    url: "http://localhost:37841",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
