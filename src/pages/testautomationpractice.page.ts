// playwright-dev-page.ts
import { expect, Page, Locator } from '@playwright/test';
export class Main {
    readonly page: Page;
    readonly LHeader: Locator;
    constructor(page: Page) {
        this.page = page;
        this.LHeader = page.locator('#Header1').getByRole('heading', { name: 'Automation Testing Practice', level: 1 })
    }
}

export class Wikipedia {
    readonly page: Page;
    readonly LBox: Locator;
    readonly LHeader: Locator;
    readonly LButton: Locator;
    readonly LTextBox: Locator;
    readonly LResultsHeader: Locator;
    readonly LResults: Locator;
    readonly LResult: Locator;
    readonly LMore: Locator;
    constructor(page: Page) {
        this.page = page;
        this.LBox = page.locator('#Wikipedia1')
        this.LTextBox = this.LBox.getByRole('textbox')
        this.LButton = this.LBox.getByRole('button')
        this.LHeader = this.LBox.getByRole('heading', { name: 'New Windows', level: 2 })
        this.LResultsHeader = this.LBox.locator('#Wikipedia1_wikipedia-search-results-header')
        this.LResults = this.LBox.locator('#Wikipedia1_wikipedia-search-results')
        this.LResult = this.LBox.locator('#wikipedia-search-result-link')
        this.LMore = page.locator('#Wikipedia1_wikipedia-search-more').getByRole('link')
    }
    async searchPhrase(phrase: string) {
        await this.LTextBox.fill(phrase)
        await this.LButton.click()
        if (!phrase)
            await expect(this.LResults).toHaveText('Please enter text to search.')
        else
            await expect(this.LResultsHeader).toBeVisible()
        return await this.LResult.count()
    }
    async GoToFirstArticle() {
        const wikipagePromise = this.page.waitForEvent('popup');
        const phrase = await this.LResult.first().innerText()
        await this.LResult.first().click()
        const wikipage = await wikipagePromise;
        await wikipage.waitForLoadState();
        await expect(wikipage.locator('#firstHeading')).toHaveText(phrase)
    }
    async GoToMoreResults(phrase: string) {
        const wikipagePromise = this.page.waitForEvent('popup');
        await this.LMore.click();
        const wikipage = await wikipagePromise;
        await wikipage.waitForLoadState();
        await expect(wikipage.locator(`input[value="${phrase}"][role="combobox"]`)).toBeVisible()
    }
}

export class Alert {
    readonly page: Page;
    readonly LBox: Locator;
    readonly LHeader: Locator;
    readonly LButton: Locator;
    readonly LMessage: Locator;
    constructor(page: Page) {
        this.page = page;
        this.LBox = page.locator('#HTML9')
        this.LHeader = this.LBox.getByRole('heading', { name: 'Alert', level: 2 })
        this.LButton = this.LBox.getByRole('button')
        this.LMessage = this.LBox.getByRole('paragraph')
    }
    async dialog(accept: boolean) {
        this.page.once('dialog', dialog => {
            if (accept)
                dialog.accept()
            else
                dialog.dismiss()
        });
        await this.LButton.click()
        if (accept)
            await expect(this.LMessage).toHaveText('You pressed OK!')
        else
            await expect(this.LMessage).toHaveText('You pressed Cancel!')
    }
}

