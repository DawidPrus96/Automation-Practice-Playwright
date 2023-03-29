// playwright-dev-page.ts
import { expect, Page, Locator } from '@playwright/test';
export class Main {
    readonly page: Page;
    readonly Header: Locator;
    constructor(page: Page) {
        this.page = page;
        this.Header = this.page.locator('#Header1').getByRole('heading', { name: 'Automation Testing Practice', level: 1 })
    }
}

export class Wikipedia {
    readonly page: Page;
    readonly Box: Locator;
    readonly Header: Locator;
    readonly Button: Locator;
    readonly TextBox: Locator;
    readonly ResultsHeader: Locator;
    readonly Results: Locator;
    readonly Result: Locator;
    readonly More: Locator;
    constructor(page: Page) {
        this.page = page;
        this.Box = this.page.locator('#Wikipedia1')
        this.TextBox = this.Box.getByRole('textbox')
        this.Button = this.Box.getByRole('button')
        this.Header = this.Box.getByRole('heading', { name: 'New Windows', level: 2 })
        this.ResultsHeader = this.Box.locator('#Wikipedia1_wikipedia-search-results-header')
        this.Results = this.Box.locator('#Wikipedia1_wikipedia-search-results')
        this.Result = this.Box.locator('#wikipedia-search-result-link')
        this.More = this.page.locator('#Wikipedia1_wikipedia-search-more').getByRole('link')
    }
    async searchPhrase(phrase: string) {
        await this.TextBox.fill(phrase)
        await this.Button.click()
        if (!phrase)
            await expect(this.Results).toHaveText('Please enter text to search.')
        else
            await expect(this.ResultsHeader).toBeVisible()
        return await this.Result.count()
    }
    async GoToFirstArticle() {
        const wikipagePromise = this.page.waitForEvent('popup');
        const phrase = await this.Result.first().innerText()
        await this.Result.first().click()
        const wikipage = await wikipagePromise;
        await wikipage.waitForLoadState();
        await expect(wikipage.locator('#firstHeading')).toHaveText(phrase)
    }
    async GoToMoreResults(phrase: string) {
        const wikipagePromise = this.page.waitForEvent('popup');
        await this.More.click();
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
        this.LBox = this.page.locator('#HTML9')
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
    today: Date = new Date();
    day: number;
    month: number;
    year: number;
    clicks: number;
    readonly Box: Locator;
    readonly Header: Locator;
    readonly Input: Locator;
    readonly Calendar: Locator;
    readonly CalendarDay: Locator;
    readonly ButtonName: () => string = (
        () => {
            return (this.clicks > 0) ? 'Prev' : 'Next'
        });
    readonly Button: Locator;
    constructor(page: Page, date: Date = new Date()) {
        this.page = page;
        this.day = date.getDate()
        this.month = date.getUTCMonth()
        this.year = date.getFullYear()
        this.Box = this.page.locator('#HTML5')
        this.Header = this.Box.getByRole('heading', { name: 'Date Picker', level: 2 })
        this.Input = this.Box.getByRole('textbox')
        this.Calendar = this.page.locator('#ui-datepicker-div')
        this.clicks = (this.today.getFullYear() - this.year) * 12 + (this.today.getMonth() - this.month)
        // this.ButtonName = (() => {
        //     return (this.clicks > 0) ? 'Prev' : 'Next'
        // })
        this.Button = this.Calendar.locator('a').filter({ hasText: `${this.ButtonName()}` })
        this.CalendarDay = this.Calendar.getByRole('cell').filter({ has: page.getByRole('link', { name: `${this.day}`, exact: true }) })
    }
    async pickDate() {
        // console.log(
        //     `\nToday year/month/day: ${this.today.getFullYear()}/${this.today.getUTCMonth()}/${this.today.getDate()}
        //      \nChosen Date year/month/day: ${this.year}/${this.month}/${this.day}`)
        await this.Input.click()
        for (let i = 0; i < Math.abs(this.clicks); i++) {
            await this.Button.click()
        }
        await this.CalendarDay.click()
        await this.Input.click()
        await expect(this.CalendarDay.getByRole('link')).toHaveClass(/ui-state-active/)
        await expect(this.CalendarDay).toHaveAttribute('data-month', `${this.month}`);
        await expect(this.CalendarDay).toHaveAttribute('data-year', `${this.year}`);
    }
    async inputDate() {
        await this.Input.click()
        await this.Input.type(`${this.month + 1}/${this.day}/${this.year}`)
        await expect(this.CalendarDay.getByRole('link')).toHaveClass(/ui-state-active/)
        await expect(this.CalendarDay).toHaveAttribute('data-month', `${this.month}`);
        await expect(this.CalendarDay).toHaveAttribute('data-year', `${this.year}`);
    }
}

export class SelectMenu {
    readonly page: Page;
    readonly Box: Locator
    readonly Header: Locator
    readonly Speed: Locator
    readonly File: Locator
    readonly Number: Locator
    readonly Product: Locator
    readonly Animal: Locator
    constructor(page: Page) {
        this.page = page;
        this.Box = this.page.locator('#HTML6')
        this.Header = this.Box.getByRole('heading', { name: 'Select menu', level: 2 })
        this.Speed = this.Box.locator('#speed')
        this.File = this.Box.locator('#files')
        this.Number = this.Box.locator('#number')
        this.Product = this.Box.locator('#products')
        this.Animal = this.Box.locator('#animals')
    }
}

export class DoubleClick {
    readonly page: Page;
    readonly Box: Locator
    readonly Header: Locator
    readonly Field1: Locator
    readonly Field2: Locator
    readonly Button: Locator
    constructor(page: Page) {
        this.page = page;
        this.Box = this.page.locator('#HTML10')
        this.Header = this.Box.getByRole('heading', { name: 'Double Click', level: 2 })
        this.Field1 = this.Box.locator('#field1')
        this.Field2 = this.Box.locator('#field2')
        this.Button = this.Box.getByRole('button')
    }
    async fillField(field: Locator, text: string) {
        await field.fill(text)
    }
}

export class DragAndDropText {
    readonly page: Page;
    readonly Box: Locator;
    readonly Header: Locator;
    readonly Drag: Locator;
    readonly Drop: Locator
    constructor(page: Page) {
        this.page = page;
        this.Box = this.page.locator('#HTML2')
        this.Header = this.Box.getByRole('heading', { name: 'Drag and Drop', level: 2 })
        this.Drag = this.Box.locator('#draggable')
        this.Drop = this.Box.locator('#droppable')
    }
    async DragAndDrop() {
        await this.Drag.dragTo(this.Drop);
        await expect(this.Drop).toHaveClass(/ui-state-highlight/)
        await expect(this.Drop).toHaveText('Dropped!')
    }
}

export class DragAndDropImage {
    readonly page: Page;
    readonly Box: Locator
    readonly Header: Locator;
    readonly Gallery: Locator;
    readonly GalleryItem: Locator;
    readonly Trash: Locator;
    readonly TrashItem: Locator;
    readonly Delete: Locator;
    readonly Recycle: Locator;
    readonly Images: {
        header: string,
        alt: string
    }[] = [
            {
                header: 'Mary',
                alt: 'The chalet at the Green mountain lake'
            },
            {
                header: "Mr John",
                alt: 'the peaks of high tatras'
            }
        ]
    constructor(page: Page) {
        this.page = page
        this.Box = this.page.locator('#HTML11')
        this.Header = this.Box.getByRole('heading', { name: 'Drag and Drop Images', level: 2 })
        this.Gallery = this.Box.locator('#gallery')
        this.GalleryItem = this.Gallery.getByRole('listitem')
        this.Trash = this.Box.locator('#trash')
        this.TrashItem = this.Trash.getByRole('listitem')
    }
    async dragToTrash(imgPos: number) {
        const startGalleryCount = await this.GalleryItem.count()
        const startTrashCount = await this.TrashItem.count()
        await this.GalleryItem.getByRole('img', { name: this.Images[imgPos].alt }).hover();
        await this.page.mouse.down()
        await this.Trash.hover()
        await expect(this.Trash).toHaveClass(/ui-droppable-active/)
        await expect(this.Trash).toHaveClass(/ui-state-highlight/)
        await expect(this.Trash).toHaveClass(/ui-droppable-hover/)
        await this.page.mouse.up()
        await expect(this.TrashItem.getByRole('img', { name: this.Images[imgPos].alt })).toBeVisible()
        await expect(this.GalleryItem).toHaveCount(startGalleryCount - 1)
        await expect(this.TrashItem).toHaveCount(startTrashCount + 1)
        await expect(this.Trash).not.toHaveClass(/ui-droppable-active/)
        await expect(this.Trash).not.toHaveClass(/ui-state-highlight/)
        await expect(this.Trash).not.toHaveClass(/ui-droppable-hover/)
    }
    async dragToGallery(imgPos: number) {
        const startGalleryCount = await this.GalleryItem.count()
        const startTrashCount = await this.TrashItem.count()
        await this.Trash.getByRole('img', { name: this.Images[imgPos].alt }).hover();
        await this.page.mouse.down()
        await this.Gallery.hover()
        await expect(this.Gallery).toHaveClass(/ui-droppable-active/)
        await expect(this.Gallery).toHaveClass(/custom-state-active/)
        await expect(this.Gallery).toHaveClass(/ui-droppable-hover/)
        await this.page.mouse.up()
        await expect(this.GalleryItem.getByRole('img', { name: this.Images[imgPos].alt })).toBeVisible()
        await expect(this.TrashItem).toHaveCount(startTrashCount - 1)
        await expect(this.GalleryItem).toHaveCount(startGalleryCount + 1)
        await expect(this.GalleryItem
            .filter({ hasText: this.Images[imgPos].header })
            .getByRole('link', { name: 'Delete image' }))
            .toBeVisible();
        await expect(this.Gallery).not.toHaveClass(/ui-droppable-active/)
        await expect(this.Gallery).not.toHaveClass(/custom-state-active/)
        await expect(this.Gallery).not.toHaveClass(/ui-droppable-hover/)
    }
    async clickToGallery(imgPos: number) {
        const startGalleryCount = await this.GalleryItem.count()
        const startTrashCount = await this.TrashItem.count()
        await this.TrashItem
            .filter({ hasText: this.Images[imgPos].header })
            .getByRole('link', { name: 'Recycle image' }).click();
        await expect(this.GalleryItem.getByRole('img', { name: this.Images[imgPos].alt })).toBeVisible()
        await expect(this.TrashItem).toHaveCount(startTrashCount - 1)
        await expect(this.GalleryItem).toHaveCount(startGalleryCount + 1)
        await expect(this.Trash).not.toHaveClass(/ui-droppable-active/)
        await expect(this.Trash).not.toHaveClass(/ui-state-highlight/)
        await expect(this.Trash).not.toHaveClass(/ui-droppable-hover/)
        await expect(this.GalleryItem
            .filter({ hasText: this.Images[imgPos].header })
            .getByRole('link', { name: 'Delete image' }))
            .toBeVisible();
    }
    async clickToTrash(imgPos: number) {
        const startGalleryCount = await this.GalleryItem.count()
        const startTrashCount = await this.TrashItem.count()
        await this.GalleryItem
            .filter({ hasText: this.Images[imgPos].header })
            .getByRole('link', { name: 'Delete image' }).click();
        await expect(this.GalleryItem.getByRole('img', { name: this.Images[imgPos].alt })).toBeVisible()
        await expect(this.GalleryItem).toHaveCount(startGalleryCount - 1)
        await expect(this.TrashItem).toHaveCount(startTrashCount + 1)
        await expect(this.Trash).not.toHaveClass(/ui-droppable-active/)
        await expect(this.Trash).not.toHaveClass(/ui-state-highlight/)
        await expect(this.Trash).not.toHaveClass(/ui-droppable-hover/)
    }
}
export class Slider {
    readonly page: Page;
    readonly Box: Locator
    readonly Header: Locator;
    constructor(page: Page) {
        this.page = page;
        this.Box = page.locator('#HTML7')
        this.Header = this.Box.getByRole('heading', { name: 'Slider', level: 2 })
    }
}
export class Resizable {
    readonly page: Page;
    readonly Box: Locator
    readonly Header: Locator;
    constructor(page: Page) {
        this.page = page;
        this.Box = page.locator('#HTML3')
        this.Header = this.Box.getByRole('heading', { name: 'Resizable', level: 2 })
    }
}
export class Table {
    readonly page: Page;
    readonly Box: Locator
    readonly Header: Locator;
    readonly Row: Locator;
    constructor(page: Page) {
        this.page = page;
        this.Box = page.locator('#HTML1')
        this.Header = this.Box.getByRole('heading', { name: 'HTML Table', level: 2 })
        this.Row = this.Box.getByRole('row').filter({ has: this.page.locator('td') })
    }
    async getTable() {
        const table = {
            items: new Array(),
            sumPrice: 0,
            levels: new Set(),
            languages: new Set(),
        }
        for (const row of await this.Row.all()) {
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