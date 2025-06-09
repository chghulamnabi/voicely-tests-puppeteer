const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 300000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--no-sandbox',
            '--start-maximized',
            '--allow-insecure-localhost',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-web-security',
            '--disable-blink-features=AutomationControlled',
            '--autoplay-policy=no-user-gesture-required',
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            `--disable-extensions-except=${path.resolve(__dirname, 'build')}`,
            `--load-extension=${path.resolve(__dirname, 'build')}`,
          ],
          ignoreDefaultArgs: [
            '--disable-extensions',
            '--enable-automation',
            '--mute-audio',
            '--disable-background-networking',
            '--disable-sync'
          ],
        },
      },
    },
  ],
  webServer: {
    command: 'node server.js',
    url: 'https://localhost:3000',
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true,
  },
}); 