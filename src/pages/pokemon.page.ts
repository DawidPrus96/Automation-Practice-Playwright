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
    async getCount() {
        const response = await this.request.get('');
        return (await response.json()).count
    }
    async getAllPokeURL(count: number) {
        const response = await this.request.get('', {
            params: {
                limit: count
            }
        })
        return (await response.json()).results
    }
    async getBaseExp(url: string) {
        const response = await this.request.get(url);
        return (await response.json()).base_experience
    }
}