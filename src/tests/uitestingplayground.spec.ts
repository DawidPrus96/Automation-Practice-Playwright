// example.spec.ts
import { test, expect } from '@playwright/test';

test('progress bar', async ({ page }) => {
    await page.goto('http://uitestingplayground.com/progressbar')
    await page.getByRole('button', { name: 'Start' }).click()
    await expect(page.locator('#progressBar')).toHaveText(/\b([7][5-9]|[8-9][0-9]|100)\b/, { timeout: 60 * 1000 })
    await page.getByRole('button', { name: 'Stop' }).click()
})
test('visibility of buttons', async ({ page }) => {
    await page.goto('http://uitestingplayground.com/visibility')
    const countBefore = await page.getByRole('button').count()
    let visibleButtons = 0
    await page.getByRole('button', { name: 'hide' }).click()
    for (let i = 0; i < countBefore; i++) {
        let button = page.getByRole('button').nth(i)
        if (await button.isVisible()) {
            console.log(await button.innerText())
            visibleButtons++
        }
    }
    const countAfter = await page.getByRole('button').count()
    console.log(countBefore, countAfter, visibleButtons)
})