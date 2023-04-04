// example.spec.ts
import { test, expect } from '@playwright/test';
import { Grades, priceCalculation } from '../pages/practicalexercises.page';

test.fixme('Price calculation', async ({ page }) => {
    const main = new priceCalculation(page)
    await main.page.goto('price-calculation/')
    for (let i = 0; i <= 210; i += 10) {
        await main.inputPrice(i)
        for (let j = 0; j < 6; j++) {
            await main.inputWeight(j)
            for (let k = 0; k <= 1; k++) {
                await main.isCard(Boolean(k))
                await main.getTotalPrice()
            }
        }
    }
})
test('Grades', async ({ page }) => {
    const main = new Grades(page)
    let BE = [1, 24, 25, 26, 50]
    let LE = [1, 24, 25, 26, 50]
    let WP = [1, 24, 25, 26, 50]
    await main.page.goto('university-grade/')
    for (let i in BE) {
        await main.inputBE(BE[i])
        for (let j in LE) {
            await main.inputLE(LE[j])
            for (let k in WP) {
                await main.inputWP(WP[k])
                await main.calculateResults()
            }
        }
    }
})