import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const useDev = !!process.env.DEV;

export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: useDev ? 'http://localhost:5173' : 'http://localhost:5001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: useDev ? 'npm run dev' : 'npm run prod',
    url: useDev ? 'http://localhost:5173' : 'http://localhost:5001',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
