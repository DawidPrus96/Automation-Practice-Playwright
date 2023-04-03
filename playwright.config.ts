import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

export default defineConfig({
  testDir: './src/tests',
  snapshotPathTemplate: './src/screenshots/{platform}/{projectName}/{arg}{ext}',
  fullyParallel: true,
  retries: 1,
  workers: 3,
  reporter: 'html',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 1, maxDiffPixels: 50 }
  },
  projects: [
    {
      name: 'facebook',
      testMatch: /NIEGOTOWEfacebook.spec.ts/,
      timeout: 60 * 60 * 1000,
      expect: {
        timeout: 5 * 1000
      },
      // repeatEach: 10,
      use: {
        //trace: 'retain-on-failure',
        acceptDownloads: true,
        ...devices['Desktop Chrome'],
        actionTimeout: 10 * 1000,
        launchOptions: {
          downloadsPath: './src/downloads',
          headless: true
        }
      },
    },
    {
      name: 'Automation Exercise',
      testMatch: /automationexercise.spec.ts/,
      timeout: 5 * 60 * 1000,
      retries: 2,
      expect: {
        timeout: 15 * 1000
      },
      // repeatEach: 10,
      use: {
        //trace: 'retain-on-failure',
        baseURL: 'https://automationexercise.com/',
        acceptDownloads: true,
        ...devices['Desktop Chrome'],
        actionTimeout: 10 * 1000,
        launchOptions: {
          downloadsPath: './src/downloads/automationexercise',
          headless: true
        }
      },
    },
    {
      name: 'Automation Exercise API',
      testMatch: /automationexerciseAPI.spec.ts/,
      timeout: 2 * 60 * 1000,
      expect: {
        timeout: 5 * 1000
      },
      //repeatEach: 10,
      use: {
        baseURL: 'https://automationexercise.com/api/',
        actionTimeout: 5 * 1000,
      },
    },
    {
      name: 'PokeAPI',
      testMatch: /pokemon.spec.ts/,
      timeout: 15 * 60 * 1000,
      use: {
        baseURL: 'https://pokeapi.co/api/v2/pokemon/',
        //trace: 'retain-on-failure',
        actionTimeout: 5 * 1000,
      },
    },
    {
      name: 'Test Automation Practice',
      testMatch: /testautomationpractice.spec.ts/,
      timeout: 90 * 1000,
      expect: {
        timeout: 5 * 1000,
        toHaveScreenshot: { maxDiffPixelRatio: 1, maxDiffPixels: 50 },
      },
      // repeatEach: 10,
      use: {
        //trace: 'retain-on-failure',
        baseURL: 'https://testautomationpractice.blogspot.com/',
        acceptDownloads: true,
        ...devices['Desktop Chrome'],
        actionTimeout: 5 * 1000,
        launchOptions: {
          downloadsPath: './src/downloads/testautomationpractice',
          headless: true
        }
      },
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     actionTimeout: 10 * 1000,
    //     ...devices['Desktop Firefox'],
    //     launchOptions: {
    //       args: [
    //         // `--disable-extensions-except=C:/automatyzacja/Automation Practice/Playwright_NodeJS/chrome_ublock.crx`,
    //         // `--load-extension=C:/automatyzacja/Automation Practice/Playwright_NodeJS/chrome_ublock.crx`
    //       ],
    //       headless: true
    //     }
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     actionTimeout: 10 * 1000,
    //     ...devices['Desktop Safari'],
    //     launchOptions: {
    //       args: [
    //         // `--disable-extensions-except=C:/automatyzacja/Automation Practice/Playwright_NodeJS/chrome_ublock.crx`,
    //         // `--load-extension=C:/automatyzacja/Automation Practice/Playwright_NodeJS/chrome_ublock.crx`
    //       ],
    //       headless: true
    //     }
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { channel: 'chrome' },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
});
