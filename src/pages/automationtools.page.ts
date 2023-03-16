// playwright-dev-page.ts
import { expect, Locator, Page } from '@playwright/test';

export class AutomationTools {
    readonly page: Page;
    // readonly getStartedLink: Locator;
    // readonly gettingStartedHeader: Locator;
    // readonly pomLink: Locator;
    // readonly tocList: Locator;
    readonly footer: Locator
    readonly cartProduct: Locator
    readonly cartProductDescription: Locator
    readonly cartProductPrice: Locator
    readonly cartProductQuantity: Locator
    readonly cartProductTotal: Locator
    constructor(page: Page) {
        this.page = page;
        // this.getStartedLink = page.locator('a', { hasText: 'Get started' });
        // this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
        // this.pomLink = page.locator('li', { hasText: 'Guides' }).locator('a', { hasText: 'Page Object Model' });
        // this.tocList = page.locator('article div.markdown ul > li > a');
        this.footer = page.locator('#footer')
        this.cartProduct = page.locator('xpath=//tbody/tr')
        this.cartProductDescription = this.cartProduct.locator('xpath=/td[@class="cart_description"]')
        this.cartProductPrice = this.cartProduct.locator('xpath=/td[@class="cart_price"]')
        this.cartProductQuantity = this.cartProduct.locator('xpath=/td[@class="cart_quantity"]')
        this.cartProductTotal = this.cartProduct.locator('xpath=/td[@class="cart_total"]')
    }

