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
interface review {
    name: string,
    email: string,
    message: string,
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
interface addressType {
    defaultAddressType: 'delivery' | 'billing'
}
export class AutomationTools {
    readonly page: Page;
    readonly websocket: WebSocket;
    // readonly getStartedLink: Locator;
    // readonly gettingStartedHeader: Locator;
    // readonly pomLink: Locator;
    // readonly tocList: Locator;
    constructor(page: Page) {
        this.page = page;
        // this.getStartedLink = page.locator('a', { hasText: 'Get started' });
        // this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
        // this.pomLink = page.locator('li', { hasText: 'Guides' }).locator('a', { hasText: 'Page Object Model' });
        // this.tocList = page.locator('article div.markdown ul > li > a');
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
        await expect(this.page.getByRole('heading', { name: 'BRANDS', level: 2 })).toBeVisible()
    }
    async gotoCartPage() {
        await this.selectTab('Cart')
        await expect(this.page).toHaveURL('/view_cart')
        const response = await this.page.request.get('https://maps.google.com/maps-api-v3/api/js/52/5/util.js');
        await expect(response).toBeOK();
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
            await this.gotoLoginPage()
            await this.signupCredentials(user)
        }
        await this.fillSignupForm(user)
        await expect(this.page.getByRole('heading', { name: 'ACCOUNT CREATED!' })).toBeVisible()
        await this.useContinueButton()
        await expect(this.page.getByText(`Logged in as ${user.name}`, { exact: true })).toBeVisible()
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
        let contactForm = this.page.locator('#contact-page')
        await expect(contactForm.getByText('Success! Your details have been submitted successfully.')).toBeVisible()
        await contactForm.getByRole('link', { name: 'Home' }).click();
        await expect(this.page).toHaveURL('/')
    }
    async viewProduct(productPosition: number) {
        let productDetails = this.page.locator('.product-information')
        // const response = this.page.request.get('https://automationexercise.com/static/images/home/short_logo.png');
        // await expect(await response).toBeOK();
        await this.page.getByRole('link', { name: 'view product' }).nth(productPosition - 1).click()
        const response = await this.page.request.get('https://automationexercise.com/static/js/cart.js');
        await expect(response).toBeOK();
        await expect(this.page).toHaveURL(/.*product_details/)
        await expect(this.page.getByRole('link', { name: 'WRITE YOUR REVIEW' })).toBeVisible()
        await expect(productDetails.getByRole('heading')).toBeVisible()
        await expect(productDetails.getByText('Category')).toBeVisible()
        await expect(productDetails.getByText('Rs. ')).toBeVisible()
        await expect(productDetails.getByText('Availability: ')).toBeVisible()
        await expect(productDetails.getByText('Condition: ')).toBeVisible()
        await expect(productDetails.getByText('Brand: ')).toBeVisible()
    }
    async searchForProduct(productName: string) {
        let allProductsOnList = this.page.locator('.productinfo > p')
        await this.page.locator('#search_product').fill(productName);
        await this.page.locator('#submit_search').click()
        await expect(this.page.getByRole('heading', { name: 'SEARCHED PRODUCTS', level: 2 })).toBeVisible()
        expect(await allProductsOnList.count()).toEqual(await allProductsOnList.getByText(productName).count())
        return allProductsOnList.count()
    }
    async subscribe(email: string) {
        await expect(this.page.getByRole('heading', { name: 'SUBSCRIPTION', level: 2 })).toBeVisible()
        await this.page.locator('#susbscribe_email').fill(email)
        await this.page.locator('#subscribe').click()
        await expect(this.page.locator('#success-subscribe')).toBeVisible()
    }
    async addProductFromList(productPosition: number) {
        const itemDetails = {
            name: String(await this.page.locator('.productinfo > p').nth(productPosition - 1).textContent()),
            price: Number((await this.page.locator('.productinfo > h2').nth(productPosition - 1).textContent())?.substring(3)),
            quantity: 1
        }
        await this.page.locator('.productinfo > .add-to-cart').nth(productPosition - 1).click()
        await expect(this.page.getByRole('link', { name: 'View Cart' })).toBeVisible()
        await expect(this.page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible()
        return itemDetails
    }
    async addProductFromRecommended(productPosition: number) {
        let carouselItem = this.page.locator('#recommended-item-carousel .item.active')
        const itemPosition = productPosition - 1
        await expect(this.page.getByRole('heading', { name: 'recommended items' })).toBeVisible()
        const itemDetails = {
            name: String(await carouselItem.locator('p').nth(itemPosition).textContent()),
            price: Number((await carouselItem.locator('h2').nth(itemPosition).textContent())?.substring(3)),
            quantity: 1
        }
        await carouselItem.locator('.add-to-cart').nth(itemPosition).click()
        return itemDetails

    }
    async addProductFromDetails(quantity: number) {
        await this.page.locator('#quantity').fill(`${quantity}`)
        await this.page.getByRole('button', { name: 'Add to cart' }).click()
        await expect(this.page.getByRole('link', { name: 'View Cart' })).toBeVisible()
        await expect(this.page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible()
    }

    async continueShopping() {
        await this.page.getByRole('button', { name: 'Continue Shopping' }).click()
    }
    async viewCart() {
        await this.page.getByRole('link', { name: 'View Cart' }).click()
    }

    async checkProductsInCart(items: { name: string, price: number, quantity: number }[]) {
        let i = 0
        let cartProducts = this.page.locator('tbody > tr[id]')
        await expect(cartProducts).toHaveCount(items.length)
        for (const cartProduct of await cartProducts.all()) {
            let cartProductDescription = cartProduct.locator('.cart_description').getByRole('heading')
            let cartProductPrice = Number((await cartProduct.locator('.cart_price').innerText()).substring(3))
            let cartProductQuantity = Number(await cartProduct.locator('.cart_quantity').innerText())
            let cartProductTotalPrice = Number((await cartProduct.locator('.cart_total').innerText()).substring(3))
            await expect(cartProductDescription).toHaveText(items[i].name)
            expect(cartProductPrice).toEqual(items[i].price)
            expect(cartProductQuantity).toEqual(items[i].quantity)
            expect(cartProductTotalPrice).toEqual(items[i].price * items[i].quantity)
            i++
        }
    }
    async proceedToCheckout() {
        await this.page.locator('.check_out').click()
    }
    async checkAddress(addressType: Locator, user: user) {
        if (user.gender)
            await expect(addressType.locator('.address_firstname.address_lastname')).toContainText(`${user.gender}`)
        await expect(addressType.locator('.address_firstname.address_lastname')).toContainText(`${user.firstName} ${user.lastName}`)
        if (user.company)
            await expect(addressType.locator('.address_address1.address_address2').nth(0)).toContainText(user.company)
        await expect(addressType.locator('.address_address1.address_address2').nth(1)).toContainText(user.address)
        if (user.address2)
            await expect(addressType.locator('.address_address1.address_address2').nth(2)).toContainText(user.address2)
        await expect(addressType.locator('.address_city.address_state_name.address_postcode')).toContainText(`${user.city} ${user.state} ${user.zipcode}`)
        await expect(addressType.locator('.address_country_name')).toContainText(user.country)
        await expect(addressType.locator('.address_phone')).toContainText(`${user.mobileNumber}`)
    }
    async checkOrder(user: user, item: { name: string, price: number, quantity: number }[], description?: string) {
        let deliveryAddress = this.page.locator('#address_delivery')
        let billingAddress = this.page.locator('#address_invoice')
        await expect(deliveryAddress.getByRole('heading', { name: 'YOUR DELIVERY ADDRESS' })).toBeVisible()
        await expect(billingAddress.getByRole('heading', { name: 'YOUR BILLING ADDRESS' })).toBeVisible()
        this.checkAddress(deliveryAddress, user)
        this.checkAddress(billingAddress, user)
        await this.checkProductsInCart(item)
        if (description)
            await this.page.locator('textarea[name=message]').fill(description)
    }
    async placeOrder() {
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
        await expect(this.page.locator('#success_message')).toBeVisible()
    }

    async completeOrder() {
        await expect(this.page.getByRole('heading', { name: 'Order placed' })).toBeVisible()
        await this.useContinueButton()
    }
    async signupFromCart() {
        await this.page.getByRole('link', { name: 'Register / Login' }).click()
        await expect(this.page).toHaveURL('/login')
    }
    async resetBasket() {
        let cartProducts = this.page.locator('tbody > tr[id]')
        for (const cartProduct of await cartProducts.all()) {
            await cartProduct.locator('.cart_quantity_delete').click()
        }
        await expect(this.page.locator('#empty_cart')).toBeVisible()
    }
    async expandCategory(category: string) {
        await this.page.locator(`[href="#${category}"]`).click()
        await expect(this.page.locator(`#${category}`)).toBeVisible()
    }
    async selectSubCategory(category: string, subcategory: string) {
        await this.expandCategory(category)
        await this.page.locator(`#${category}`).getByRole('link', { name: subcategory }).click()
        await expect(this.page.locator('.features_items').getByRole('heading', { level: 2, name: `${category} - ${subcategory} PRODUCTS` }).first()).toBeVisible()
    }
    async selectBrand(brand: string) {
        await this.page.locator('.brands-name').getByRole('link', { name: brand }).click()
        await expect(this.page.locator('.features_items').getByRole('heading', { level: 2, name: `BRAND - ${brand} PRODUCTS` }).first()).toBeVisible()
    }
    async addEveryProductFromList(productName: string) {
        const items: { name: string, price: number, quantity: number }[] = []
        let productCount = await this.searchForProduct(productName)
        for (let i = 0; i < productCount; i++) {
            items.push(await this.addProductFromList(i))
            await this.continueShopping()
        }
        return items
    }
    async addReview(review: review) {
        await this.page.locator('#name').fill(review.name)
        await this.page.locator('#email').fill(review.email)
        await this.page.locator('#review').fill(review.message)
        await this.page.locator('#button-review').click()
        await expect(this.page.getByText('Thank you for your review.')).toBeVisible()
    }
}