// example.spec.ts
import { test, expect } from '@playwright/test';
import { AutomationTools } from '../pages/testautomationpractice.page';
test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await page.locator('#cookieChoiceDismiss').click()
    await expect(page.getByRole('heading', { name: 'Automation Testing Practice', level: 1 })).toBeVisible()
})
test.describe('Wikipedia', () => {
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