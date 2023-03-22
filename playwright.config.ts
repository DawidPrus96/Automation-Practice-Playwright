import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 90 * 1000,
  expect: {
    timeout: 20 * 1000
  },
  fullyParallel: true,
  //retries: 3,
  workers: 3,
  reporter: 'html',

  projects: [
    {
      name: 'chromium',
      testMatch: /facebook.spec.ts/,
      timeout: 2 * 60 * 60 * 1000,
      // repeatEach: 10,
      use: {
        //trace: 'retain-on-failure',
        acceptDownloads: true,
        ...devices['Desktop Chrome'],
        actionTimeout: 10 * 1000,
        launchOptions: {
          downloadsPath: './src/downloads',
          args: [
            // `--disable-extensions-except=C:/Users/Dawid/AppData/Local/Google/Chrome/User Data/Default/Extensions/cjpalhdlnbpafiamejdnhcphjbkeiagm/1.47.4_0`,
            // `--load-extension=C:/Users/Dawid/AppData/Local/Google/Chrome/User Data/Default/Extensions/cjpalhdlnbpafiamejdnhcphjbkeiagm/1.47.4_0`,
            // `--load-extension=C:/automatyzacja/Automation Practice/Playwright_NodeJS/chrome_ublock.crx`
          ],
          headless: false
        }
      },
    },
    {
      name: 'Automation Exercise',
      testMatch: /automationexercise.spec.ts/,
      timeout: 2 * 60 * 60 * 1000,
      // repeatEach: 10,
      use: {
        //trace: 'retain-on-failure',
        baseURL: 'https://automationexercise.com/',
        acceptDownloads: true,
        ...devices['Desktop Chrome'],
        actionTimeout: 10 * 1000,
        launchOptions: {
          downloadsPath: './src/downloads/automationexercise',
          args: [
            // `--disable-extensions-except=C:/Users/Dawid/AppData/Local/Google/Chrome/User Data/Default/Extensions/cjpalhdlnbpafiamejdnhcphjbkeiagm/1.47.4_0`,
            // `--load-extension=C:/Users/Dawid/AppData/Local/Google/Chrome/User Data/Default/Extensions/cjpalhdlnbpafiamejdnhcphjbkeiagm/1.47.4_0`,
            // `--load-extension=C:/automatyzacja/Automation Practice/Playwright_NodeJS/chrome_ublock.crx`
          ],
          headless: false
        }
      },
    },
    {
      name: 'Automation Exercise API',
      testMatch: /automationexerciseAPI.spec.ts/,
      timeout: 2 * 60 * 60 * 1000,
      repeatEach: 10,
      use: {
        baseURL: 'https://automationexercise.com/api/',
        //trace: 'retain-on-failure',
        acceptDownloads: true,
        actionTimeout: 10 * 1000,
        launchOptions: {
          downloadsPath: './src/downloads/automationexercise',
          args: [
            // `--disable-extensions-except=C:/Users/Dawid/AppData/Local/Google/Chrome/User Data/Default/Extensions/cjpalhdlnbpafiamejdnhcphjbkeiagm/1.47.4_0`,
            // `--load-extension=C:/Users/Dawid/AppData/Local/Google/Chrome/User Data/Default/Extensions/cjpalhdlnbpafiamejdnhcphjbkeiagm/1.47.4_0`,
            // `--load-extension=C:/automatyzacja/Automation Practice/Playwright_NodeJS/chrome_ublock.crx`
          ],
          headless: false
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
