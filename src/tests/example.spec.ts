// example.spec.ts
import { test, expect } from '@playwright/test';
import { AutomationTools } from '../pages/automationtools.page';
test.use({ baseURL: 'https://automationexercise.com/' })
test.beforeEach(async ({ page }) => {

  page.route('**/*', request => {
    return request.request().url().startsWith('https://googleads')
      ? request.abort() :
      request.continue();
  })
  await page.goto('/')
  await expect(page).toHaveURL('/')
})

test('TC001', async ({ page }) => {
  const user = {
    name: 'TC001Name',
    email: 'TC001@Email.Address',
    gender: 'Mr.', // Mr. or Mrs.
    password: 'zaq1@WSX',
    dateOfBirth: new Date("1996-02-16"),
    newsletter: true,
    offers: true,
    firstName: 'testFirstname',
    lastName: 'testLastName',
    company: 'testCompany',
    address: 'testAddress',
    address2: 'testAddress2',
    country: 'United States',
    state: 'testState',
    city: 'testCity',
    zipcode: 'testZipcode',
    mobileNumber: 0,
  }
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoPage('login');
  await playwrightDev.startSignup(user)
  const IsExistingAccount = await page.getByText('Email Address already exist!').isVisible()
  if (IsExistingAccount) {
    await playwrightDev.login(user)
    await playwrightDev.deleteAccount(user)
    await playwrightDev.gotoPage('login');
    await playwrightDev.startSignup(user)
  }
  await playwrightDev.signupForm(user)
  await playwrightDev.deleteAccount(user)
});

test('Test Case 2: Login User with correct email and password with TC004 instead of account deletion', async ({ page }) => {
  const user = {
    name: 'TC002Name',
    email: 'TC002@Email.Address',
    password: 'zaq1@WSX',
  }
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoPage('login');
  await playwrightDev.login(user)
  await playwrightDev.logout(user)
});

test('Test Case 3: Login User with incorrect email and password', async ({ page }) => {
  const user = {
    email: 'TC003@email.address',
    password: 'incorrectPassword',
  }
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoPage('login');
  await playwrightDev.login(user)
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible()
});

test('Test Case 5: Register User with existing email', async ({ page }) => {
  const user = {
    name: 'TC005Name',
    email: 'correct@email.address',
  }
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoPage('login');
  await playwrightDev.startSignup(user)
  await expect(page.getByText('Email Address already exist!')).toBeVisible()
});

test('Test Case 6: Contact Us Form', async ({ page }) => {
  const user = {
    name: 'TC006Name',
    email: 'TC006@email.address',
    subject: 'testSubject',
    message: 'testMessage testMessage testMessage testMessage testMessage testMessage testMessage '
  }
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoPage('contact us')
  await playwrightDev.contactUsForm(user)
  await playwrightDev.contactUsGoHome()
});

test('Test Case 7: Verify Test Cases Page', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoPage('Test Cases')
  await expect(page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible()
});

test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoPage('Products')
  await playwrightDev.viewProduct()
});

test('Test Case 9: Search Product', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoPage('Products')
  await playwrightDev.searchForProduct('blue')
});

test('Test Case 10: Verify Subscription in home page', async ({ page }) => {
  let email = 'TC10@test.test'
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.subscribe(email)
});

test('Test Case 11: Verify Subscription in Cart page', async ({ page }) => {
  let email = 'TC11@test.test'
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoPage('Cart')
  await playwrightDev.subscribe(email)
});

test('Test Case 12: Add Products in Cart', async ({ page }) => {
  const items: { name: any, price: any }[] = []
  const howManyItems = 2
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoPage('Products')
  for (let i = 1; i <= howManyItems; i++) {
    items.push(await playwrightDev.addProductToCart(i, false))
    if (i < howManyItems)
      await page.getByRole('button', { name: 'Continue Shopping' }).click()
    else
      await page.getByRole('link', { name: 'View Cart' }).click()
  }
  await playwrightDev.checkProductInCart(items)
});