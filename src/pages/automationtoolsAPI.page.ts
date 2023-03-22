// playwright-dev-page.ts
import { expect, APIRequestContext } from '@playwright/test';

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
        const response = await this.request.post(`./productsList`);
        expect(response.status()).toEqual(200)
        let responseJSON = await response.json()
        expect(responseJSON.responseCode).toEqual(405)
        expect(responseJSON.message).toBe('This request method is not supported.')
    }
}