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
    await expect(Pmain.LHeader).toBeVisible()

})
test.describe('Wikipedia', () => {
    test.beforeEach(async ({ page }) => {
        const Pwiki = new Wikipedia(page);
        await expect(Pwiki.LHeader).toBeVisible()
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
        await expect(PDatePicker.LHeader).toBeVisible()
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
        await expect(PSelectMenu.LHeader).toBeVisible()
    })
    test('Mid Options by value', async ({ page }) => {
        const PSelectMenu = new SelectMenu(page);
        await PSelectMenu.LSpeed.selectOption({ label: 'Medium' })
        await PSelectMenu.LFile.selectOption('2')
        await PSelectMenu.LNumber.selectOption({ label: '3' })
        await PSelectMenu.LProduct.selectOption('Yahoo')
        await PSelectMenu.LAnimal.selectOption('babycat')
        await expect(PSelectMenu.LBox).toHaveScreenshot('Mid_Value.png')
    });
    test('Last Options by value', async ({ page }) => {
        const PSelectMenu = new SelectMenu(page);
        await PSelectMenu.LSpeed.selectOption({ label: 'Faster' })
        await PSelectMenu.LFile.selectOption('4')
        await PSelectMenu.LNumber.selectOption({ label: '5' })
        await PSelectMenu.LProduct.selectOption('Microsoft')
        await PSelectMenu.LAnimal.selectOption('avatar')
        await expect(PSelectMenu.LBox).toHaveScreenshot('Last_Value.png')
    });
    test('Mid Options by label', async ({ page }) => {
        const PSelectMenu = new SelectMenu(page);
        await PSelectMenu.LSpeed.selectOption({ label: 'Medium' })
        await PSelectMenu.LFile.selectOption({ label: 'PDF file' })
        await PSelectMenu.LNumber.selectOption({ label: '3' })
        await PSelectMenu.LProduct.selectOption({ label: 'Yahoo' })
        await PSelectMenu.LAnimal.selectOption({ label: 'Baby Cat' })
        await expect(PSelectMenu.LBox).toHaveScreenshot('Mid_Label.png')
    });
    test('Last Options by label', async ({ page }) => {
        const PSelectMenu = new SelectMenu(page);
        await PSelectMenu.LSpeed.selectOption({ label: 'Faster' })
        await PSelectMenu.LFile.selectOption({ label: 'Other file' })
        await PSelectMenu.LNumber.selectOption({ label: '5' })
        await PSelectMenu.LProduct.selectOption({ label: 'Bing' })
        await PSelectMenu.LAnimal.selectOption({ label: 'Avatar' })
        await expect(PSelectMenu.LBox).toHaveScreenshot('Last_Label.png')
    });
})
test.describe.skip('Text Labels', () => {
    test.beforeEach(async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LTextLabels.getByRole('heading', { name: 'Text Labels', level: 2 })).toBeVisible()
    })
    test('test', async () => {
        console.log('test')
    })
})
test.describe.skip('XPath Axes', () => {
    test.beforeEach(async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LXPathAxes.getByRole('heading', { name: 'XPath Axes', level: 2 })).toBeVisible()
    })
    test('test', async () => {
        console.log('test')
    })
})
test.describe('Double click', () => {
    test.beforeEach(async ({ page }) => {
        const PDoubleClick = new DoubleClick(page);
        await expect(PDoubleClick.LHeader).toBeVisible()
        await PDoubleClick.LField1.clear()
        await PDoubleClick.LField2.clear()
    })
    test('Single Click', async ({ page }, testInfo) => {
        const PDoubleClick = new DoubleClick(page);
        await PDoubleClick.fillField(PDoubleClick.LField1, testInfo.title)
        await PDoubleClick.LButton.click()
        await expect(PDoubleClick.LField1).toHaveValue(testInfo.title)
        await expect(PDoubleClick.LField2).toBeEmpty()
    });
    test('Empty Fields', async ({ page }) => {
        const PDoubleClick = new DoubleClick(page);
        await PDoubleClick.LButton.dblclick()
        await expect(PDoubleClick.LField1).toBeEmpty()
        await expect(PDoubleClick.LField2).toBeEmpty()
    });
    test('Empty Field1 and filled Field2', async ({ page }, testInfo) => {
        const PDoubleClick = new DoubleClick(page);
        await PDoubleClick.fillField(PDoubleClick.LField2, testInfo.title)
        await PDoubleClick.LButton.dblclick()
        await expect(PDoubleClick.LField1).toBeEmpty()
        await expect(PDoubleClick.LField2).toBeEmpty()
    });
    test('Double Click', async ({ page }, testInfo) => {
        const PDoubleClick = new DoubleClick(page);
        await PDoubleClick.fillField(PDoubleClick.LField1, testInfo.title)
        await PDoubleClick.LButton.dblclick()
        await expect(PDoubleClick.LField1).toHaveValue(testInfo.title)
        await expect(PDoubleClick.LField2).toHaveValue(testInfo.title)
    });
})
test.describe('Right Panel', () => {
    test('Drag and Drop Text', async ({ page }) => {
        const PDragAndDropText = new DragAndDropText(page);
        await expect(PDragAndDropText.LHeader).toBeVisible()
        await PDragAndDropText.DragAndDrop()
    })
    test.skip('Drag 1 image to trash', async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await PDragAndDropImage.DragToTrash(PDragAndDropImage.LImage1)
        // await page.mouse.down()
        // await playwrightDev.LDragAndDropImages.getByRole('img', { name: 'The chalet at the Green mountain lake' }).focus();
    })
    test.skip('Drag 2 images to trash', async ({ page }) => {
        const PDragAndDropImage = new DragAndDropImage(page);
        await PDragAndDropImage.DragToTrash(PDragAndDropImage.LImage1)
        await PDragAndDropImage.DragToTrash(PDragAndDropImage.LImage2)
        // await page.mouse.down()
        // await playwrightDev.LDragAndDropImages.getByRole('img', { name: 'The chalet at the Green mountain lake' }).focus();
    })
    test.skip('Slider', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.page.getByRole('heading', { name: 'Slider', level: 2 })).toBeVisible()
        console.log('test')
    })
    test.skip('Resizable', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.page.getByRole('heading', { name: 'Resizable', level: 2 })).toBeVisible()
        console.log('test')
    })
})
test.describe('Bottom Panel', () => {
    test('Table', async ({ page }) => {
        const PTable = new Table(page);
        await expect(PTable.LHeader).toBeVisible()
        console.log(await PTable.getTable())
    });
    test.skip('Tooltips', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LTooltips.getByRole('heading', { name: 'Tooltips', level: 2 })).toBeVisible()
        console.log('test')
    })
    test.skip('Bar Codes', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LBarCodes.getByRole('heading', { name: 'Bar Codes', level: 2 })).toBeVisible()
        console.log('test')
    })
    test.skip('QR Code', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LQRCode.getByRole('heading', { name: 'QR Code', level: 2 })).toBeVisible()
        console.log('test')
    })
})