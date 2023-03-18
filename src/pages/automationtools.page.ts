// playwright-dev-page.ts
import { expect, Locator, Page } from '@playwright/test';

interface signupCredentials {
    name: string,
    email: string,
}
interface loginCredentials {
    email: string,
    password: string,
    name?: string,
}
interface user {
    name: string,
    email: string,
    gender?: string,
    password: string,
    dateOfBirth?: Date,
    newsletter?: boolean,
    offers?: boolean,
    firstName: string,
    lastName: string,
    company?: string,
    address: string,
    address2?: string,
    country: string,
    state: string,
    city: string,
    zipcode: string,
    mobileNumber: number,
}
interface paymentData {
    cardName: string,
    cardNumber: number,
    cardCVC: number,
    cardExpirationMonth: number,
    cardExpirationYear: number
}
interface contactForm {
    name?: string
    email: string
    subject?: string
    message?: string
    file?: string
}
export class AutomationTools {
    readonly page: Page;
    readonly websocket: WebSocket;
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
        const response = await this.page.request.get('https://maps.google.com/maps-api-v3/api/js/52/5/util.js');
        await expect(response).toBeOK();
    }
    async deleteAccount(credentials: signupCredentials) {
        await expect(this.page.getByText(`Logged in as ${credentials.name}`, { exact: true })).toBeVisible()
        await this.selectTab('Delete Account')
        await expect(this.page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
        await this.useContinueButton()
    }
    async logout(credentials: signupCredentials) {
        await expect(this.page.getByText(`Logged in as ${credentials.name}`, { exact: true })).toBeVisible()
        await this.selectTab('Logout')
        await expect(this.page).toHaveURL('/login')
    }
    async signup(user: user) {
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
    async signupCredentials(credentials: signupCredentials) {
        await this.page.locator('xpath=//*[@data-qa="signup-name"]').fill(credentials.name)
        await this.page.locator('xpath=//*[@data-qa="signup-email"]').fill(credentials.email)
        await this.page.locator('xpath=//*[@data-qa="signup-button"]').click()
    }
    async fillSignupForm(user: user) {
        await expect(this.page.getByRole('heading', { name: 'ENTER ACCOUNT INFORMATION' })).toBeVisible()
        if (user.gender)
            await this.page.getByLabel(user.gender).check()
        await this.page.locator('xpath=//*[@data-qa="password"]').fill(user.password)
        if (user.dateOfBirth) {
            await this.page.locator('xpath=//*[@data-qa="days"]').selectOption(`${user.dateOfBirth.getDay()}`)
            await this.page.locator('xpath=//*[@data-qa="months"]').selectOption(`${user.dateOfBirth.toLocaleString("en-US", { month: "long" })}`)
            await this.page.locator('xpath=//*[@data-qa="years"]').selectOption(`${user.dateOfBirth.getFullYear()}`)
        }
        if (user.newsletter)
            await this.page.getByRole('checkbox', { name: 'newsletter' }).check()
        if (user.offers)
            await this.page.getByRole('checkbox', { name: 'offers' }).check()
        await this.page.locator('xpath=//*[@data-qa="first_name"]').fill(user.firstName)
        await this.page.locator('xpath=//*[@data-qa="last_name"]').fill(user.lastName)
        if (user.company)
            await this.page.locator('xpath=//*[@data-qa="company"]').fill(user.company)
        await this.page.locator('xpath=//*[@data-qa="address"]').fill(user.address)
        if (user.address2)
            await this.page.locator('xpath=//*[@data-qa="address2"]').fill(user.address2)
        if (user.country)
            await this.page.locator('xpath=//*[@data-qa="country"]').selectOption(user.country)
        await this.page.locator('xpath=//*[@data-qa="state"]').fill(user.state)
        await this.page.locator('xpath=//*[@data-qa="city"]').fill(user.city)
        await this.page.locator('xpath=//*[@data-qa="zipcode"]').fill(user.zipcode)
        await this.page.locator('xpath=//*[@data-qa="mobile_number"]').fill(`${user.mobileNumber}`)
        await this.page.locator('xpath=//*[@data-qa="create-account"]').click()
    }
    async login(credentials: loginCredentials) {
        await this.page.locator('xpath=//*[@data-qa="login-email"]').fill(`${credentials.email}`)
        await this.page.locator('xpath=//*[@data-qa="login-password"]').fill(`${credentials.password}`)
        await this.page.locator('xpath=//*[@data-qa="login-button"]').click()
    }
    async fillContactUsForm(contactForm: contactForm) {
        this.page.once('dialog', dialog => {
            dialog.accept();
        });

        if (contactForm.name)
            await this.page.locator('xpath=//*[@data-qa="name"]').fill(contactForm.name)
        await this.page.locator('xpath=//*[@data-qa="email"]').fill(contactForm.email)
        if (contactForm.subject)
            await this.page.locator('xpath=//*[@data-qa="subject"]').fill(contactForm.subject)
        if (contactForm.message)
            await this.page.locator('xpath=//*[@data-qa="message"]').fill(contactForm.message)
        if (contactForm.file)
            await this.page.locator('input[name="upload_file"]').setInputFiles(contactForm.file);
        this.page.locator('xpath=//*[@data-qa="submit-button"]').click()
    }
    async contactUsGoHome() {
        await expect(this.page.locator('xpath=//div[@class="contact-form"]').getByText('Success! Your details have been submitted successfully.')).toBeVisible()
        await this.page.locator('xpath=//div[@class="contact-form"]').getByRole('link', { name: 'Home' }).click();
        await expect(this.page).toHaveURL('/')
    }
    async viewProduct(productPosition: number) {
        let productDetails = this.page.locator('xpath=//div[@class="product-information"]')
        // const response = this.page.request.get('https://automationexercise.com/static/images/home/short_logo.png');
        // await expect(await response).toBeOK();
        await this.page.getByRole('link', { name: 'view product' }).nth(productPosition).click()
        const response = await this.page.request.get('https://automationexercise.com/static/js/cart.js');
        await expect(response).toBeOK();
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
        // await this.page.locator(`xpath=//div[contains(@class, "productinfo")]/a`).nth(productPosition).click()
        const itemDetails = {
            name: String(await this.page.locator('xpath=//div[contains(@class, "productinfo")]').getByRole('paragraph').nth(productPosition).textContent()),
            price: Number((await this.page.locator('xpath=//div[contains(@class, "productinfo")]').getByRole('heading').nth(productPosition).textContent())?.substring(3)),
            quantity: 1
        }
        return itemDetails
    }
    async addProductFromDetails(quantity: number) {
        await this.page.locator('xpath=//*[@id="quantity"]').fill(`${quantity}`)
        await this.page.getByRole('button', { name: 'Add to cart' }).click()
        await expect(this.page.getByRole('link', { name: 'View Cart' })).toBeVisible()
    }
    async continueShopping() {
        await this.page.getByRole('button', { name: 'Continue Shopping' }).click()
    }
    async viewCart() {
        await this.page.getByRole('link', { name: 'View Cart' }).click()
    }
    async checkProductsInCart(items: { name: string, price: number }[]) {
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
    async proceedToCheckout() {
        await this.page.getByText('Proceed To Checkout').click()
    }
    async placeOrder(user: user, item: { name: string, price: number, quantity: number }, description?: string) {
        let deliveryAddress = this.page.getByRole('list').filter({ hasText: 'delivery address' })
        if (user.gender)
            await expect(deliveryAddress).toContainText(user.gender)
        await expect(deliveryAddress).toContainText(user.firstName)
        await expect(deliveryAddress).toContainText(user.lastName)
        if (user.company)
            await expect(deliveryAddress).toContainText(user.company)
        await expect(deliveryAddress).toContainText(user.address)
        if (user.address2)
            await expect(deliveryAddress).toContainText(user.address2)
        await expect(deliveryAddress).toContainText(user.city)
        await expect(deliveryAddress).toContainText(user.state)
        await expect(deliveryAddress).toContainText(user.zipcode)
        await expect(deliveryAddress).toContainText(user.country)
        await expect(deliveryAddress).toContainText(`${user.mobileNumber}`)
        await expect(this.page
            .locator('xpath=//td[@class="cart_description"]'))
            .toContainText(`${item.name}`)
        await expect(this.page
            .locator('xpath=//td[@class="cart_price"]'))
            .toContainText(`${item.price}`)
        await expect(this.page
            .locator('xpath=//td[@class="cart_quantity"]'))
            .toContainText(`${item.quantity}`)
        await expect(this.page
            .locator('xpath=//td[@class="cart_total"]'))
            .toContainText(`${item.price * item.quantity}`)
        await expect(this.page
            .getByRole('row').last()
            .locator('xpath=//p[@class="cart_total_price"]'))
            .toContainText(`${item.price * item.quantity}`)
        if (description)
            await this.page
                .locator('#ordermsg')
                .getByRole('textbox').fill(description)
        await this.page.getByRole('link', { name: 'place order' }).click()
    }
    //----------------TO FIX!!!!!----------------------//
    async fillPayment(paymentData: paymentData) {
        await this.page.locator('xpath=//*[@data-qa="name-on-card"]').fill(paymentData.cardName)
        await this.page.locator('xpath=//*[@data-qa="card-number"]').fill(`${paymentData.cardNumber}`)
        await this.page.locator('xpath=//*[@data-qa="cvc"]').fill(`${paymentData.cardCVC}`)
        await this.page.locator('xpath=//*[@data-qa="expiry-month"]').fill(`${paymentData.cardExpirationMonth}`)
        await this.page.locator('xpath=//*[@data-qa="expiry-year"]').fill(`${paymentData.cardExpirationYear}`)
        await this.page.locator('xpath=//*[@data-qa="pay-button"]').click({ noWaitAfter: true })
        await expect(this.page.locator('xpath=//div[@id="success_message"]')).toBeVisible()
    }

    async completeOrder() {
        await expect(this.page.getByRole('heading', { name: 'Order placed' })).toBeVisible()
        await this.useContinueButton()
    }
    async signupFromCart() {
        await this.page.getByRole('link', { name: 'Register / Login' }).click()
        await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()
    }
    async resetBasket() {
        for (const tr of await this.page.locator('xpath=//tbody/tr').all()) {
            await tr.locator('xpath=/*[@class="cart_delete"]/a').click()
        }
        await expect(this.page.getByText('Cart is empty')).toBeVisible()
    }
    async expandCategory(category: string) {
        await this.page
            .locator(`xpath=//div[@id="${category}"]/preceding-sibling::div`)
            .getByRole('link', { name: category })
            .click()
        await expect(this.page.locator(`xpath=//div[@id="${category}"]`)).toBeVisible()
    }
    async selectSubCategory(category: string, subcategory: string) {
        await this.expandCategory(category)
        await this.page.locator(`xpath=//div[@id="${category}"]`).getByRole('link', { name: subcategory }).click()
        await expect(this.page.locator('xpath=//div[@class="features_items"]').getByRole('heading', { level: 2, name: `${category} - ${subcategory} PRODUCTS` }).first()).toBeVisible()
    }
}