// playwright-dev-page.ts
import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly navbar: Locator
    readonly tab: (tabName: string) => Locator
    constructor(page: Page) {
        this.page = page;
        this.navbar = page.locator('.navbar-nav')
        this.tab = (tabname) => this.navbar.getByRole('link', { name: tabname })
    }
    async gotoHomePage() {
        await this.tab('Home').click()
        await expect(this.page).toHaveURL('/')
        await expect(this.page.locator('#slider-carousel')).toBeVisible()
    }
    async gotoProductsPage() {
        await this.tab('Products').click()
        await expect(this.page).toHaveURL('/products')
        await expect(this.page.getByRole('heading', { name: 'ALL PRODUCTS', level: 2 })).toBeVisible()
        await expect(this.page.getByRole('heading', { name: 'BRANDS', level: 2 })).toBeVisible()
    }
    async gotoCartPage() {
        await this.tab('Cart').click()
        await expect(this.page).toHaveURL('/view_cart')
        await expect(this.page.locator('#cart_info')).toBeVisible()
    }
    async gotoLoginPage() {
        await this.tab('Signup / Login').click()
        await expect(this.page).toHaveURL('/login')
        await expect(this.page.getByRole('heading', { name: 'New User Signup!', level: 2 })).toBeVisible()
        await expect(this.page.getByRole('heading', { name: 'Login to your account', level: 2 })).toBeVisible()
    }
    async gotoTestCasesPage() {
        await this.tab('Test Cases').click()
        await expect(this.page).toHaveURL('/test_cases')
        await expect(this.page.getByRole('heading', { name: 'TEST CASES', level: 2 })).toBeVisible()
    }
    async gotoApiTestingPage() {
        await this.tab('API Testing').click()
        await expect(this.page).toHaveURL('/api_list')
        await expect(this.page.getByRole('heading', { name: 'APIS LIST FOR PRACTICE', level: 2 })).toBeVisible()
    }
    async gotoContactUsPage() {
        await this.tab('Contact us').click()
        await expect(this.page).toHaveURL('/contact_us')
        await expect(this.page.getByRole('heading', { name: 'GET IN TOUCH', level: 2 })).toBeVisible()
    }
    async isLogged() {
        return await this.page.getByText('Logged in as').isVisible()
    }
    async deleteAccount() {
        expect(await this.isLogged()).toBeTruthy()
        await this.tab('Delete Account').click()
        await expect(this.page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
        await this.page.getByTestId('continue-button').click()
        await expect(this.page).toHaveURL('/')
        expect(await this.isLogged()).not.toBeTruthy()
    }
    async logout() {
        expect(await this.isLogged()).toBeTruthy()
        await this.tab('Logout').click()
        await expect(this.page).toHaveURL('/login')
        expect(await this.isLogged()).not.toBeTruthy()
    }
    //     async fillContactUsForm(contactForm: contactForm) {
    //         this.page.once('dialog', dialog => {
    //             dialog.accept();
    //         });
    //         if (contactForm.name)
    //             await this.page.locator('xpath=//*[@data-qa="name"]').type(contactForm.name, { delay: 50 })
    //         await this.page.locator('xpath=//*[@data-qa="email"]').type(contactForm.email, { delay: 50 })
    //         if (contactForm.subject)
    //             await this.page.locator('xpath=//*[@data-qa="subject"]').type(contactForm.subject, { delay: 50 })
    //         if (contactForm.message)
    //             await this.page.locator('xpath=//*[@data-qa="message"]').type(contactForm.message, { delay: 50 })
    //         if (contactForm.file)
    //             await this.page.locator('input[name="upload_file"]').setInputFiles(contactForm.file);
    //         this.page.locator('xpath=//*[@data-qa="submit-button"]').click()
    //     }
    //     async contactUsGoHome() {
    //         let contactForm = this.page.locator('#contact-page')
    //         await expect(contactForm.getByText('Success! Your details have been submitted successfully.')).toBeVisible()
    //         await contactForm.getByRole('link', { name: 'Home' }).click();
    //         await expect(this.page).toHaveURL('/')
    //     }
    //     async viewProduct(productPosition: number) {
    //         let productDetails = this.page.locator('.product-information')
    //         // const response = this.page.request.get('https://automationexercise.com/static/images/home/short_logo.png');
    //         // await expect(await response).toBeOK();
    //         await this.page.getByRole('link', { name: 'view product' }).nth(productPosition).click()
    //         const response = await this.page.request.get('https://automationexercise.com/static/js/cart.js');
    //         await expect(response).toBeOK();
    //         await expect(this.page).toHaveURL(/.*product_details/)
    //         await expect(this.page.getByRole('link', { name: 'WRITE YOUR REVIEW' })).toBeVisible()
    //         await expect(productDetails.getByRole('heading')).toBeVisible()
    //         await expect(productDetails.getByText('Category')).toBeVisible()
    //         await expect(productDetails.getByText('Rs. ')).toBeVisible()
    //         await expect(productDetails.getByText('Availability: ')).toBeVisible()
    //         await expect(productDetails.getByText('Condition: ')).toBeVisible()
    //         await expect(productDetails.getByText('Brand: ')).toBeVisible()
    //     }
    //     async searchForProduct(productName: string) {
    //         let allProductsOnList = this.page.locator('.productinfo > p')
    //         await this.page.locator('#search_product').fill(productName);
    //         await this.page.locator('#submit_search').click()
    //         await expect(this.page.getByRole('heading', { name: 'SEARCHED PRODUCTS', level: 2 })).toBeVisible()
    //         expect(await allProductsOnList.count()).toEqual(await allProductsOnList.getByText(productName).count())
    //         return allProductsOnList.count()
    //     }
    async subscribe(email: string) {
        await expect(this.page.getByRole('heading', { name: 'SUBSCRIPTION', level: 2 })).toBeVisible()
        await this.page.locator('#susbscribe_email').fill(email)
        await this.page.locator('#subscribe').click()
        await expect(this.page.locator('#success-subscribe')).toBeVisible()
    }
    //     async addProductFromList(productPosition: number) {
    //         await expect(this.page.locator('.productinfo > img').nth(productPosition)).toBeVisible()
    //         const itemDetails = {
    //             name: String(await this.page.locator('.productinfo > p').nth(productPosition).textContent()),
    //             price: Number((await this.page.locator('.productinfo > h2').nth(productPosition).textContent())?.substring(3)),
    //             quantity: 1
    //         }
    //         await this.page.locator('.productinfo > .add-to-cart').nth(productPosition).click()
    //         await expect(this.page.getByRole('link', { name: 'View Cart' })).toBeVisible()
    //         await expect(this.page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible()
    //         return itemDetails
    //     }
    //     async addProductFromRecommended(productPosition: number) {
    //         let carouselItem = this.page.locator('#recommended-item-carousel .item.active')
    //         const itemPosition = productPosition
    //         await expect(this.page.getByRole('heading', { name: 'recommended items' })).toBeVisible()
    //         const itemDetails = {
    //             name: String(await carouselItem.locator('p').nth(itemPosition).textContent()),
    //             price: Number((await carouselItem.locator('h2').nth(itemPosition).textContent())?.substring(3)),
    //             quantity: 1
    //         }
    //         await carouselItem.locator('.add-to-cart').nth(itemPosition).click()
    //         return itemDetails

    //     }
    //     async addProductFromDetails(quantity: number) {
    //         await this.page.locator('#quantity').fill(`${quantity}`)
    //         await this.page.getByRole('button', { name: 'Add to cart' }).click()
    //         await expect(this.page.getByRole('link', { name: 'View Cart' })).toBeVisible()
    //         await expect(this.page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible()
    //     }

    //     async continueShopping() {
    //         await this.page.getByRole('button', { name: 'Continue Shopping' }).click()
    //     }
    //     async viewCart() {
    //         await this.page.getByRole('link', { name: 'View Cart' }).click()
    //     }

    //     async checkProductsInCart(items: { name: string, price: number, quantity: number }[]) {
    //         let i = 0
    //         let cartProducts = this.page.locator('tbody > tr[id]')
    //         await expect(cartProducts).toHaveCount(items.length)
    //         for (const cartProduct of await cartProducts.all()) {
    //             let cartProductDescription = cartProduct.locator('.cart_description').getByRole('heading')
    //             let cartProductPrice = Number((await cartProduct.locator('.cart_price').innerText()).substring(3))
    //             let cartProductQuantity = Number(await cartProduct.locator('.cart_quantity').innerText())
    //             let cartProductTotalPrice = Number((await cartProduct.locator('.cart_total').innerText()).substring(3))
    //             await expect(cartProductDescription).toHaveText(items[i].name)
    //             expect(cartProductPrice).toEqual(items[i].price)
    //             expect(cartProductQuantity).toEqual(items[i].quantity)
    //             expect(cartProductTotalPrice).toEqual(items[i].price * items[i].quantity)
    //             i++
    //         }
    //     }
    //     async proceedToCheckoutLogged() {
    //         await this.page.locator('.check_out').click()
    //         await expect(this.page.getByRole('heading', { name: 'YOUR DELIVERY ADDRESS' })).toBeVisible()
    //         await expect(this.page.getByRole('heading', { name: 'YOUR BILLING ADDRESS' })).toBeVisible()
    //     }
    //     async proceedToCheckoutNotLogged() {
    //         await this.page.locator('.check_out').click()
    //         await expect(this.page.getByRole('link', { name: 'Register / Login' })).toBeVisible()
    //     }
    //     async checkAddress(addressType: Locator, user: user) {
    //         if (user.gender)
    //             await expect(addressType.locator('.address_firstname.address_lastname')).toContainText(`${user.gender}`)
    //         await expect(addressType.locator('.address_firstname.address_lastname')).toContainText(`${user.firstName} ${user.lastName}`)
    //         if (user.company)
    //             await expect(addressType.locator('.address_address1.address_address2').nth(0)).toContainText(user.company)
    //         await expect(addressType.locator('.address_address1.address_address2').nth(1)).toContainText(user.address)
    //         if (user.address2)
    //             await expect(addressType.locator('.address_address1.address_address2').nth(2)).toContainText(user.address2)
    //         await expect(addressType.locator('.address_city.address_state_name.address_postcode')).toContainText(`${user.city} ${user.state} ${user.zipcode}`)
    //         await expect(addressType.locator('.address_country_name')).toContainText(user.country)
    //         await expect(addressType.locator('.address_phone')).toContainText(`${user.mobileNumber}`)
    //     }
    //     async checkOrder(user: user, item: { name: string, price: number, quantity: number }[], description?: string) {
    //         let deliveryAddress = this.page.locator('#address_delivery')
    //         let billingAddress = this.page.locator('#address_invoice')
    //         await expect(deliveryAddress.getByRole('heading', { name: 'YOUR DELIVERY ADDRESS' })).toBeVisible()
    //         await expect(billingAddress.getByRole('heading', { name: 'YOUR BILLING ADDRESS' })).toBeVisible()
    //         this.checkAddress(deliveryAddress, user)
    //         this.checkAddress(billingAddress, user)
    //         await this.checkProductsInCart(item)
    //         if (description)
    //             await this.page.locator('textarea[name=message]').fill(description)
    //     }
    //     async placeOrder() {
    //         await this.page.getByRole('link', { name: 'place order' }).click()
    //     }
    //     //----------------TO FIX!!!!!----------------------//
    //     async fillPayment(paymentData: paymentData) {
    //         await this.page.locator('xpath=//*[@data-qa="name-on-card"]').fill(paymentData.cardName)
    //         await this.page.locator('xpath=//*[@data-qa="card-number"]').fill(`${paymentData.cardNumber}`)
    //         await this.page.locator('xpath=//*[@data-qa="cvc"]').fill(`${paymentData.cardCVC}`)
    //         await this.page.locator('xpath=//*[@data-qa="expiry-month"]').fill(`${paymentData.cardExpirationMonth}`)
    //         await this.page.locator('xpath=//*[@data-qa="expiry-year"]').fill(`${paymentData.cardExpirationYear}`)
    //         await this.page.locator('xpath=//*[@data-qa="pay-button"]').click({ noWaitAfter: true })
    //         await expect(this.page.getByText('Your order has been placed successfully!')).toBeVisible()
    //         await expect(this.page.getByRole('heading', { name: 'Order placed' })).toBeVisible()
    //     }
    //     async downloadInvoice() {
    //         const downloadPromise = this.page.waitForEvent('download');
    //         await this.page.getByRole('link', { name: 'Download Invoice' }).click()
    //         const download = await downloadPromise;
    //         // Save downloaded file somewhere
    //         await download.saveAs('../downloads/invoice.txt');
    //     }
    //     async signupFromCart() {
    //         await this.page.getByRole('link', { name: 'Register / Login' }).click()
    //         await expect(this.page).toHaveURL('/login')
    //     }
    //     async resetBasket() {
    //         try {
    //             await expect(this.page.locator('#empty_cart')).toBeVisible({ timeout: 5 * 1000 })
    //         }
    //         catch {
    //             const cartProducts = this.page.locator('tr[id]')
    //             while (await cartProducts.count()) {
    //                 await this.page.locator('tr[id] > td.cart_delete > a').first().click()
    //                 await expect(cartProducts).toHaveCount(await cartProducts.count() - 1)
    //             }
    //             await expect(this.page.locator('#empty_cart')).toBeVisible()
    //         }
    //     }
    //     async expandCategory(category: string) {
    //         await this.page.locator(`[href="#${category}"]`).click()
    //         await expect(this.page.locator(`#${category}`)).toBeVisible()
    //     }
    //     async selectSubCategory(category: string, subcategory: string) {
    //         await this.expandCategory(category)
    //         await this.page.locator(`#${category}`).getByRole('link', { name: subcategory }).click()
    //         await expect(this.page.locator('.features_items').getByRole('heading', { level: 2, name: `${category} - ${subcategory} PRODUCTS` }).first()).toBeVisible()
    //     }
    //     async selectBrand(brand: string) {
    //         await this.page.locator('.brands-name').getByRole('link', { name: brand }).click()
    //         await expect(this.page.locator('.features_items').getByRole('heading', { level: 2, name: `BRAND - ${brand} PRODUCTS` }).first()).toBeVisible()
    //     }
    //     async addEveryProductFromList(productName: string) {
    //         const items: { name: string, price: number, quantity: number }[] = []
    //         let productCount = await this.searchForProduct(productName)
    //         for (let i = 0; i < productCount; i++) {
    //             items.push(await this.addProductFromList(i))
    //             await this.continueShopping()
    //         }
    //         return items
    //     }
    //     async addReview(review: review) {
    //         await this.page.locator('#name').fill(review.name)
    //         await this.page.locator('#email').fill(review.email)
    //         await this.page.locator('#review').fill(review.message)
    //         await this.page.locator('#button-review').click()
    //         await expect(this.page.getByText('Thank you for your review.')).toBeVisible()
    //     }
}