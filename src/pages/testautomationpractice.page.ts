// playwright-dev-page.ts
import { expect, Page, Locator } from '@playwright/test';
export class AutomationTools {
    readonly page: Page;
    // readonly LWiki: Locator;
    // readonly LAlert: Locator;
    // readonly LDatePickerInput: Locator;
    // readonly LDatePickerCalendar: Locator;
    // readonly LTable: Locator;
    // readonly LTableRow: Locator;
    // readonly LDoubleClickField1: Locator;
    // readonly LDoubleClickField2: Locator;
    // readonly LDoubleClickButton: Locator;
    readonly LMainHeader: Locator
    readonly LWiki: Locator
    readonly LAlert: Locator
    readonly LDatePicker: Locator
    readonly LSelectMenu: Locator
    readonly LTextLabels: Locator
    readonly LXPathAxes: Locator
    readonly LDoubleClick: Locator
    readonly LDoubleClickField1: Locator
    readonly LDoubleClickField2: Locator
    readonly LDoubleClickButton: Locator
    readonly LDragAndDropText: Locator
    readonly LDragAndDropImages: Locator
    readonly LSlider: Locator
    readonly LResizable: Locator
    readonly LTable: Locator
    readonly LTooltips: Locator
    readonly LBarCodes: Locator
    readonly LQRCode: Locator
    readonly LDatePickerInput: Locator
    readonly LDatePickerCalendar: Locator
    readonly LTableRow: Locator
    constructor(page: Page) {
        this.page = page;
        this.LMainHeader = page.locator('#Header1')
        this.LWiki = page.locator('#Wikipedia1')
        this.LAlert = page.locator('#HTML9')
        this.LDatePicker = page.locator('#HTML5')
        this.LSelectMenu = page.locator('#HTML6')
        this.LTextLabels = page.locator('#Text1')
        this.LXPathAxes = page.locator('#HTML14')
        this.LDoubleClick = page.locator('#HTML10')
        this.LDoubleClickField1 = this.LDoubleClick.locator('#field1')
        this.LDoubleClickField2 = this.LDoubleClick.locator('#field2')
        this.LDoubleClickButton = this.LDoubleClick.getByRole('button')
        this.LDragAndDropText = page.locator('#HTML2')
        this.LDragAndDropImages = page.locator('#HTML11')
        this.LSlider = page.locator('#HTML7')
        this.LResizable = page.locator('#HTML3')
        this.LTable = page.locator('#HTML1')
        this.LTableRow = this.LTable.getByRole('row').filter({ has: this.page.locator('td') })
        this.LTooltips = page.locator('#HTML8')
        this.LBarCodes = page.locator('#HTML12')
        this.LQRCode = page.locator('#HTML4')
        this.LDatePickerCalendar = page.locator('#ui-datepicker-div')
        this.LDatePickerInput = this.LDatePicker.getByRole('textbox')
    }
    async searchWikipediaPhrase(phrase: string) {
        await this.LWiki.getByRole('textbox').fill(phrase)
        await this.LWiki.getByRole('button').click()
        if (!phrase)
            await expect(this.LWiki.getByText('Please enter text to search.')).toBeVisible()
        else
            await expect(this.LWiki.getByText('Search results')).toBeVisible()
        return await this.LWiki.locator('#Wikipedia1_wikipedia-search-results').getByRole('link').count()
    }
    async GoToFirstWikipediaArticle() {
        const wikipagePromise = this.page.waitForEvent('popup');
        const article = this.LWiki
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
        const more = this.LWiki.getByRole('link', { name: 'more' })
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
        await this.LAlert.getByRole('button', { name: 'Click Me' }).click()
        if (accept)
            await this.LAlert.getByText('You pressed OK!').click()
        else
            await this.LAlert.getByText('You pressed Cancel!').click()
    }
    async pickDate(date: Date) {
        let today = new Date()
        let clicks = (today.getFullYear() - date.getFullYear()) * 12 + (today.getMonth() - date.getMonth())
        await this.LDatePickerInput.click()
        if (clicks > 0) {
            for (let i = 0; i < clicks; i++) {
                await this.LDatePickerCalendar.locator('a').filter({ hasText: 'Prev' }).click()
            }
        }
        else {
            for (let i = 0; i < Math.abs(clicks); i++) {
                await this.LDatePickerCalendar.locator('a').filter({ hasText: 'Next' }).click()
            }
        }
        await this.LDatePickerCalendar.getByRole('link', { name: `${date.getUTCDate()}`, exact: true }).click()
        await this.LDatePickerInput.click()
        await expect(this.LDatePickerCalendar
            .locator(`td[data-month="${date.getUTCMonth()}"][data-year="${date.getFullYear()}"] > .ui-state-active`)
            .getByText(`${date.getUTCDate()}`, { exact: true }))
            .toBeVisible()
    }
    async inputDate(date: Date) {
        await this.LDatePickerInput.click()
        await this.LDatePickerInput.type(`${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getFullYear()}`)
        await expect(this.LDatePickerCalendar
            .locator(`td[data-month="${date.getUTCMonth()}"][data-year="${date.getFullYear()}"] > .ui-state-active`)
            .getByText(`${date.getUTCDate()}`, { exact: true }))
            .toBeVisible()
    }
    async getTable() {
        const table = {
            items: new Array(),
            sumPrice: 0,
            levels: new Set(),
            languages: new Set(),
        }
        for (const row of await this.LTableRow.all()) {
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
    }
    async fillField1(text: string) {
        await this.LDoubleClickField1.fill(text)
    }
    async fillField2(text: string) {
        await this.LDoubleClickField2.fill(text)
    }
    async DragAndDropText() {
        await this.LDragAndDropText.locator('#draggable').dragTo(this.LDragAndDropText.locator('#droppable'));
        await expect(this.LDragAndDropText.locator('#droppable.ui-state-highlight')).toBeVisible()
        await expect(this.LDragAndDropText.locator('#droppable')).toHaveText('Dropped!')
    }
}