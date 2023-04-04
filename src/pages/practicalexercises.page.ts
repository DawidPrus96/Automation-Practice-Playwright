// playwright-dev-page.ts
import { expect, Page, Locator } from '@playwright/test';

export class Main {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
}
export class priceCalculation {
    readonly page: Page;
    private readonly price: Locator;
    private readonly weight: Locator;
    private readonly card: Locator;
    private readonly calculate: Locator;
    private readonly totalPrice: Locator;
    private readonly showTestResults: Locator;

    constructor(page: Page) {
        this.page = page
        this.price = page.locator('[data-harmony-id="Price"]')
        this.weight = page.locator('[data-harmony-id="Weight"]')
        this.card = page.locator('[data-harmony-id="Card"]')
        this.calculate = page.locator('[data-harmony-id="Add test"]')
        this.totalPrice = page.locator('[data-harmony-id="Total price"]')
        this.showTestResults = page.locator('[data-harmony-id="Stop"]')
    }

    async inputPrice(price?: number) {
        if (price)
            await this.price.fill(`${price}`)
    }
    async inputWeight(weight?: number) {
        if (weight)
            await this.weight.fill(`${weight}`)
    }
    async isCard(card?: boolean) {
        if (card)
            await this.card.check()
    }
    async getTotalPrice() {
        let price = Number(await this.price.inputValue())
        let weight = Number(await this.weight.inputValue())
        let isCard = await this.card.isChecked()
        let price2 = price
        console.log(price, weight, isCard)
        let totalPriceShould = 0
        await this.calculate.click()
        if (price >= 200 && weight < 5 && isCard)
            totalPriceShould = Math.round(price * 8.5) / 10
        else {
            if (isCard) {
                price2 -= Math.round(price2 * 0.3) / 10
                console.log(`1: ${price2}`)
            }

            if (price >= 200) {
                price2 -= Math.round(price2) / 10
                console.log(`2: ${price2}`)
            }

            if (price <= 100 && weight >= 5) {
                totalPriceShould = price2 + weight
                console.log(`3: ${totalPriceShould}, ${price}, ${price2}, ${weight}`)
            }

            else {
                totalPriceShould = price2
                console.log(`4: ${totalPriceShould}, ${price}, ${price2}, ${weight}`)
            }
        }

        await expect(this.totalPrice).toHaveText(`${totalPriceShould}`)
    }
}

export class Grades {
    readonly page: Page;
    private readonly blackboardExercises: Locator;
    private readonly laboratoryExercises: Locator;
    private readonly writtenPart: Locator;
    private readonly result: Locator;
    private readonly calculate: Locator;
    private readonly showTestResults: Locator;

    constructor(page: Page) {
        this.page = page
        this.blackboardExercises = page.locator('[data-harmony-id="BE"]')
        this.laboratoryExercises = page.locator('[data-harmony-id="LE"]')
        this.writtenPart = page.locator('[data-harmony-id="WP"]')
        this.result = page.locator('[data-harmony-id="cours result"]')
        this.calculate = page.locator('[data-harmony-id="Continue"]')
        this.showTestResults = page.locator('[data-harmony-id="Stop"]')
    }

    async inputBE(BE?: number) {
        if (BE)
            await this.blackboardExercises.fill(`${BE}`)
    }
    async inputLE(LE?: number) {
        if (LE)
            await this.laboratoryExercises.fill(`${LE}`)
    }
    async inputWP(WP?: number) {
        if (WP)
            await this.writtenPart.fill(`${WP}`)
    }
    async calculateResults() {
        let BE = Number(await this.blackboardExercises.inputValue())
        let LE = Number(await this.laboratoryExercises.inputValue())
        let WP = Number(await this.writtenPart.inputValue())
        if (BE == 0 && LE == 0 && WP == 0)
            return
        let SUM = BE + LE + WP
        await this.calculate.click()
        if (BE < 25 || LE < 25 || WP < 25 || SUM < 76)
            return await expect(this.result).toHaveText("failed")
        if (SUM >= 76 && SUM <= 100)
            return await expect(this.result).toHaveText("satisfactory")
        if (SUM >= 101 && SUM <= 125)
            return await expect(this.result).toHaveText("good")
        if (SUM > 125)
            return await expect(this.result).toHaveText("very good")
    }
}