    async gotoPage(tabName: string) {
        await this.page.getByRole('banner')
            .getByRole('link', { name: tabName }).click()
    }
    async startSignup(user: any) {
        await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()
        await this.page.locator('xpath=//*[@data-qa="signup-name"]').fill(user.name)
        await this.page.locator('xpath=//*[@data-qa="signup-email"]').fill(user.email)
        await this.page.locator('xpath=//*[@data-qa="signup-button"]').click()
    }
    async signupForm(user: any) {
        await expect(this.page.getByRole('heading', { name: 'ENTER ACCOUNT INFORMATION' })).toBeVisible()
        await this.page.getByLabel(user.gender).check()
        await this.page.locator('xpath=//*[@data-qa="password"]').fill(user.password)
        await this.page.locator('xpath=//*[@data-qa="days"]').selectOption(`${user.dateOfBirth.getDay()}`)
        await this.page.locator('xpath=//*[@data-qa="months"]').selectOption(`${user.dateOfBirth.toLocaleString("en-US", { month: "long" })}`)
        await this.page.locator('xpath=//*[@data-qa="years"]').selectOption(`${user.dateOfBirth.getFullYear()}`)
        if (user.newsletter)
            await this.page.getByRole('checkbox', { name: 'newsletter' }).check()
        if (user.offers)
            await this.page.getByRole('checkbox', { name: 'offers' }).check()
        await this.page.locator('xpath=//*[@data-qa="first_name"]').fill(user.firstName)
        await this.page.locator('xpath=//*[@data-qa="last_name"]').fill(user.lastName)
        await this.page.locator('xpath=//*[@data-qa="company"]').fill(user.company)
        await this.page.locator('xpath=//*[@data-qa="address"]').fill(user.address)
        await this.page.locator('xpath=//*[@data-qa="address2"]').fill(user.address2)
        await this.page.locator('xpath=//*[@data-qa="country"]').selectOption(user.country)
        await this.page.locator('xpath=//*[@data-qa="state"]').fill(user.state)
        await this.page.locator('xpath=//*[@data-qa="city"]').fill(user.city)
        await this.page.locator('xpath=//*[@data-qa="zipcode"]').fill(user.zipcode)
        await this.page.locator('xpath=//*[@data-qa="mobile_number"]').fill(`${user.mobileNumber}`)
        await this.page.locator('xpath=//*[@data-qa="create-account"]').click()
        await expect(this.page.getByRole('heading', { name: 'ACCOUNT CREATED!' })).toBeVisible()
        await this.page.locator('xpath=//*[@data-qa="continue-button"]').click()
    }
    async login(user: any) {
        await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()
        await this.page.locator('xpath=//*[@data-qa="login-email"]').fill(user.email)
        await this.page.locator('xpath=//*[@data-qa="login-password"]').fill(user.password)
        await this.page.locator('xpath=//*[@data-qa="login-button"]').click()
    }
    async deleteAccount(user: any) {
        await expect(this.page.getByText(`Logged in as ${user.name}`, { exact: true })).toBeVisible()
        await this.page.getByRole('link', { name: 'Delete Account' }).click()
        await expect(this.page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
        await this.page.locator('xpath=//*[@data-qa="continue-button"]').click()
        await expect(this.page).toHaveURL('/')
    }
    // async getStarted() {
    //     await this.getStartedLink.first().click();
    //     await expect(this.gettingStartedHeader).toBeVisible();
    // }

    // async pageObjectModel() {
    //     await this.getStarted();
    //     await this.pomLink.click();
    // }
    async logout(user: any) {
        await expect(this.page.getByText(`Logged in as ${user.name}`, { exact: true })).toBeVisible()
        await this.page.getByRole('link', { name: 'logout' }).click()
        await expect(this.page).toHaveURL('/login')
    }
    async contactUsForm(user: any) {
        await expect(this.page.getByRole('heading', { name: 'GET IN TOUCH' })).toBeVisible()
        const response = await this.page.request.get('https://maps.googleapis.com/maps/api/mapsjs/gen_204?csp_test=true');
        await expect(response).toBeOK();
        // await this.page.locator('xpath=//*[@data-qa="message"]').hover()
        await this.page.locator('xpath=//*[@data-qa="name"]').fill(user.name)
        await this.page.locator('xpath=//*[@data-qa="email"]').fill(user.email)
        await this.page.locator('xpath=//*[@data-qa="subject"]').fill(user.subject)
        await this.page.locator('xpath=//*[@data-qa="message"]').fill(user.message)
        await this.page.locator('input[name="upload_file"]').setInputFiles('exampleTextFile.txt');
        await this.page.locator('xpath=//*[@data-qa="submit-button"]').click()
    }
    async contactUsGoHome() {
        await expect(this.page.locator('xpath=//div[@class="contact-form"]').getByText('Success! Your details have been submitted successfully.')).toBeVisible()
        await this.page.locator('xpath=//div[@class="contact-form"]').getByRole('link', { name: 'Home' }).click();
        await expect(this.page).toHaveURL('/')
    }
    async viewProduct() {
        await expect(this.page.getByRole('heading', { name: 'ALL PRODUCTS' })).toBeVisible()
        await expect(this.page.locator('xpath=//div[@class="features_items"]')).toBeVisible()
        await this.page.getByRole('link', { name: 'view product' }).first().click()
        await expect(this.page).toHaveURL(/\/product_details\//)
        let productDetails = this.page.locator('xpath=//div[@class="product-information"]')
        await expect(productDetails.getByRole('heading')).toBeVisible()
        await expect(productDetails.getByText('Category')).toBeVisible()
        await expect(productDetails.getByText('Rs. ')).toBeVisible()
        await expect(productDetails.getByText('Availability: ')).toBeVisible()
        await expect(productDetails.getByText('Condition: ')).toBeVisible()
        await expect(productDetails.getByText('Brand: ')).toBeVisible()
    }
    async searchForProduct(productName: string) {
        await expect(this.page.getByRole('heading', { name: 'ALL PRODUCTS' })).toBeVisible()
        await expect(this.page.locator('xpath=//div[@class="features_items"]')).toBeVisible()
        await this.page.getByPlaceholder('Search Product').fill(productName);
        await this.page.locator('xpath=//button[@id="submit_search"]').click()
        let allSearchedProducts = await this.page.locator(`xpath=//div[starts-with(@class, "productinfo")]/p`).count()
        let correctSearchedProducts = await this.page.locator(`xpath=//div[starts-with(@class, "productinfo")]/p[contains(text(),${new RegExp(productName, "i")})]`).count()
        expect(allSearchedProducts).toEqual(correctSearchedProducts)
    }
    async subscribe(email: string) {
        await expect(this.footer.getByRole('heading', { name: 'Subscription' })).toBeVisible()
        await this.footer.getByRole('textbox').fill(email)
        await this.footer.getByRole('button').click()
        await expect(this.footer.getByText('You have been successfully subscribed!')).toBeVisible()
    }
    async addProductToCart(productPosition: number, continueShopping: boolean) {
        await expect(this.page.getByRole('heading', { name: 'ALL PRODUCTS' })).toBeVisible()
        await expect(this.page.locator('xpath=//div[@class="features_items"]')).toBeVisible()
        await this.page.locator('xpath=//div[contains(@class, "productinfo")]/a[contains(text(), "Add to cart")]').nth(productPosition).hover()
        await this.page.locator('xpath=//div[contains(@class, "overlay-content")]/a[contains(text(), "Add to cart")]').nth(productPosition).click()
        if (continueShopping)
            await this.page.getByRole('button', { name: 'Continue Shopping' }).click()
        const itemDetails = {
            name: await this.page.locator('xpath=//div[contains(@class, "productinfo")]').getByRole('paragraph').nth(productPosition).textContent(),
            price: Number((await this.page.locator('xpath=//div[contains(@class, "productinfo")]').getByRole('heading').nth(productPosition).textContent())?.substring(3))
        }
        return itemDetails
    }
    async checkProductInCart(items: { name: string, price: number }[]) {
        await expect(this.page
            .getByRole('row')).toHaveCount(items.length + 1)
        let i = 0
        for (const tr of await this.cartProduct.all()) {
            await expect(tr.locator('xpath=/td[@class="cart_description"]').filter({ hasText: items[i].name })).toBeVisible()
            await expect(tr.locator('xpath=/td[@class="cart_price"]').filter({ hasText: `${items[i].price}` })).toBeVisible()
            let count = Number(await tr.locator('xpath=/td[@class="cart_quantity"]').innerText())
            let totalPrice = Number((await tr.locator('xpath=/td[@class="cart_total"]').innerText()).substring(3))
            expect(totalPrice).toEqual(items[i].price * count)
            i++
        }

    }
}