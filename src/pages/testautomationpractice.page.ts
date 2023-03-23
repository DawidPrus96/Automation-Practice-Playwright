// playwright-dev-page.ts
import { expect, Page } from '@playwright/test';
export class AutomationTools {
    readonly page: Page;
    readonly websocket: WebSocket;
    constructor(page: Page) {
        this.page = page;
    }
    async searchWikipediaPhrase(phrase: string) {
        await this.page.locator('#Wikipedia1_wikipedia-search-input').fill(phrase)
        await this.page.getByRole('button', { name: 'submit' }).click()
        await expect(this.page.locator('#Wikipedia1_wikipedia-search-results-header')).toBeVisible()
        return await this.page.locator('#Wikipedia1_wikipedia-search-results').getByRole('link').count()
    }
    async GoToFirstWikipediaArticle() {
        const wikipagePromise = this.page.waitForEvent('popup');
        const article = this.page
            .locator('#Wikipedia1_wikipedia-search-results')
            .getByRole('link')
            .first()
        let phrase = await article.innerText()
        await article.click()
        const wikipage = await wikipagePromise;
        await wikipage.waitForLoadState();
        await expect(wikipage.locator('#firstHeading')).toHaveText(phrase)
    } async GoToMoreWikipediaResults(phrase: string) {
        const wikipagePromise = this.page.waitForEvent('popup');
        const more = this.page.getByRole('link', { name: 'more' })
        await more.click();
        const wikipage = await wikipagePromise;
        await wikipage.waitForLoadState();
        await expect(wikipage.locator(`input[value="${phrase}"][role="combobox"]`)).toBeVisible()
    }
}