export class DatePicker {
    readonly page: Page;
    readonly date: Date;
    today: Date;
    day: number;
    month: number;
    year: number;
    clicks: number;
    readonly LBox: Locator;
    readonly LHeader: Locator;
    readonly LInput: Locator;
    readonly LCalendar: Locator;
    readonly LCalendarDay: Locator;
    readonly ButtonName: () => string;
    readonly LButton: Locator;
    constructor(page: Page, date: Date) {
        this.page = page;
        this.today = new Date();
        this.day = date.getUTCDate()
        this.month = date.getUTCMonth()
        this.year = date.getFullYear()
        this.LBox = page.locator('#HTML5')
        this.LHeader = this.LBox.getByRole('heading', { name: 'Date Picker', level: 2 })
        this.LInput = this.LBox.getByRole('textbox')
        this.LCalendar = this.page.locator('#ui-datepicker-div')
        this.clicks = (this.today.getFullYear() - this.year) * 12 + (this.today.getMonth() - this.month)
        this.ButtonName = (() => {
            return (this.clicks > 0) ? 'Prev' : 'Next'
        })
        this.LButton = this.LCalendar.locator('a').filter({ hasText: `${this.ButtonName()}` })
        this.LCalendarDay = this.LCalendar.getByRole('cell').filter({ has: page.getByRole('link', { name: `${this.day}`, exact: true }) })
    }
    async pickDate() {
        // console.log(today.getFullYear(), this.year, today.getMonth(), this.month, clicks, isFuture)
        await this.LInput.click()
        for (let i = 0; i < Math.abs(this.clicks); i++) {
            await this.LButton.click()
        }
        await this.LCalendarDay.click()
        await this.LInput.click()
        await expect(this.LCalendarDay.getByRole('link')).toHaveClass(/ui-state-active/)
        await expect(this.LCalendarDay).toHaveAttribute('data-month', `${this.month}`);
        await expect(this.LCalendarDay).toHaveAttribute('data-year', `${this.year}`);
    }
    async inputDate() {
        await this.LInput.click()
        await this.LInput.type(`${this.month + 1}/${this.day}/${this.year}`)
        await expect(this.LCalendarDay.getByRole('link')).toHaveClass(/ui-state-active/)
        await expect(this.LCalendarDay).toHaveAttribute('data-month', `${this.month}`);
        await expect(this.LCalendarDay).toHaveAttribute('data-year', `${this.year}`);
    }
}

export class SelectMenu {
    readonly page: Page;
    readonly LBox: Locator
    readonly LHeader: Locator
    readonly LSpeed: Locator
    readonly LFile: Locator
    readonly LNumber: Locator
    readonly LProduct: Locator
    readonly LAnimal: Locator
    constructor(page: Page) {
        this.page = page;
        this.LBox = page.locator('#HTML6')
        this.LHeader = this.LBox.getByRole('heading', { name: 'Select menu', level: 2 })
        this.LSpeed = this.LBox.locator('#speed')
        this.LFile = this.LBox.locator('#files')
        this.LNumber = this.LBox.locator('#number')
        this.LProduct = this.LBox.locator('#products')
        this.LAnimal = this.LBox.locator('#animals')
    }
}

export class DoubleClick {
    readonly page: Page;
    readonly LBox: Locator
    readonly LHeader: Locator
    readonly LField1: Locator
    readonly LField2: Locator
    readonly LButton: Locator
    constructor(page: Page) {
        this.page = page;
        this.LBox = page.locator('#HTML10')
        this.LHeader = this.LBox.getByRole('heading', { name: 'Double Click', level: 2 })
        this.LField1 = this.LBox.locator('#field1')
        this.LField2 = this.LBox.locator('#field2')
        this.LButton = this.LBox.getByRole('button')
    }
    async fillField(field: Locator, text: string) {
        await field.fill(text)
    }
}

export class DragAndDropText {
    readonly page: Page;
    readonly LBox: Locator;
    readonly LHeader: Locator;
    readonly LDrag: Locator;
    readonly LDrop: Locator
    constructor(page: Page) {
        this.page = page;
        this.LBox = page.locator('#HTML2')
        this.LHeader = this.LBox.getByRole('heading', { name: 'Drag and Drop', level: 2 })
        this.LDrag = this.LBox.locator('#draggable')
        this.LDrop = this.LBox.locator('#droppable')
    }
    async DragAndDrop() {
        await this.LDrag.dragTo(this.LDrop);
        await expect(this.LDrop).toHaveClass(/ui-state-highlight/)
        await expect(this.LDrop).toHaveText('Dropped!')
    }
}

