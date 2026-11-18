import { defineConfig } from '@playwright/test';

const configuredUrl = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = configuredUrl ?? 'http://127.0.0.1:4173';
const referencesOnly = process.env.PLAYWRIGHT_VISUAL_TARGET === 'reference';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  forbidOnly: Boolean(process.env.CI),
  workers: process.env.CI ? 2 : 3,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    browserName: 'chromium',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: configuredUrl || referencesOnly ? undefined : {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'e2e', testMatch: '**/e2e/*.spec.ts' },
    { name: 'visual', testMatch: '**/visual/*.spec.ts' },
  ],
});
