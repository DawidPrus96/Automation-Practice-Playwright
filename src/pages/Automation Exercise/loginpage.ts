// playwright-dev-page.ts
import { expect, Page } from '@playwright/test';
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
export class LoginPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async signupCredentials(name: string, email: string) {
        await this.page.locator('signup-name').fill(name)
        await this.page.locator('signup-email').fill(email)
        await this.page.locator('signup-button').click()
    }
    async fillSignupForm(user: user) {
        await expect(this.page.getByRole('heading', { name: 'ENTER ACCOUNT INFORMATION' })).toBeVisible()
        if (user.gender)
            await this.page.getByLabel(user.gender).check()
        await this.page.locator('password').fill(user.password)
        if (user.dateOfBirth) {
            await this.page.locator('days').selectOption(`${user.dateOfBirth.getDay()}`)
            await this.page.locator('months').selectOption(`${user.dateOfBirth.toLocaleString("en-US", { month: "long" })}`)
            await this.page.locator('years').selectOption(`${user.dateOfBirth.getFullYear()}`)
        }
        if (user.newsletter)
            await this.page.getByRole('checkbox', { name: 'newsletter' }).check()
        if (user.offers)
            await this.page.getByRole('checkbox', { name: 'offers' }).check()
        await this.page.locator('first_name').fill(user.firstName)
        await this.page.locator('last_name').fill(user.lastName)
        if (user.company)
            await this.page.locator('company').fill(user.company)
        await this.page.locator('address').fill(user.address)
        if (user.address2)
            await this.page.locator('address2').fill(user.address2)
        if (user.country)
            await this.page.locator('country').selectOption(user.country)
        await this.page.locator('state').fill(user.state)
        await this.page.locator('city').fill(user.city)
        await this.page.locator('zipcode').fill(user.zipcode)
        await this.page.locator('mobile_number').fill(`${user.mobileNumber}`)
        await this.page.locator('create-account').click()
        await expect(this.page.getByRole('heading', { name: 'ACCOUNT CREATED!' })).toBeVisible()
        await this.page.getByTestId('continue-button').click()
        await expect(this.page.getByText(`Logged in as ${user.name}`, { exact: true })).toBeVisible()
    }
    async login(email: string, password: string) {
        await this.page.locator('login-email').fill(`${email}`)
        await this.page.locator('login-password').fill(`${password}`)
        await this.page.locator('login-button').click()
    }
}