// playwright-dev-page.ts
import { expect, Page, Locator } from '@playwright/test';
export class AutomationTools {
    readonly page: Page;
    readonly websocket: WebSocket;
    readonly locWiki: Locator;
    readonly locAlert: Locator;
    readonly locDatePickerInput: Locator;
    readonly locDatePickerCalendar: Locator;
    readonly locTable: Locator;
    readonly locTableRow: Locator;
    constructor(page: Page) {
        this.page = page;
        this.locWiki = page.locator('#Wikipedia1')
        this.locAlert = page.locator('#HTML9')
        this.locDatePickerInput = page.locator('#HTML5').getByRole('textbox')
        this.locDatePickerCalendar = page.locator('#ui-datepicker-div')
        this.locTable = page.locator('#HTML1')
        this.locTableRow = this.locTable.getByRole('row').filter({ has: this.page.locator('td') })

        // this.getStartedLink = page.locator('a', { hasText: 'Get started' });
        // this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
        // this.pomLink = page.locator('li', { hasText: 'Guides' }).locator('a', { hasText: 'Page Object Model' });
        // this.tocList = page.locator('article div.markdown ul > li > a');
    }
    async searchWikipediaPhrase(phrase: string) {
        await this.locWiki.getByRole('textbox').fill(phrase)
        await this.locWiki.getByRole('button').click()
        if (!phrase)
            await expect(this.locWiki.getByText('Please enter text to search.')).toBeVisible()
        else
            await expect(this.locWiki.getByText('Search results')).toBeVisible()
        return await this.locWiki.locator('#Wikipedia1_wikipedia-search-results').getByRole('link').count()
    }
    async GoToFirstWikipediaArticle() {
        const wikipagePromise = this.page.waitForEvent('popup');
        const article = this.locWiki
            .locator('#Wikipedia1_wikipedia-search-results')
            .getByRole('link')
            .first()
        const phrase = await article.innerText()
        await article.click()
        const wikipage = await wikipagePromise;
        await wikipage.waitForLoadState();
        await expect(wikipage.locator('#firstHeading')).toHaveText(phrase)
    }
    async GoToMoreWikipediaResults(phrase: string) {
        const wikipagePromise = this.page.waitForEvent('popup');
        const more = this.locWiki.getByRole('link', { name: 'more' })
        await more.click();
        const wikipage = await wikipagePromise;
        await wikipage.waitForLoadState();
        await expect(wikipage.locator(`input[value="${phrase}"][role="combobox"]`)).toBeVisible()
    }
    async dialog(accept: boolean) {
        this.page.once('dialog', dialog => {
            if (accept)
                dialog.accept()
            else
                dialog.dismiss()
        });
        await this.locAlert.getByRole('button', { name: 'Click Me' }).click()
        if (accept)
            await this.locAlert.getByText('You pressed OK!').click()
        else
            await this.locAlert.getByText('You pressed Cancel!').click()
    }
    async pickDate(date: Date) {
        let today = new Date()
        let clicks = (today.getFullYear() - date.getFullYear()) * 12 + (today.getMonth() - date.getMonth())
        await this.locDatePickerInput.click()
        if (clicks > 0) {
            for (let i = 0; i < clicks; i++) {
                await this.locDatePickerCalendar.locator('a').filter({ hasText: 'Prev' }).click()
            }
        }
        else {
            for (let i = 0; i < Math.abs(clicks); i++) {
                await this.locDatePickerCalendar.locator('a').filter({ hasText: 'Next' }).click()
            }
        }
        await this.locDatePickerCalendar.getByRole('link', { name: `${date.getUTCDate()}`, exact: true }).click()
        await this.locDatePickerInput.click()
        await expect(this.locDatePickerCalendar
            .locator(`td[data-month="${date.getUTCMonth()}"][data-year="${date.getFullYear()}"] > .ui-state-active`)
            .getByText(`${date.getUTCDate()}`, { exact: true }))
            .toBeVisible()
    }
    async inputDate(date: Date) {
        await this.locDatePickerInput.click()
        await this.locDatePickerInput.type(`${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getFullYear()}`)
        await expect(this.locDatePickerCalendar
            .locator(`td[data-month="${date.getUTCMonth()}"][data-year="${date.getFullYear()}"] > .ui-state-active`)
            .getByText(`${date.getUTCDate()}`, { exact: true }))
            .toBeVisible()
    }
    async getTable() {
        // const items: {}[] = []
        const table = {
            items: new Array(),
            sumPrice: 0,
            levels: new Set(),
            languages: new Set(),
        }
        for (const row of await this.locTableRow.all()) {
            const cell = row.getByRole('cell')
            const bookName = String(await cell.nth(0).textContent())
            const author = String(await cell.nth(1).textContent())
            const subject = String(await cell.nth(2).textContent())
            const price = Number(await cell.nth(3).textContent())

            table.items.push({
                BookName: bookName,
                Author: author,
                Subject: subject,
                Price: price,
            })
            table.sumPrice += price
            table.levels.add(bookName.split(' ').pop())
            table.languages.add(bookName.split(' ').shift())
        }
        return table
        // for ()
    }
}