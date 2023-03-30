// example.spec.ts
import { test, expect } from '@playwright/test';
import { Main, DatePicker } from '../pages/testautomationpractice.page';
test.beforeEach(async ({ page }) => {
    const main = new Main(page);
    await main.page.goto('/')
    await expect(main.page).toHaveURL('/')
    await expect(main.Header).toBeVisible()
})
test.describe('Wikipedia', () => {
    test.beforeEach(async ({ page }) => {
        const wikipedia = new Main(page).Wikipedia;
        await expect(wikipedia.Header).toBeVisible()
    })
    test('Empty phrase', async ({ page }) => {
        const wikipedia = new Main(page).Wikipedia;
        let phrase = ''
        let count = await wikipedia.searchPhrase(phrase)
        expect(count).toEqual(0)
    });
    test('1 specific result', async ({ page }) => {
        const wikipedia = new Main(page).Wikipedia;
        let phrase = 'Glacial lake outburst flood'
        let count = await wikipedia.searchPhrase(phrase)
        expect(count).toEqual(1)
        await wikipedia.GoToFirstArticle()
    });
    test('More than 5 results', async ({ page }) => {
        const wikipedia = new Main(page).Wikipedia;
        let phrase = 'Glacial'
        let count = await wikipedia.searchPhrase(phrase)
        expect(count).toEqual(5)
        await wikipedia.GoToMoreResults(phrase)
    });
    test('Invalid New Windows', async ({ page }) => {
        const wikipedia = new Main(page).Wikipedia;
        let phrase = 'asdasdasdasdasdas'
        let count = await wikipedia.searchPhrase(phrase)
        expect(count).toEqual(0)
        await expect(page.locator('#Wikipedia1_wikipedia-search-results')).toHaveText('No results found.')
    });
})
test.describe('Alert', () => {
    test.beforeEach(async ({ page }) => {
        const alert = new Main(page).Alert;
        await expect(alert.Header).toBeVisible()
    })
    test('Accept', async ({ page }) => {
        const alert = new Main(page).Alert;
        await alert.dialog(true)
    });
    test('Cancel', async ({ page }) => {
        const alert = new Main(page).Alert;
        await alert.dialog(false)
    });
})
test.describe('Date Picker', () => {
    test.beforeEach(async ({ page }) => {
        const datePicker = new DatePicker(page);
        await expect(datePicker.Header).toBeVisible()
    })
    test('Past', async ({ page }) => {
        const date = new Date("2019-12-28");
        const datePicker = new DatePicker(page, date);
        await datePicker.pickDate()
    });
    test('Present', async ({ page }) => {
        const date = new Date();
        const datePicker = new DatePicker(page, date);
        await datePicker.pickDate()
    });
    test('Future', async ({ page }) => {
        const date = new Date("2027-1-28");
        const datePicker = new DatePicker(page, date);
        await datePicker.pickDate()
    });
    test('Fill textbox', async ({ page }) => {
        const date = new Date("2019-09-02");
        const datePicker = new DatePicker(page, date);
        await datePicker.inputDate()
    });
})
test.describe('Select Menu', () => {
    test.beforeEach(async ({ page }) => {
        const selectMenu = new Main(page).SelectMenu;
        await expect(selectMenu.Header).toBeVisible()
    })
    test('Mid Options by value', async ({ page }) => {
        const selectMenu = new Main(page).SelectMenu;
        await selectMenu.Speed.selectOption({ label: 'Medium' })
        await selectMenu.File.selectOption('2')
        await selectMenu.Number.selectOption({ label: '3' })
        await selectMenu.Product.selectOption('Yahoo')
        await selectMenu.Animal.selectOption('babycat')
        await expect(selectMenu.Box).toHaveScreenshot('Mid_Value.png')
    });
    test('Last Options by value', async ({ page }) => {
        const selectMenu = new Main(page).SelectMenu;
        await selectMenu.Speed.selectOption({ label: 'Faster' })
        await selectMenu.File.selectOption('4')
        await selectMenu.Number.selectOption({ label: '5' })
        await selectMenu.Product.selectOption('Microsoft')
        await selectMenu.Animal.selectOption('avatar')
        await expect(selectMenu.Box).toHaveScreenshot('Last_Value.png')
    });
    test('Mid Options by label', async ({ page }) => {
        const selectMenu = new Main(page).SelectMenu;
        await selectMenu.Speed.selectOption({ label: 'Medium' })
        await selectMenu.File.selectOption({ label: 'PDF file' })
        await selectMenu.Number.selectOption({ label: '3' })
        await selectMenu.Product.selectOption({ label: 'Yahoo' })
        await selectMenu.Animal.selectOption({ label: 'Baby Cat' })
        await expect(selectMenu.Box).toHaveScreenshot('Mid_Label.png')
    });
    test('Last Options by label', async ({ page }) => {
        const selectMenu = new Main(page).SelectMenu;
        await selectMenu.Speed.selectOption({ label: 'Faster' })
        await selectMenu.File.selectOption({ label: 'Other file' })
        await selectMenu.Number.selectOption({ label: '5' })
        await selectMenu.Product.selectOption({ label: 'Bing' })
        await selectMenu.Animal.selectOption({ label: 'Avatar' })
        await expect(selectMenu.Box).toHaveScreenshot('Last_Label.png')
    });
})
test.fixme('Text Labels', async ({ page }) => {
    const main = new Main(page);
    await expect(main.TextLabels.getByRole('heading', { name: 'Text Labels', level: 2 })).toBeVisible()
})
test.fixme('XPath Axes', async ({ page }) => {
    const playwrightDev = new Main(page);
    await expect(playwrightDev.XPathAxes.getByRole('heading', { name: 'XPath Axes', level: 2 })).toBeVisible()
})
test.describe('Double click', () => {
    test.beforeEach(async ({ page }) => {
        const doubleClick = new Main(page).DoubleClick;
        await expect(doubleClick.Header).toBeVisible()
        await doubleClick.Field1.clear()
        await doubleClick.Field2.clear()
    })
    test('Single Click', async ({ page }, testInfo) => {
        const doubleClick = new Main(page).DoubleClick;
        await doubleClick.fillField(doubleClick.Field1, testInfo.title)
        await doubleClick.Button.click()
        await expect(doubleClick.Field1).toHaveValue(testInfo.title)
        await expect(doubleClick.Field2).toBeEmpty()
    });
    test('Empty Fields', async ({ page }) => {
        const doubleClick = new Main(page).DoubleClick;
        await doubleClick.Button.dblclick()
        await expect(doubleClick.Field1).toBeEmpty()
        await expect(doubleClick.Field2).toBeEmpty()
    });
    test('Empty Field1 and filled Field2', async ({ page }, testInfo) => {
        const doubleClick = new Main(page).DoubleClick;
        await doubleClick.fillField(doubleClick.Field2, testInfo.title)
        await doubleClick.Button.dblclick()
        await expect(doubleClick.Field1).toBeEmpty()
        await expect(doubleClick.Field2).toBeEmpty()
    });
    test('Double Click', async ({ page }, testInfo) => {
        const doubleClick = new Main(page).DoubleClick;
        await doubleClick.fillField(doubleClick.Field1, testInfo.title)
        await doubleClick.Button.dblclick()
        await expect(doubleClick.Field1).toHaveValue(testInfo.title)
        await expect(doubleClick.Field2).toHaveValue(testInfo.title)
    });
})
test('Drag and Drop Text', async ({ page }) => {
    const dragAndDropText = new Main(page).DragAndDropText;
    await expect(dragAndDropText.Header).toBeVisible()
    await dragAndDropText.DragAndDrop()
})
test.describe('Drag and Drop Images', () => {
    test.beforeEach(async ({ page }) => {
        const dragAndDropImage = new Main(page).DragAndDropImage
        await expect(dragAndDropImage.Header).toBeVisible()
        await expect(dragAndDropImage.Gallery.getByRole('listitem')).toHaveCount(2)
    })
    test('Drag 1 image to Trash', async ({ page }) => {
        const dragAndDropImage = new Main(page).DragAndDropImage
        await dragAndDropImage.dragToTrash(0)
    })
    test('Drag 2 images to Trash', async ({ page }) => {
        const dragAndDropImage = new Main(page).DragAndDropImage
        await dragAndDropImage.dragToTrash(0)
        await dragAndDropImage.dragToTrash(1)
    })
    test('Drag 1 image to Gallery', async ({ page }) => {
        const dragAndDropImage = new Main(page).DragAndDropImage
        await dragAndDropImage.dragToTrash(0)
        await dragAndDropImage.dragToGallery(0)
    })
    test('Drag 2 images to Gallery', async ({ page }) => {
        const dragAndDropImage = new Main(page).DragAndDropImage
        await dragAndDropImage.dragToTrash(0)
        await dragAndDropImage.dragToTrash(1)
        await dragAndDropImage.dragToGallery(0)
        await dragAndDropImage.dragToGallery(1)
    })
    test('Click 1 image to Gallery', async ({ page }) => {
        const dragAndDropImage = new Main(page).DragAndDropImage
        await dragAndDropImage.dragToTrash(0)
        await dragAndDropImage.clickToGallery(0)
    })
    test('Click 2 images to Gallery', async ({ page }) => {
        const dragAndDropImage = new Main(page).DragAndDropImage
        await dragAndDropImage.dragToTrash(0)
        await dragAndDropImage.dragToTrash(1)
        await dragAndDropImage.clickToGallery(0)
        await dragAndDropImage.clickToGallery(1)
    })
    test('Click 1 image to Trash', async ({ page }) => {
        const dragAndDropImage = new Main(page).DragAndDropImage
        await dragAndDropImage.dragToTrash(0)
        await dragAndDropImage.dragToGallery(0)
        await dragAndDropImage.clickToTrash(0)
    })
    test('Click 2 images to Trash', async ({ page }) => {
        const dragAndDropImage = new Main(page).DragAndDropImage
        await dragAndDropImage.dragToTrash(0)
        await dragAndDropImage.dragToTrash(1)
        await dragAndDropImage.dragToGallery(0)
        await dragAndDropImage.dragToGallery(1)
        await dragAndDropImage.clickToTrash(0)
        await dragAndDropImage.clickToTrash(1)
    })
})
test('Slider', async ({ page }) => {
    const slider = new Main(page).Slider;
    await expect(slider.Header).toBeVisible()
    await slider.slide(0.7)
    await slider.slide(0.2)
});
test.fixme('Resizable', async ({ page }) => {
    const resizable = new Main(page).Resizable;
    await expect(resizable.Header).toBeVisible()
})
test('Table', async ({ page }) => {
    const table = new Main(page).Table;
    await expect(table.Header).toBeVisible()
    console.log(await table.getTable())
});
test.describe.fixme('Tooltips', () => {
    test.beforeAll(async ({ page }) => {
        const main = new Main(page);
        await expect(main.Tooltips.getByRole('heading', { name: 'Tooltips', level: 2 })).toBeVisible()
    })
    test('1st tooltip', async ({ page }) => {
        const main = new Main(page);
        await expect(main.Tooltips.getByRole('heading', { name: 'Tooltips', level: 2 })).toBeVisible()
    })
})
test.fixme('Bar Codes', async ({ page }) => {
    const main = new Main(page);
    await expect(main.BarCodes.getByRole('heading', { name: 'Bar Codes', level: 2 })).toBeVisible()
})
test.fixme('QR Code', async ({ page }) => {
    const main = new Main(page);
    await expect(main.QRCode.getByRole('heading', { name: 'QR Code', level: 2 })).toBeVisible()
})