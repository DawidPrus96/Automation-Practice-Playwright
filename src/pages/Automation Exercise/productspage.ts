// playwright-dev-page.ts
import { expect, Locator, Page } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    readonly listitemProduct: Locator;
    readonly productDetails: Locator;
    constructor(page: Page) {
        this.page = page;
        this.listitemProduct = this.page.locator('.productinfo')
        this.productDetails = page.locator('.product-information')
    }
    async viewProduct(productPosition: number) {
        const product = {
            name: await this.listitemProduct.nth(productPosition).getByRole('paragraph').textContent(),
            price: await this.listitemProduct.nth(productPosition).getByRole('heading').textContent(),
        }
        await this.page.getByRole('link', { name: 'view product' }).nth(productPosition).click()
        await expect(this.page.getByRole('link', { name: 'WRITE YOUR REVIEW' })).toBeVisible()
        await expect(this.productDetails.getByRole('heading')).toContainText(`${product.name}`)
        await expect(this.productDetails.getByText('Category')).toBeVisible()
        await expect(this.productDetails).toContainText(`${product.price}`)
        await expect(this.productDetails.getByText('Availability: ')).toBeVisible()
        await expect(this.productDetails.getByText('Condition: ')).toBeVisible()
        await expect(this.productDetails.getByText('Brand: ')).toBeVisible()
    }
    async searchForProduct(productName: string) {
        await this.page.locator('#search_product').fill(productName);
        await this.page.locator('#submit_search').click()
        await expect(this.page.getByRole('heading', { name: 'SEARCHED PRODUCTS', level: 2 })).toBeVisible()
        expect(await this.listitemProduct.count()).toEqual(await this.listitemProduct.getByText(productName).count())
        return await this.listitemProduct.count()
    }
    async addProductFromList(productPosition: number) {
        const product = {
            name: String(await this.listitemProduct.nth(productPosition).getByRole('paragraph').textContent()),
            price: Number(String(await this.listitemProduct.nth(productPosition).getByRole('heading').textContent()).substring(3)),
        }
        await this.listitemProduct.nth(productPosition).locator('.add-to-cart').click()
        await expect(this.page.getByRole('link', { name: 'View Cart' })).toBeVisible()
        await expect(this.page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible()
        return product
    }
    async addProductFromDetails(quantity: number = 1) {
        await this.page.locator('#quantity').fill(`${quantity}`)
        await this.page.getByRole('button', { name: 'Add to cart' }).click()
        await expect(this.page.getByRole('link', { name: 'View Cart' })).toBeVisible()
        await expect(this.page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible()
    }
    async continueShopping() {
        await this.page.getByRole('button', { name: 'Continue Shopping' }).click()
        await expect(this.page.getByRole('button', { name: 'Continue Shopping' })).not.toBeVisible()
    }
    async viewCart() {
        await this.page.getByRole('link', { name: 'View Cart' }).click()
        await expect(this.page).toHaveURL('/view_cart')
    }
    async expandCategory(category: string) {
        let isExpanded = await this.page.locator(`#${category}`).isVisible()
        if (!isExpanded)
            await this.page.locator(`[href="#${category}"]`).click()
        await expect(this.page.locator(`#${category}`)).toBeVisible()
    }
    async selectSubCategory(category: string, subcategory: string) {
        await this.expandCategory(category)
        await this.page.locator(`#${category}`).getByRole('link', { name: subcategory }).click()
        await expect(this.page.locator('.features_items').getByRole('heading', { level: 2, name: `${category} - ${subcategory} PRODUCTS` }).first()).toBeVisible()
    }
    async selectBrand(brand: string) {
        let brandLink = this.page.locator('.brands-name').getByRole('link', { name: brand })
        let brandCountString = String(await brandLink.locator('span').textContent())
        let brandItemCount = Number(brandCountString.substring(1, brandCountString.length - 1))
        await brandLink.click()
        await expect(this.page.locator('.features_items').getByRole('heading', { level: 2, name: `BRAND - ${brand} PRODUCTS` }).first()).toBeVisible()
        expect(await this.listitemProduct.count()).toEqual(brandItemCount)
    }
    async addEveryProductFromList(productName: string) {
        const items: { name: string, price: number }[] = []
        let productCount = await this.listitemProduct.count()
        for (let i = 0; i < productCount; i++) {
            items.push(await this.addProductFromList(i))
            await this.continueShopping()
        }
        return items
    }
    async addReview(name: string, email: string, message: string) {
        await this.page.locator('#name').fill(name)
        await this.page.locator('#email').fill(email)
        await this.page.locator('#review').fill(message)
        await this.page.locator('#button-review').click()
        await expect(this.page.getByText('Thank you for your review.')).toBeVisible()
    }
}