// playwright-dev-page.ts
import { expect, Page, Locator } from '@playwright/test';
export class Main {
    readonly page: Page;
    readonly Header: Locator;
    readonly Wikipedia: Wikipedia;
    readonly Alert: Alert;
    readonly DatePicker: DatePicker;
    readonly SelectMenu: SelectMenu;
    readonly Table: Table;
    readonly DoubleClick: DoubleClick;
    readonly DragAndDropText: DragAndDropText;
    readonly DragAndDropImage: DragAndDropImage;
    readonly Slider: Slider;
    readonly Resizable: Resizable;
    readonly TextLabels: Locator
    readonly XPathAxes: Locator
    readonly Tooltips: Locator
    readonly BarCodes: Locator
    readonly QRCode: Locator
    readonly DatePickerInput: Locator
    readonly DatePickerCalendar: Locator
    readonly TableRow: Locator
    constructor(page: Page) {
        this.page = page;
        this.Header = this.page.locator('#Header1').getByRole('heading', { name: 'Automation Testing Practice', level: 1 });
        this.Wikipedia = new Wikipedia(page)
        this.Alert = new Alert(page)
        this.DatePicker = new DatePicker(page)
        this.SelectMenu = new SelectMenu(page)
        this.Table = new Table(page)
        this.DoubleClick = new DoubleClick(page)
        this.DragAndDropImage = new DragAndDropImage(page)
        this.DragAndDropText = new DragAndDropText(page)
        this.Slider = new Slider(page)
        this.Resizable = new Resizable(page)
        this.TextLabels = page.locator('#Text1')
        this.XPathAxes = page.locator('#HTML14')
        this.Tooltips = page.locator('#HTML8')
        this.BarCodes = page.locator('#HTML12')
        this.QRCode = page.locator('#HTML4')
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
    readonly Box: Locator;
    readonly Header: Locator;
    readonly Button: Locator;
    readonly Message: Locator;
    constructor(page: Page) {
        this.page = page;
        this.Box = this.page.locator('#HTML9')
        this.Header = this.Box.getByRole('heading', { name: 'Alert', level: 2 })
        this.Button = this.Box.getByRole('button')
        this.Message = this.Box.getByRole('paragraph')
    }
    async dialog(accept: boolean) {
        this.page.once('dialog', dialog => {
            if (accept)
                dialog.accept()
            else
                dialog.dismiss()
        });
        await this.Button.click()
        if (accept)
            await expect(this.Message).toHaveText('You pressed OK!')
        else
            await expect(this.Message).toHaveText('You pressed Cancel!')
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
    readonly Slider: Locator;
    constructor(page: Page) {
        this.page = page;
        this.Box = this.page.locator('#HTML7')
        this.Header = this.Box.getByRole('heading', { name: 'Slider', level: 2 })
        this.Slider = this.Box.locator('#slider')
    }
    async slide(ratio: number) {
        let sliderwWidth = 0
        const sliderBoundingBox = await this.Slider.boundingBox()
        if (sliderBoundingBox != null)
            sliderwWidth = sliderBoundingBox.width
        await this.Slider.dragTo(this.Slider, {
            force: true,
            targetPosition: {
                x: sliderwWidth * ratio,
                y: 0,
            }
        })
        await expect(this.Slider.locator('span')).toHaveAttribute('style', `left: ${ratio * 100}%;`)
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