import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: './reports/current/html-report' }],
    ['json', { outputFile: './reports/current/results.json' }],
    ['junit', { outputFile: './reports/current/junit.xml' }],
    ['list']
  ],
   /* Global setup file */
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video for all tests */
    video: 'on',



    /* Global timeout for each action */
    actionTimeout: 10000,
    
    /* Global timeout for navigation */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
 projects: [
  // AUTH SETUP PROJECT (runs once)
  {
    name: 'setup',
    testMatch: /.*auth\.setup\.ts/,
  },

  // DESKTOP BROWSERS
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'auth.json',
    },
    dependencies: ['setup'],
  },

  {
    name: 'firefox',
    use: {
      ...devices['Desktop Firefox'],
      storageState: 'auth.json',
    },
    dependencies: ['setup'],
  },

  {
    name: 'webkit',
    use: {
      ...devices['Desktop Safari'],
      storageState: 'auth.json',
    },
    dependencies: ['setup'],
  },

  // MOBILE
  {
    name: 'Mobile Chrome',
    use: {
      ...devices['Pixel 5'],
      storageState: 'auth.json',
    },
    dependencies: ['setup'],
  },

  {
    name: 'Mobile Safari',
    use: {
      ...devices['iPhone 12'],
      storageState: 'auth.json',
    },
    dependencies: ['setup'],
  },

  //  BRANDED BROWSERS
  {
    name: 'Microsoft Edge',
    use: {
      ...devices['Desktop Edge'],
      channel: 'msedge',
      storageState: 'auth.json',
    },
    dependencies: ['setup'],
  },

  {
    name: 'Google Chrome',
    use: {
      ...devices['Desktop Chrome'],
      channel: 'chrome',
      storageState: 'auth.json',
    },
    dependencies: ['setup'],
  },
],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  /* Global setup and teardown */
  globalSetup: require.resolve('./config/global-setup.ts'),
  globalTeardown: require.resolve('./config/global-teardown.ts'),

  /* Output directory for test artifacts */
  outputDir: 'reports/current/test-artifacts',

  /* Timeout for the entire test run */
  timeout: 60000,
}); 