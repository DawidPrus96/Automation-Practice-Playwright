// example.spec.ts
import { test, expect } from '@playwright/test';
import { AutomationTools } from '../pages/facebook.page';
test.use({ baseURL: 'https://www.facebook.com/', locale: 'en-us' })
test.beforeEach(async ({ page }) => {
    await page.route('**/*', request => {
        return request.request().url().startsWith('https://googleads' || 'https://pagead2' || 'https://maps.googleapis')
            ? request.abort()
            : request.continue();
    })
    await page.goto('/')
})
test('Test postów', async ({ page }) => {
    const playwrightDev = new AutomationTools(page);
    const user = {
        firstName: 'Patricia',
        secondName: 'Alijgbgbeadab',
        lastName: 'Liangstein',
        email: 'iwxhmdr_liangstein_1679307785@tfbnw.net',
        password: 'a95dy3g9ntg',
    }
    await page.locator('[data-cookiebanner=accept_button]').click()
    await page.getByTestId('royal_email').fill(user.email)
    await page.getByTestId('royal_pass').fill(user.password)
    await page.getByTestId('royal_login_button').click()
    await expect(page.getByText(`Welcome to Facebook, ${user.firstName}`)).toBeVisible()
    await page.goto('/')
    for (let i = 0; i < 100; i++) {
        await page.getByRole('button', { name: `What\'s on your mind, ${user.firstName}?` }).click()
        await page.getByRole('textbox').fill(`Test ${i}`)
        await page.getByRole('button', { name: 'Post', exact: true }).click()
        await expect(page.getByText(`Test ${i}`, { exact: true })).toBeVisible()
    }
});