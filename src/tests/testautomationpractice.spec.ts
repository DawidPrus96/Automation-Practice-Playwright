// example.spec.ts
import { test, expect } from '@playwright/test';
import {
    Main,
    Wikipedia,
    Alert,
    DatePicker,
    SelectMenu,
    DoubleClick,
    DragAndDropText,
    DragAndDropImage,
    Table,
    AutomationTools
} from '../pages/testautomationpractice.page';
test.beforeEach(async ({ page }) => {
    const Pmain = new Main(page);
    await Pmain.page.goto('/')
    await expect(Pmain.page).toHaveURL('/')
    await expect(Pmain.Header).toBeVisible()

})
test.describe('Wikipedia', () => {
    test.beforeEach(async ({ page }) => {
        const Pwiki = new Wikipedia(page);
        await expect(Pwiki.Header).toBeVisible()
    })
    test('Empty phrase', async ({ page }) => {
        const Pwiki = new Wikipedia(page);
        let phrase = ''
        let count = await Pwiki.searchPhrase(phrase)
        expect(count).toEqual(0)
    });
    test('1 specific result', async ({ page }) => {
        const Pwiki = new Wikipedia(page);
        let phrase = 'Glacial lake outburst flood'
        let count = await Pwiki.searchPhrase(phrase)
        expect(count).toEqual(1)
        await Pwiki.GoToFirstArticle()
    });
    test('More than 5 results', async ({ page }) => {
        const Pwiki = new Wikipedia(page);
        let phrase = 'Glacial'
        let count = await Pwiki.searchPhrase(phrase)
        expect(count).toEqual(5)
        await Pwiki.GoToMoreResults(phrase)
    });
    test('Invalid New Windows', async ({ page }) => {
        const Pwiki = new Wikipedia(page);
        let phrase = 'asdasdasdasdasdas'
        let count = await Pwiki.searchPhrase(phrase)
        expect(count).toEqual(0)
        await expect(page.locator('#Wikipedia1_wikipedia-search-results')).toHaveText('No results found.')
    });
})
test.describe('Alert', () => {
    test.beforeEach(async ({ page }) => {
        const PAlert = new Alert(page);
        await expect(PAlert.LHeader).toBeVisible()
    })
    test('Accept', async ({ page }) => {
        const PAlert = new Alert(page);
        await PAlert.dialog(true)
    });
    test('Cancel', async ({ page }) => {
        const PAlert = new Alert(page);
        await PAlert.dialog(false)
    });
})
test.describe('Date Picker', () => {
    test.beforeEach(async ({ page }) => {
        const PDatePicker = new DatePicker(page, new Date());
        await expect(PDatePicker.Header).toBeVisible()
    })
    test('Past', async ({ page }) => {
        const date = new Date("2019-12-28");
        const PDatePicker = new DatePicker(page, date);
        await PDatePicker.pickDate()
    });
    test('Present', async ({ page }) => {
        const date = new Date();
        const PDatePicker = new DatePicker(page, date);
        await PDatePicker.pickDate()
    });
    test('Future', async ({ page }) => {
        const date = new Date("2027-1-28");
        const PDatePicker = new DatePicker(page, date);
        await PDatePicker.pickDate()
    });
    test('Fill textbox', async ({ page }) => {
        const date = new Date("2019-09-02");
        const PDatePicker = new DatePicker(page, date);
        await PDatePicker.inputDate()
    });
})
test.describe('Select Menu', () => {
    test.beforeEach(async ({ page }) => {
        const PSelectMenu = new SelectMenu(page);
        await expect(PSelectMenu.Header).toBeVisible()
    })
    test('Mid Options by value', async ({ page }) => {
        const PSelectMenu = new SelectMenu(page);
        await PSelectMenu.Speed.selectOption({ label: 'Medium' })
        await PSelectMenu.File.selectOption('2')
        await PSelectMenu.Number.selectOption({ label: '3' })
        await PSelectMenu.Product.selectOption('Yahoo')
        await PSelectMenu.Animal.selectOption('babycat')
        await expect(PSelectMenu.Box).toHaveScreenshot('Mid_Value.png')
    });
    test('Last Options by value', async ({ page }) => {
        const PSelectMenu = new SelectMenu(page);
        await PSelectMenu.Speed.selectOption({ label: 'Faster' })
        await PSelectMenu.File.selectOption('4')
        await PSelectMenu.Number.selectOption({ label: '5' })
        await PSelectMenu.Product.selectOption('Microsoft')
        await PSelectMenu.Animal.selectOption('avatar')
        await expect(PSelectMenu.Box).toHaveScreenshot('Last_Value.png')
    });
    test('Mid Options by label', async ({ page }) => {
        const PSelectMenu = new SelectMenu(page);
        await PSelectMenu.Speed.selectOption({ label: 'Medium' })
        await PSelectMenu.File.selectOption({ label: 'PDF file' })
        await PSelectMenu.Number.selectOption({ label: '3' })
        await PSelectMenu.Product.selectOption({ label: 'Yahoo' })
        await PSelectMenu.Animal.selectOption({ label: 'Baby Cat' })
        await expect(PSelectMenu.Box).toHaveScreenshot('Mid_Label.png')
    });
    test('Last Options by label', async ({ page }) => {
        const PSelectMenu = new SelectMenu(page);
        await PSelectMenu.Speed.selectOption({ label: 'Faster' })
        await PSelectMenu.File.selectOption({ label: 'Other file' })
        await PSelectMenu.Number.selectOption({ label: '5' })
        await PSelectMenu.Product.selectOption({ label: 'Bing' })
        await PSelectMenu.Animal.selectOption({ label: 'Avatar' })
        await expect(PSelectMenu.Box).toHaveScreenshot('Last_Label.png')
    });
})
test.fixme('Text Labels', async ({ page }) => {
    const playwrightDev = new AutomationTools(page);
    await expect(playwrightDev.LTextLabels.getByRole('heading', { name: 'Text Labels', level: 2 })).toBeVisible()
})
test.fixme('XPath Axes', async ({ page }) => {
    const playwrightDev = new AutomationTools(page);
    await expect(playwrightDev.LXPathAxes.getByRole('heading', { name: 'XPath Axes', level: 2 })).toBeVisible()
})
test.describe('Double click', () => {
    test.beforeEach(async ({ page }) => {
        const PDoubleClick = new DoubleClick(page);
        await expect(PDoubleClick.Header).toBeVisible()
        await PDoubleClick.Field1.clear()
        await PDoubleClick.Field2.clear()
    })
    test('Single Click', async ({ page }, testInfo) => {
        const PDoubleClick = new DoubleClick(page);
        await PDoubleClick.fillField(PDoubleClick.Field1, testInfo.title)
        await PDoubleClick.Button.click()
        await expect(PDoubleClick.Field1).toHaveValue(testInfo.title)
        await expect(PDoubleClick.Field2).toBeEmpty()
    });
    test('Empty Fields', async ({ page }) => {
        const PDoubleClick = new DoubleClick(page);
        await PDoubleClick.Button.dblclick()
        await expect(PDoubleClick.Field1).toBeEmpty()
        await expect(PDoubleClick.Field2).toBeEmpty()
    });
    test('Empty Field1 and filled Field2', async ({ page }, testInfo) => {
        const PDoubleClick = new DoubleClick(page);
        await PDoubleClick.fillField(PDoubleClick.Field2, testInfo.title)
        await PDoubleClick.Button.dblclick()
        await expect(PDoubleClick.Field1).toBeEmpty()
        await expect(PDoubleClick.Field2).toBeEmpty()
    });
    test('Double Click', async ({ page }, testInfo) => {
        const PDoubleClick = new DoubleClick(page);
        await PDoubleClick.fillField(PDoubleClick.Field1, testInfo.title)
        await PDoubleClick.Button.dblclick()
        await expect(PDoubleClick.Field1).toHaveValue(testInfo.title)
        await expect(PDoubleClick.Field2).toHaveValue(testInfo.title)
    });
})
test('Drag and Drop Text', async ({ page }) => {
    const PDragAndDropText = new DragAndDropText(page);
    await expect(PDragAndDropText.Header).toBeVisible()
    await PDragAndDropText.DragAndDrop()
})
test.describe('Drag and Drop Images', () => {
    test.beforeEach(async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await expect(PDragAndDropImage.Header).toBeVisible()
        await expect(PDragAndDropImage.Gallery.getByRole('listitem')).toHaveCount(2)
    })
    test('Drag 1 image to Trash', async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await PDragAndDropImage.dragToTrash(0)
    })
    test('Drag 2 images to Trash', async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await PDragAndDropImage.dragToTrash(0)
        await PDragAndDropImage.dragToTrash(1)
    })
    test('Drag 1 image to Gallery', async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await PDragAndDropImage.dragToTrash(0)
        await PDragAndDropImage.dragToGallery(0)
    })
    test('Drag 2 images to Gallery', async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await PDragAndDropImage.dragToTrash(0)
        await PDragAndDropImage.dragToTrash(1)
        await PDragAndDropImage.dragToGallery(0)
        await PDragAndDropImage.dragToGallery(1)
    })
    test('Click 1 image to Gallery', async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await PDragAndDropImage.dragToTrash(0)
        await PDragAndDropImage.clickToGallery(0)
    })
    test('Click 2 images to Gallery', async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await PDragAndDropImage.dragToTrash(0)
        await PDragAndDropImage.dragToTrash(1)
        await PDragAndDropImage.clickToGallery(0)
        await PDragAndDropImage.clickToGallery(1)
    })
    test('Click 1 image to Trash', async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await PDragAndDropImage.dragToTrash(0)
        await PDragAndDropImage.dragToGallery(0)
        await PDragAndDropImage.clickToTrash(0)
    })
    test('Click 2 images to Trash', async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await PDragAndDropImage.dragToTrash(0)
        await PDragAndDropImage.dragToTrash(1)
        await PDragAndDropImage.dragToGallery(0)
        await PDragAndDropImage.dragToGallery(1)
        await PDragAndDropImage.clickToTrash(0)
        await PDragAndDropImage.clickToTrash(1)
    })
})
test.fixme('Slider', async ({ page }) => {
    const playwrightDev = new AutomationTools(page);
    await expect(playwrightDev.page.getByRole('heading', { name: 'Slider', level: 2 })).toBeVisible()
})
test.fixme('Resizable', async ({ page }) => {
    const playwrightDev = new AutomationTools(page);
    await expect(playwrightDev.page.getByRole('heading', { name: 'Resizable', level: 2 })).toBeVisible()
})
test('Table', async ({ page }) => {
    const PTable = new Table(page);
    await expect(PTable.Header).toBeVisible()
    console.log(await PTable.getTable())
});
test.describe.fixme('Tooltips', () => {
    // test.beforeAll(async ({ page }) => {
    //     const playwrightDev = new AutomationTools(page);
    //     await expect(playwrightDev.LTooltips.getByRole('heading', { name: 'Tooltips', level: 2 })).toBeVisible()
    // })
    test('1st tooltip', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LTooltips.getByRole('heading', { name: 'Tooltips', level: 2 })).toBeVisible()
    })
})
test.fixme('Bar Codes', async ({ page }) => {
    const playwrightDev = new AutomationTools(page);
    await expect(playwrightDev.LBarCodes.getByRole('heading', { name: 'Bar Codes', level: 2 })).toBeVisible()
})
test.fixme('QR Code', async ({ page }) => {
    const playwrightDev = new AutomationTools(page);
    await expect(playwrightDev.LQRCode.getByRole('heading', { name: 'QR Code', level: 2 })).toBeVisible()
})