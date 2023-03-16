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

    async selectTab(tabName: string) {
        await this.page.getByRole('banner')
            .getByRole('link', { name: tabName }).click()
    }
    async gotoHomePage() {
        await this.selectTab('Home')
        await expect(this.page).toHaveURL('/')
        await expect(this.page.locator('#slider-carousel')).toBeVisible()
    }
    async gotoProductsPage() {
        await this.selectTab('Products')
        await expect(this.page).toHaveURL('/products')
        await expect(this.page.getByRole('heading', { name: 'ALL PRODUCTS', level: 2 })).toBeVisible()
    }
    async gotoCartPage() {
        await this.selectTab('Cart')
        await expect(this.page).toHaveURL('/view_cart')
    }
    async gotoLoginPage() {
        await this.selectTab('Signup / Login')
        await expect(this.page).toHaveURL('/login')
        await expect(this.page.getByRole('heading', { name: 'New User Signup!', level: 2 })).toBeVisible()
        await expect(this.page.getByRole('heading', { name: 'Login to your account', level: 2 })).toBeVisible()
    }
    async gotoTestCasesPage() {
        await this.selectTab('Test Cases')
        await expect(this.page).toHaveURL('/test_cases')
        await expect(this.page.getByRole('heading', { name: 'TEST CASES', level: 2 })).toBeVisible()
    }
    async gotoApiTestingPage() {
        await this.selectTab('API Testing')
        await expect(this.page).toHaveURL('/api_list')
        await expect(this.page.getByRole('heading', { name: 'APIS LIST FOR PRACTICE', level: 2 })).toBeVisible()
    }
    async gotoContactUsPage() {
        await this.selectTab('Contact us')
        await expect(this.page).toHaveURL('/contact_us')
        await expect(this.page.getByRole('heading', { name: 'GET IN TOUCH', level: 2 })).toBeVisible()
    }
    async deleteAccount(user: any) {
        await expect(this.page.getByText(`Logged in as ${user.name}`, { exact: true })).toBeVisible()
        await this.selectTab('Delete Account')
        await expect(this.page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
        await this.useContinueButton()
    }
    async logout(user: any) {
        await expect(this.page.getByText(`Logged in as ${user.name}`, { exact: true })).toBeVisible()
        await this.selectTab('Logout')
        await expect(this.page).toHaveURL('/login')
    }
    async signup(user: any) {
        await this.signupCredentials(user)
        let IsExistingAccount = await this.page.getByText('Email Address already exist!').isVisible()
        if (IsExistingAccount) {
            await this.login(user)
            await this.deleteAccount(user)
            await this.selectTab('login');
            await this.signupCredentials(user)
        }
        await this.fillSignupForm(user)
        await expect(this.page.getByRole('heading', { name: 'ACCOUNT CREATED!' })).toBeVisible()
        await this.useContinueButton()
    }
    async useContinueButton() {
        await this.page.locator('xpath=//*[@data-qa="continue-button"]').click()
        await expect(this.page).toHaveURL('/')
    }
    async signupCredentials(user: any) {
        await this.page.locator('xpath=//*[@data-qa="signup-name"]').fill(user.name)
        await this.page.locator('xpath=//*[@data-qa="signup-email"]').fill(user.email)
        await this.page.locator('xpath=//*[@data-qa="signup-button"]').click()
    }
    async fillSignupForm(user: any) {
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
    }
    async login(user: any) {
        await this.page.locator('xpath=//*[@data-qa="login-email"]').fill(user.email)
        await this.page.locator('xpath=//*[@data-qa="login-password"]').fill(user.password)
        await this.page.locator('xpath=//*[@data-qa="login-button"]').click()
    }
    // async getStarted() {
    //     await this.getStartedLink.first().click();
    //     await expect(this.gettingStartedHeader).toBeVisible();
    // }

    // async pageObjectModel() {
    //     await this.getStarted();
    //     await this.pomLink.click();
    // }
    async fillContactUsForm(user: any) {
        const response = this.page.request.get('https://maps.google.com/maps-api-v3/api/js/52/5/intl/pl_ALL/common.js');
        await expect(await response).toBeOK();
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
    async viewProduct(productPosition: number) {
        let productDetails = this.page.locator('xpath=//div[@class="product-information"]')
        await this.page.getByRole('link', { name: 'view product' }).nth(productPosition).click()
        await expect(this.page).toHaveURL(/\/product_details\//)
        await expect(productDetails.getByRole('heading')).toBeVisible()
        await expect(productDetails.getByText('Category')).toBeVisible()
        await expect(productDetails.getByText('Rs. ')).toBeVisible()
        await expect(productDetails.getByText('Availability: ')).toBeVisible()
        await expect(productDetails.getByText('Condition: ')).toBeVisible()
        await expect(productDetails.getByText('Brand: ')).toBeVisible()
    }
    async searchForProduct(productName: string) {
        let allSearchedProducts = this.page.locator(`xpath=//div[starts-with(@class, "productinfo")]/p`).count()
        let correctSearchedProducts = this.page.locator(`xpath=//div[starts-with(@class, "productinfo")]/p[contains(text(),${new RegExp(productName, "i")})]`).count()
        await this.page.getByPlaceholder('Search Product').fill(productName);
        await this.page.locator('xpath=//button[@id="submit_search"]').click()
        expect(await allSearchedProducts).toEqual(await correctSearchedProducts)
    }
    async subscribe(email: string) {
        await expect(this.footer.getByRole('heading', { name: 'Subscription' })).toBeVisible()
        await this.footer.getByRole('textbox').fill(email)
        await this.footer.getByRole('button').click()
        await expect(this.footer.getByText('You have been successfully subscribed!')).toBeVisible()
    }
    async addProductFromList(productPosition: number) {
        await this.page.locator('xpath=//div[contains(@class, "productinfo")]/a[contains(text(), "Add to cart")]').nth(productPosition).hover()
        await this.page.locator('xpath=//div[contains(@class, "overlay-content")]/a[contains(text(), "Add to cart")]').nth(productPosition).click()
        const itemDetails = {
            name: String(await this.page.locator('xpath=//div[contains(@class, "productinfo")]').getByRole('paragraph').nth(productPosition).textContent()),
            price: Number((await this.page.locator('xpath=//div[contains(@class, "productinfo")]').getByRole('heading').nth(productPosition).textContent())?.substring(3)),
        }
        return itemDetails
    }
    async continueShopping() {
        await this.page.getByRole('button', { name: 'Continue Shopping' }).click()
    }
    async viewCart() {
        await this.page.getByRole('link', { name: 'View Cart' }).click()
    }
    async checkProductInCart(items: { name: string, price: number }[]) {
        let i = 0
        await expect(this.page
            .getByRole('row')).toHaveCount(items.length + 1)
        for (const tr of await this.cartProduct.all()) {
            await expect(tr.locator('xpath=/td[@class="cart_description"]').filter({ hasText: items[i].name })).toBeVisible()
            await expect(tr.locator('xpath=/td[@class="cart_price"]').filter({ hasText: `${items[i].price}` })).toBeVisible()
            let count = Number(await tr.locator('xpath=/td[@class="cart_quantity"]').innerText())
            let totalPrice = Number((await tr.locator('xpath=/td[@class="cart_total"]').innerText()).substring(3))
            expect(totalPrice).toEqual(items[i].price * count)
            i++
        }
    }
    async addProductFromDetails(quantity: number) {
        await this.page.locator('xpath=//*[@id="quantity"]').fill(`${quantity}`)
        await this.page.getByRole('button', { name: 'Add to cart' }).click()
    }
    async viewCartFromDetails(quantity: number) {
        await this.page.getByRole('link', { name: 'View Cart' }).click()
    }
    async proceedToCheckout() {
        await this.page.getByText('Proceed To Checkout').click()
    }
    async placeOrder(user: any, item: { name: string, price: number }) {
        let itemQuantity = 1
        await expect(this.page.getByRole('list').filter({ hasText: 'delivery address' })).toContainText(
            user.gender &&
            user.firstName &&
            user.lastName &&
            user.company &&
            user.address &&
            user.address2 &&
            user.city &&
            user.state &&
            user.zipcode &&
            user.country &&
            `${user.mobileNumber}`
        )
        await expect(this.page
            .locator('xpath=//td[@class="cart_description"]'))
            .toContainText(`${item.name}`)
        await expect(this.page
            .locator('xpath=//td[@class="cart_price"]'))
            .toContainText(`${item.price}`)
        await expect(this.page
            .locator('xpath=//td[@class="cart_quantity"]'))
            .toContainText(`${itemQuantity}`)
        await expect(this.page
            .locator('xpath=//td[@class="cart_total"]'))
            .toContainText(`${item.price * itemQuantity}`)
        await expect(this.page
            .getByRole('row').last()
            .locator('xpath=//p[@class="cart_total_price"]'))
            .toContainText(`${item.price * itemQuantity}`)
        await this.page.getByRole('textbox').first().fill(user.description)
        await this.page.getByRole('link', { name: 'place order' }).click()
    }
    async fillPayment(paymentData: any) {
        await this.page.locator('xpath=//*[@data-qa="name-on-card"]').fill(paymentData.cardName)
        await this.page.locator('xpath=//*[@data-qa="card-number"]').fill(paymentData.cardName)
        await this.page.locator('xpath=//*[@data-qa="cvc"]').fill(paymentData.cardName)
        await this.page.locator('xpath=//*[@data-qa="expiry-month"]').fill(paymentData.cardName)
        await this.page.locator('xpath=//*[@data-qa="expiry-year"]').fill(paymentData.cardName)
        await this.page.locator('xpath=//*[@data-qa="pay-button"]').click({ noWaitAfter: true })
    }
    async completeOrder() {
        await expect(this.page.locator('xpath=//div[@id="success_message"]')).toBeVisible()
        await expect(this.page.getByRole('heading', { name: 'Order placed' })).toBeVisible()
        await this.useContinueButton()
    }
}