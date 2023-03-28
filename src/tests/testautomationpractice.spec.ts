// example.spec.ts
import { test, expect } from '@playwright/test';
import { Main, Wikipedia, Alert, DatePicker, AutomationTools } from '../pages/testautomationpractice.page';
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
test.describe.skip('Select Menu', () => {
    test.beforeEach(async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LSelectMenu.getByRole('heading', { name: 'Select menu', level: 2 })).toBeVisible()
    })

    test('Speeds', async ({ page }) => {
        await page.locator('#speed').selectOption('Medium')
    });
    test('Files by value', async ({ page }) => {
        await page.locator('#files').selectOption('3')
    });
    test('Files by label', async ({ page }) => {
        await page.locator('#files').selectOption({ label: 'DOC file' })
    });
    test('Numbers', async ({ page }) => {
        await page.locator('#number').selectOption('3')
    });
    test('Products by value', async ({ page }) => {
        await page.locator('#products').selectOption('Iphone')
    });
    test('Products by label', async ({ page }) => {
        await page.locator('#products').selectOption({ label: 'Yahoo' })
    });
    test('Animals by value', async ({ page }) => {
        await page.locator('#animals').selectOption('babycat')
    });
    test('Animals by label', async ({ page }) => {
        await page.locator('#animals').selectOption({ label: 'Baby Cat' })
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
test.describe.skip('Double click', () => {
    test.beforeEach(async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LDoubleClick.getByRole('heading', { name: 'Double Click', level: 2 })).toBeVisible()
        await playwrightDev.LDCField1.clear()
        await playwrightDev.LDCField2.clear()
    })
    test('Single Click', async ({ page }, testInfo) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.fillField1(testInfo.title)
        await playwrightDev.LDoubleClickButton.click()
        await expect(playwrightDev.LDCField1).toHaveValue(testInfo.title)
        await expect(playwrightDev.LDCField2).toBeEmpty()
    });
    test('Empty Fields', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.LDoubleClickButton.dblclick()
        await expect(playwrightDev.LDCField1).toBeEmpty()
        await expect(playwrightDev.LDCField2).toBeEmpty()
    });
    test('Empty Field1 and filled Field2', async ({ page }, testInfo) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.fillField2(testInfo.title)
        await playwrightDev.LDoubleClickButton.dblclick()
        await expect(playwrightDev.LDCField1).toBeEmpty()
        await expect(playwrightDev.LDCField2).toBeEmpty()
    });
    test('Double Click', async ({ page }, testInfo) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.fillField1(testInfo.title)
        await playwrightDev.LDoubleClickButton.dblclick()
        await expect(playwrightDev.LDCField1).toHaveValue(testInfo.title)
        await expect(playwrightDev.LDCField2).toHaveValue(testInfo.title)
    });
})
test.describe.skip('Right Panel', () => {
    test('Drag and Drop Text', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LDragAndDropText.getByRole('heading', { name: 'Drag and Drop', level: 2 })).toBeVisible()
        await playwrightDev.DragAndDropText()
    })
    test('Drag and Drop Images', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LDragAndDropImages.getByRole('heading', { name: 'Drag and Drop Images', level: 2 })).toBeVisible()
        await playwrightDev.LImage1.hover();
        await page.mouse.down()
        await playwrightDev.LTrash.hover()
        await expect(playwrightDev.LDragAndDropImages
            .locator('#trash\
        .ui-droppable-active\
        .ui-state-highlight\
        .ui-droppable-hover')).toBeVisible()
        //await page.mouse.up()
        // await page.mouse.down()
        // await playwrightDev.LDragAndDropImages.getByRole('img', { name: 'The chalet at the Green mountain lake' }).focus();
    })
    test.skip('Slider', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LSlider.getByRole('heading', { name: 'Slider', level: 2 })).toBeVisible()
        console.log('test')
    })
    test.skip('Resizable', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LResizable.getByRole('heading', { name: 'Resizable', level: 2 })).toBeVisible()
        console.log('test')
    })
})
test.describe.skip('Bottom Panel', () => {
    test('Table', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LTable.getByRole('heading', { name: 'HTML Table', level: 2 })).toBeVisible()
        console.log(await playwrightDev.getTable())
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