// example.spec.ts
import { test, expect } from '@playwright/test';
import { AutomationTools } from '../pages/testautomationpractice.page';
test.beforeEach(async ({ page }) => {
    const playwrightDev = new AutomationTools(page);
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(playwrightDev.LMainHeader.getByRole('heading', { name: 'Automation Testing Practice', level: 1 })).toBeVisible()

})
test.describe('Wikipedia', () => {
    test.beforeEach(async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LWiki.getByRole('heading', { name: 'New Windows', level: 2 })).toBeVisible()
    })
    test('Empty phrase', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        let phrase = ''
        let count = await playwrightDev.searchWikipediaPhrase(phrase)
        expect(count).toEqual(0)
    });
    test('1 specific result', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        let phrase = 'Glacial lake outburst flood'
        let count = await playwrightDev.searchWikipediaPhrase(phrase)
        expect(count).toEqual(1)
        await playwrightDev.GoToFirstWikipediaArticle()
    });
    test('More than 5 results', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        let phrase = 'Glacial'
        let count = await playwrightDev.searchWikipediaPhrase(phrase)
        expect(count).toEqual(5)
        await playwrightDev.GoToMoreWikipediaResults(phrase)
    });
    test('Invalid New Windows', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        let phrase = 'asdasdasdasdasdas'
        let count = await playwrightDev.searchWikipediaPhrase(phrase)
        expect(count).toEqual(0)
        await expect(page.locator('#Wikipedia1_wikipedia-search-results')).toHaveText('No results found.')
    });
})
test.describe('Alert', () => {
    test.beforeEach(async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LAlert.getByRole('heading', { name: 'Alert', level: 2 })).toBeVisible()
    })
    test('Accept', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.dialog(true)
    });
    test('Cancel', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.dialog(false)
    });
})
test.describe('Date Picker', () => {
    test.beforeEach(async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LDatePicker.getByRole('heading', { name: 'Date Picker', level: 2 })).toBeVisible()
    })
    test('Select date from calendar', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        const date = new Date("2019-09-01");
        await playwrightDev.pickDate(date)
    });
    test('Input date into textbox', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        const date = new Date("2019-09-02");
        await playwrightDev.inputDate(date)
    });
})
test.describe('Select Menu', () => {
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
test.describe('Double click', () => {
    test.beforeEach(async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LDoubleClick.getByRole('heading', { name: 'Double Click', level: 2 })).toBeVisible()
        await playwrightDev.LDoubleClickField1.clear()
        await playwrightDev.LDoubleClickField2.clear()
    })
    test('Single Click', async ({ page }, testInfo) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.fillField1(testInfo.title)
        await playwrightDev.LDoubleClickButton.click()
        await expect(playwrightDev.LDoubleClickField1).toHaveValue(testInfo.title)
        await expect(playwrightDev.LDoubleClickField2).toBeEmpty()
    });
    test('Empty Fields', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.LDoubleClickButton.dblclick()
        await expect(playwrightDev.LDoubleClickField1).toBeEmpty()
        await expect(playwrightDev.LDoubleClickField2).toBeEmpty()
    });
    test('Empty Field1 and filled Field2', async ({ page }, testInfo) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.fillField2(testInfo.title)
        await playwrightDev.LDoubleClickButton.dblclick()
        await expect(playwrightDev.LDoubleClickField1).toBeEmpty()
        await expect(playwrightDev.LDoubleClickField2).toBeEmpty()
    });
    test('Double Click', async ({ page }, testInfo) => {
        const playwrightDev = new AutomationTools(page);
        await playwrightDev.fillField1(testInfo.title)
        await playwrightDev.LDoubleClickButton.dblclick()
        await expect(playwrightDev.LDoubleClickField1).toHaveValue(testInfo.title)
        await expect(playwrightDev.LDoubleClickField2).toHaveValue(testInfo.title)
    });
})
test.describe('Right Panel', () => {
    test('Drag and Drop Text', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LDragAndDropText.getByRole('heading', { name: 'Drag and Drop', level: 2 })).toBeVisible()
        await playwrightDev.DragAndDropText()
    })
    test.skip('Drag and Drop Images', async ({ page }) => {
        const playwrightDev = new AutomationTools(page);
        await expect(playwrightDev.LDragAndDropImages.getByRole('heading', { name: 'Drag and Drop Images', level: 2 })).toBeVisible()
        console.log('test')
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
test.describe('Bottom Panel', () => {
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