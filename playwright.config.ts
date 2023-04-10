import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

export default defineConfig({
  testDir: './src/tests',
  timeout: 90 * 1000,
  snapshotPathTemplate: './src/screenshots/{platform}/{projectName}/{arg}{ext}',
  fullyParallel: true,
  retries: 1,
  workers: 3,
  reporter: 'html',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 1, maxDiffPixels: 50 },
    timeout: 5 * 1000,
  },
  use: {
    acceptDownloads: true,
    ...devices['Desktop Chrome'],
    actionTimeout: 5 * 1000,
    launchOptions: {
      headless: true,
    }
  },
  projects: [
    {
      name: 'Automation Exercise',
      testDir: './src/tests/Automation Exercise',
      timeout: 5 * 60 * 1000,
      expect: {
        timeout: 15 * 1000
      },
      use: {
        baseURL: 'https://automationexercise.com/',
        testIdAttribute: 'data-qa',
        launchOptions: {
          downloadsPath: './src/downloads/automationexercise',
        }
      },
    },
    {
      name: 'Automation Exercise API',
      testMatch: /automationexerciseAPI.spec.ts/,
      use: {
        baseURL: 'https://automationexercise.com/api/',
      },
    },
    {
      name: 'PokeAPI',
      testMatch: /pokemon.spec.ts/,
      timeout: 10 * 60 * 1000,
      use: {
        baseURL: 'https://pokeapi.co/api/v2/pokemon/',
      },
    },
    {
      name: 'Test Automation Practice',
      testMatch: /testautomationpractice.spec.ts/,
      use: {
        baseURL: 'https://testautomationpractice.blogspot.com/',
        launchOptions: {
          downloadsPath: './src/downloads/testautomationpractice',
        }
      },
    },
    {
      name: 'UI Testing Playground',
      testMatch: /uitestingplayground.spec.ts/,
      use: {
        baseURL: 'http://uitestingplayground.com/',
        launchOptions: {
          downloadsPath: './src/downloads/uitestingplayground',
        }
      },
    },
    {
      name: 'Practical Exercises',
      testMatch: /practicalexercises.spec.ts/,
      retries: 0,
      use: {
        baseURL: 'https://exercises.test-design.org/',
        launchOptions: {
          downloadsPath: './src/downloads/practicalexercises',
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