export class DragAndDropImage {
    readonly page: Page;
    readonly LBox: Locator
    readonly LHeader: Locator;
    readonly LImage1: { header: string, name: string, locator: Locator }
    readonly LImage2: { header: string, name: string, locator: Locator }
    readonly LTrash: Locator
    constructor(page: Page) {
        this.page = page
        this.LBox = page.locator('#HTML11')
        this.LHeader = this.LBox.getByRole('heading', { name: 'Drag and Drop Images', level: 2 })
        this.LImage1 = {
            header: 'Mary',
            name: 'The chalet at the Green mountain lake',
            locator: this.LBox.getByRole('img', { name: this.LImage1.name })
        }
        this.LImage2 = {
            header: 'Mary',
            name: 'the peaks of high tatras',
            locator: this.LBox.getByRole('img', { name: this.LImage2.name })
        }
        this.LTrash = this.LBox.locator('#trash')
    }
    async DragToTrash(image: { header: string, name: string, locator: Locator }) {
        await image.locator.hover();
        await this.page.mouse.down()
        await this.LTrash.hover()
        await expect(this.LTrash).toHaveClass(/ui-droppable-active/)
        await expect(this.LTrash).toHaveClass(/ui-state-highlight/)
        await expect(this.LTrash).toHaveClass(/ui-droppable-hover/)
        await this.page.mouse.up()
        await expect(this.LTrash.getByRole('img', { name: image.name })).toBeVisible()
    }
}
export class Slider {
    readonly page: Page;
    readonly LBox: Locator
    readonly LHeader: Locator;
    constructor(page: Page) {
        this.page = page;
        this.LBox = page.locator('#HTML7')
        this.LHeader = this.LBox.getByRole('heading', { name: 'Slider', level: 2 })
    }
}
export class Resizable {
    readonly page: Page;
    readonly LBox: Locator
    readonly LHeader: Locator;
    constructor(page: Page) {
        this.page = page;
        this.LBox = page.locator('#HTML3')
        this.LHeader = this.LBox.getByRole('heading', { name: 'Resizable', level: 2 })
    }
}
export class Table {
    readonly page: Page;
    readonly LBox: Locator
    readonly LHeader: Locator;
    readonly LRow: Locator;
    constructor(page: Page) {
        this.page = page;
        this.LBox = page.locator('#HTML1')
        this.LHeader = this.LBox.getByRole('heading', { name: 'LRow', level: 2 })
        this.LRow = this.LBox.getByRole('row').filter({ has: this.page.locator('td') })
    }
    async getTable() {
        const table = {
            items: new Array(),
            sumPrice: 0,
            levels: new Set(),
            languages: new Set(),
        }
        for (const row of await this.LRow.all()) {
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
}
export class AutomationTools {
    readonly page: Page;
    // readonly LMainHeader: Locator
    // readonly LWiki: Locator
    // readonly LAlert: Locator
    // readonly LDatePicker: Locator
    // readonly LSelectMenu: Locator
    readonly LTextLabels: Locator
    readonly LXPathAxes: Locator
    // readonly LDoubleClick: Locator
    // readonly LDCField1: Locator
    // readonly LDCField2: Locator
    // readonly LDoubleClickButton: Locator
    // readonly LDragAndDropText: Locator
    // readonly LDragAndDropImages: Locator
    // readonly LImage1: Locator
    // readonly LImage2: Locator
    // readonly LTrash: Locator
    // readonly LSlider: Locator
    // readonly LResizable: Locator
    // readonly LTable: Locator
    readonly LTooltips: Locator
    readonly LBarCodes: Locator
    readonly LQRCode: Locator
    readonly LDatePickerInput: Locator
    readonly LDatePickerCalendar: Locator
    readonly LTableRow: Locator
    constructor(page: Page) {
        this.page = page;
        // this.LMainHeader = page.locator('#Header1')
        // this.LWiki = page.locator('#Wikipedia1')
        // this.LAlert = page.locator('#HTML9')
        // this.LDatePicker = page.locator('#HTML5')
        // this.LSelectMenu = page.locator('#HTML6')
        this.LTextLabels = page.locator('#Text1')
        this.LXPathAxes = page.locator('#HTML14')
        // this.LDoubleClick = page.locator('#HTML10')
        // this.LDCField1 = this.LDoubleClick.locator('#field1')
        // this.LDCField2 = this.LDoubleClick.locator('#field2')
        // this.LDoubleClickButton = this.LDoubleClick.getByRole('button')
        // this.LDragAndDropText = page.locator('#HTML2')
        // this.LDragAndDropImages = page.locator('#HTML11')
        // this.LImage1 = this.LDragAndDropImages.getByRole('img', { name: 'the peaks of high tatras' })
        // this.LImage2 = this.LDragAndDropImages.getByRole('img', { name: 'The chalet at the Green mountain lake' })
        // this.LTrash = this.LDragAndDropImages.locator('#trash')
        // this.LSlider = page.locator('#HTML7')
        // this.LResizable = page.locator('#HTML3')
        // this.LTable = page.locator('#HTML1')
        // this.LTableRow = this.LTable.getByRole('row').filter({ has: this.page.locator('td') })
        this.LTooltips = page.locator('#HTML8')
        this.LBarCodes = page.locator('#HTML12')
        this.LQRCode = page.locator('#HTML4')
        // this.LDatePickerCalendar = page.locator('#ui-datepicker-div')
        // this.LDatePickerInput = this.LDatePicker.getByRole('textbox')
    }

    // async dialog(accept: boolean) {
    //     this.page.once('dialog', dialog => {
    //         if (accept)
    //             dialog.accept()
    //         else
    //             dialog.dismiss()
    //     });
    //     await this.LAlert.getByRole('button', { name: 'Click Me' }).click()
    //     if (accept)
    //         await this.LAlert.getByText('You pressed OK!').click()
    //     else
    //         await this.LAlert.getByText('You pressed Cancel!').click()
    // }
    // async pickDate(date: Date) {
    //     let today = new Date()
    //     let clicks = (today.getFullYear() - date.getFullYear()) * 12 + (today.getMonth() - date.getMonth())
    //     await this.LDatePickerInput.click()
    //     if (clicks > 0) {
    //         for (let i = 0; i < clicks; i++) {
    //             await this.LDatePickerCalendar.locator('a').filter({ hasText: 'Prev' }).click()
    //         }
    //     }
    //     else {
    //         for (let i = 0; i < Math.abs(clicks); i++) {
    //             await this.LDatePickerCalendar.locator('a').filter({ hasText: 'Next' }).click()
    //         }
    //     }
    //     await this.LDatePickerCalendar.getByRole('link', { name: `${date.getUTCDate()}`, exact: true }).click()
    //     await this.LDatePickerInput.click()
    //     await expect(this.LDatePickerCalendar
    //         .locator(`td[data-month="${date.getUTCMonth()}"][data-year="${date.getFullYear()}"] > .ui-state-active`)
    //         .getByText(`${date.getUTCDate()}`, { exact: true }))
    //         .toBeVisible()
    // }
    // async inputDate(date: Date) {
    //     await this.LDatePickerInput.click()
    //     await this.LDatePickerInput.type(`${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getFullYear()}`)
    //     await expect(this.LDatePickerCalendar
    //         .locator(`td[data-month="${date.getUTCMonth()}"][data-year="${date.getFullYear()}"] > .ui-state-active`)
    //         .getByText(`${date.getUTCDate()}`, { exact: true }))
    //         .toBeVisible()
    // }
    // async getTable() {
    //     const table = {
    //         items: new Array(),
    //         sumPrice: 0,
    //         levels: new Set(),
    //         languages: new Set(),
    //     }
    //     for (const row of await this.LTableRow.all()) {
    //         const cell = row.getByRole('cell')
    //         const bookName = String(await cell.nth(0).textContent())
    //         const author = String(await cell.nth(1).textContent())
    //         const subject = String(await cell.nth(2).textContent())
    //         const price = Number(await cell.nth(3).textContent())

    //         table.items.push({
    //             BookName: bookName,
    //             Author: author,
    //             Subject: subject,
    //             Price: price,
    //         })
    //         table.sumPrice += price
    //         table.levels.add(bookName.split(' ').pop())
    //         table.languages.add(bookName.split(' ').shift())
    //     }
    //     return table
    // }
    // async fillField1(text: string) {
    //     await this.LDCField1.fill(text)
    // }
    // async fillField2(text: string) {
    //     await this.LDCField2.fill(text)
    // }
    // async DragAndDropText() {
    //     await this.LDragAndDropText.locator('#draggable').dragTo(this.LDragAndDropText.locator('#droppable'));
    //     await expect(this.LDragAndDropText.locator('#droppable.ui-state-highlight')).toBeVisible()
    //     await expect(this.LDragAndDropText.locator('#droppable')).toHaveText('Dropped!')
    // }
}