// example.spec.ts
import { test } from '@playwright/test';
import { AutomationTools } from '../pages/automationtoolsAPI.page';
test('API 1: Get All Products List', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  await playwrightDev.getAllProducts()
});
test('API 2: POST To All Products List', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  await playwrightDev.postProduct()
});