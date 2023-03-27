// example.spec.ts
import { test, expect } from '@playwright/test';
import { AutomationTools } from '../pages/testautomationpractice.page';
test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    //await page.locator('#cookieChoiceDismiss').click()
    await expect(page.getByRole('heading', { name: 'Automation Testing Practice', level: 1 })).toBeVisible()
})
test.describe('Wikipedia', () => {
    test('Empty phrase', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        let phrase = ''
        let count = await playwrightDev.searchWikipediaPhrase(phrase)
        expect(count).toEqual(0)
    });
    test('1 specific result', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        let phrase = 'Glacial lake outburst flood'
        let count = await playwrightDev.searchWikipediaPhrase(phrase)
        expect(count).toEqual(1)
        await playwrightDev.GoToFirstWikipediaArticle()
    });
    test('More than 5 results', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        let phrase = 'Glacial'
        let count = await playwrightDev.searchWikipediaPhrase(phrase)
        expect(count).toEqual(5)
        await playwrightDev.GoToMoreWikipediaResults(phrase)
    });
    test('Invalid New Windows', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        let phrase = 'asdasdasdasdasdas'
        let count = await playwrightDev.searchWikipediaPhrase(phrase)
        expect(count).toEqual(0)
        await expect(page.locator('#Wikipedia1_wikipedia-search-results')).toHaveText('No results found.')
    });
})
test.describe('Alert', () => {
    test('Accept', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.dialog(true)
    });
    test('Cancel', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.dialog(false)
    });
})
test.describe('Date Picker', () => {
    test('Select date from calendar', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        const date = new Date("2019-09-01");
        await playwrightDev.pickDate(date)
    });
    test('Input date into textbox', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        const date = new Date("2019-09-02");
        await playwrightDev.inputDate(date)
    });
})
test.describe('Dropdowns', () => {
    test('Speeds', async ({ page }) => {
        await page.locator('#speed').selectOption('Medium')
    });
    test('Files by value', async ({ page }) => {
        await page.locator('#files').selectOption('3')
    });
    test('Files by label', async ({ page }) => {
        await page.locator('#files').selectOption({ label: 'DOC file' })
    });
    test('Numbers', async ({ page }) => {
        await page.locator('#number').selectOption('3')
    });
    test('Products by value', async ({ page }) => {
        await page.locator('#products').selectOption('Iphone')
    });
    test('Products by label', async ({ page }) => {
        await page.locator('#products').selectOption({ label: 'Yahoo' })
    });
    test('Animals by value', async ({ page }) => {
        await page.locator('#animals').selectOption('babycat')
    });
    test('Animals by label', async ({ page }) => {
        await page.locator('#animals').selectOption({ label: 'Baby Cat' })
    });
})
test.describe('Table', () => {
    test('Table', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        console.log(await playwrightDev.getTable())
    });
})