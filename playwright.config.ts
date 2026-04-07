import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    headless: true,
  },
  webServer: [
    {
      command: "npx serve . -l 3000 --no-clipboard",
      port: 3000,
      reuseExistingServer: true,
    },
    {
      command: "npm run dev -- --port 5173",
      cwd: "./playground/react",
      port: 5173,
      reuseExistingServer: true,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
