// playwright-dev-page.ts
import { expect, APIRequestContext } from '@playwright/test';
interface loginCredentials {
    email: string,
    password: string,
    name?: string,
}
interface user {
    name: string,
    email: string,
    password: string,
    title: string,
    dateOfBirth: Date,
    firstname: string,
    lastname: string,
    company: string,
    address1: string,
    address2: string,
    country: string,
    zipcode: string,
    state: string,
    city: string,
    mobile_number: number,
}
export class AutomationTools {
    readonly request: APIRequestContext;
    constructor(request: APIRequestContext) {
        this.request = request
    }
    async getAllProducts() {
        const response = await this.request.get('./productsList');
        expect(response.status()).toEqual(200)
        let responseJSON = await response.json()
        expect(responseJSON.responseCode).toEqual(200)
        expect(responseJSON.products.length).toBeTruthy()
    }
    async postProduct() {
        const response = await this.request.post('./productsList');
        expect(response.status()).toEqual(200)
        let responseJSON = await response.json()
        expect(responseJSON.responseCode).toEqual(405)
        expect(responseJSON.message).toBe('This request method is not supported.')
    }
    async getAllBrands() {
        const response = await this.request.get('./brandsList');
        expect(response.status()).toEqual(200)
        let responseJSON = await response.json()
        expect(responseJSON.responseCode).toEqual(200)
        expect(responseJSON.brands.length).toBeTruthy()
    }
    async putBrand() {
        const response = await this.request.put('./brandsList');
        expect(response.status()).toEqual(200)
        let responseJSON = await response.json()
        expect(responseJSON.responseCode).toEqual(405)
        expect(responseJSON.message).toBe('This request method is not supported.')
    }
    async postSearchProduct(productName: string) {
        const response = await this.request.post('./searchProduct', {
            form: {
                search_product: productName
            }
        });
        expect(response.status()).toEqual(200)
        let responseJSON = await response.json()
        expect(responseJSON.responseCode).toEqual(200)
        expect(responseJSON.products.length).toBeTruthy()
    }
    async postSearchProductWithoutParameter() {
        const response = await this.request.post('./searchProduct');
        expect(response.status()).toEqual(200)
        let responseJSON = await response.json()
        expect(responseJSON.responseCode).toEqual(400)
        expect(responseJSON.message).toBe('Bad request, search_product parameter is missing in POST request.')
    }
    async postLogin(credentials: loginCredentials) {
        const response = await this.request.post('./verifyLogin', {
            form: {
                email: credentials.email,
                password: credentials.password
            }
        });
        return await response.json()
    }
    async postLoginWithoutParameter(credentials: loginCredentials) {
        const response = await this.request.post('./verifyLogin', {
            form: {
                password: credentials.password
            }
        });
        let responseJSON = await response.json()
        expect(responseJSON.responseCode).toEqual(400)
        expect(responseJSON.message).toBe('Bad request, email or password parameter is missing in POST request.')
    }
    async deleteVerifyLogin() {
        const response = await this.request.delete('./verifyLogin');
        let responseJSON = await response.json()
        expect(responseJSON.responseCode).toEqual(405)
        expect(responseJSON.message).toBe('This request method is not supported.')
    }
    async postCreateAccount(user: user) {
        const response = await this.request.post('./createAccount', {
            form: {
                name: user.name,
                email: user.email,
                password: user.password,
                title: user.title,
                birth_date: user.dateOfBirth.getDay(),
                birth_month: user.dateOfBirth.toLocaleString("en-US", { month: "long" }),
                birth_year: user.dateOfBirth.getFullYear(),
                firstname: user.firstname,
                lastname: user.lastname,
                company: user.company,
                address1: user.address1,
                address2: user.address2,
                country: user.country,
                zipcode: user.zipcode,
                state: user.state,
                city: user.city,
                mobile_number: user.mobile_number
            }
        });
        return await response.json()
    }
    async deleteAccount(credentials: loginCredentials) {
        const response = await this.request.delete('./deleteAccount', {
            form: {
                email: credentials.email,
                password: credentials.password,
            }
        });
        return await response.json()
    }
    async putAccountDetails(user: user) {
        const response = await this.request.put('./updateAccount', {
            form: {
                name: user.name,
                email: user.email,
                password: user.password,
                title: user.title,
                birth_date: user.dateOfBirth.getDay(),
                birth_month: user.dateOfBirth.toLocaleString("en-US", { month: "long" }),
                birth_year: user.dateOfBirth.getFullYear(),
                firstname: user.firstname,
                lastname: user.lastname,
                company: user.company,
                address1: user.address1,
                address2: user.address2,
                country: user.country,
                zipcode: user.zipcode,
                state: user.state,
                city: user.city,
                mobile_number: user.mobile_number
            }
        });
        let responseJSON = await response.json()
        expect(responseJSON.responseCode).toEqual(200)
        expect(responseJSON.message).toBe('User updated!')
    }
    async getDetailsByMail(email: string) {
        const response = await this.request.get('./getUserDetailByEmail', {
            params: {
                email: email
            }
        });
        return await response.json()
    }
}