import { expect, Locator, Page } from '@playwright/test';

export class AutomationTools {
    readonly page: Page;
    readonly websocket: WebSocket;
    // readonly getStartedLink: Locator;
    // readonly gettingStartedHeader: Locator;
    // readonly pomLink: Locator;
    // readonly tocList: Locator;
    constructor(page: Page) {
        this.page = page;
        // this.getStartedLink = page.locator('a', { hasText: 'Get started' });
        // this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
        // this.pomLink = page.locator('li', { hasText: 'Guides' }).locator('a', { hasText: 'Page Object Model' });
        // this.tocList = page.locator('article div.markdown ul > li > a');
    }

    async selectTab(tabName: string) {
        await this.page.getByRole('banner')
            .getByRole('link', { name: tabName }).click()
    }
}