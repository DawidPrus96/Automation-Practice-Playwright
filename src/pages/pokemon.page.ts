// playwright-dev-page.ts
import { expect, APIRequestContext } from '@playwright/test';

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