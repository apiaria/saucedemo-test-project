import { defineConfig } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  // ignore declaration or other similar files that could be recognized as tests and would cause issues at execution
  testIgnore: ['**/*.js', '**/*.d.ts'],
  fullyParallel: true,
  /* Fail the build on CI if accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
   ? [["dot"],["html"],['json', { outputFile: './test-results/test-results.json' }]]  
   : [["list", { printSteps: true }], ["html"],['json', { outputFile: './test-results/test-results.json' }]], 
  use: {
    // baseURL - from env file
    baseURL: process.env.BASE_URL ,
    launchOptions: {
      args: ["--start-maximized"],
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      // to run the global setup with env check before all other tests
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'E2E Tests',
      dependencies: ['setup'],
      testIgnore: [ /global\.setup\.ts/],
      use: { 
        viewport: null
       },
    }
  ]
});
