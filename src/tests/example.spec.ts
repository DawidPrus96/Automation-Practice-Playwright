// example.spec.ts
import { test, expect } from '@playwright/test';
import { AutomationTools } from '../pages/automationtools.page';
test.use({ baseURL: 'https://automationexercise.com/' })
test.beforeEach(async ({ page }) => {
  page.route('**/*', request => {
    return request.request().url().startsWith('https://googleads')
      ? request.abort()
      : request.continue();
  })
  await page.goto('/')
  await expect(page).toHaveURL('/')
  await expect(page.locator('#slider-carousel')).toBeVisible()
})

test('Test Case 1: Register User', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const user = {
    name: 'TC001Name',
    email: 'TC001@Email.Address',
    password: 'zaq1@WSX',
    gender: 'Mr.', // Mr. or Mrs.
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
  await playwrightDev.gotoLoginPage()
  await playwrightDev.signup(user)
  await playwrightDev.deleteAccount(user)
});

test('Test Case 2: Login User with correct email and password with TC004 instead of account deletion', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const credentials = {
    name: 'TC002Name',
    email: 'TC002@Email.Address',
    password: 'zaq1@WSX',
  }
  await playwrightDev.gotoLoginPage();
  await playwrightDev.login(credentials)
  await playwrightDev.logout(credentials)
});

test('Test Case 3: Login User with incorrect email and password', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const credentials = {
    email: 'TC003@email.address',
    password: 'incorrectPassword',
  }
  await playwrightDev.gotoLoginPage();
  await playwrightDev.login(credentials)
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible()
});

test('Test Case 5: Register User with existing email', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const credentials = {
    name: 'TC005Name',
    email: 'correct@email.address',
  }
  await playwrightDev.gotoLoginPage();
  await playwrightDev.signupCredentials(credentials)
  await expect(page.getByText('Email Address already exist!')).toBeVisible()
});

test('Test Case 6: Contact Us Form', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  const user = {
    name: 'TC006Name',
    email: 'TC006@email.address',
    subject: 'testSubject',
    message: 'testMessage testMessage testMessage testMessage testMessage testMessage testMessage ',
    file: 'exampleTextFile.txt',
  }
  await playwrightDev.gotoContactUsPage()
  await playwrightDev.fillContactUsForm(user)
  await playwrightDev.contactUsGoHome()
});

test('Test Case 7: Verify Test Cases Page', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoTestCasesPage()
});

test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoProductsPage()
  await playwrightDev.viewProduct(0)
});

test('Test Case 9: Search Product', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoProductsPage()
  await playwrightDev.searchForProduct('blue')
});

test('Test Case 10: Verify Subscription in home page', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  let email = 'TC10@test.test'
  await playwrightDev.subscribe(email)
});

test('Test Case 11: Verify Subscription in Cart page', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  let email = 'TC11@test.test'
  await playwrightDev.gotoCartPage()
  await playwrightDev.subscribe(email)
});

test('Test Case 12: Add Products in Cart', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const items: { name: any, price: any }[] = []
  const howManyItems = 2
  await playwrightDev.gotoProductsPage()
  for (let i = 1; i <= howManyItems; i++) {
    items.push(await playwrightDev.addProductFromList(i))
    if (i < howManyItems)
      await playwrightDev.continueShopping()
    else
      await playwrightDev.viewCart()
  }
  await playwrightDev.checkProductsInCart(items)
});

test('Test Case 13: Verify Product quantity in Cart', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  let productPosition = 0
  let productQuantity = 4
  await playwrightDev.viewProduct(productPosition)
  await playwrightDev.addProductFromDetails(productQuantity)
  await playwrightDev.viewCart()
  let cartQuantity = await page.locator('xpath=//td[@class="cart_quantity"]').innerText()
  expect(Number(cartQuantity)).toEqual(productQuantity)
});

test('Test Case 14: Place Order: Register while Checkout', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const user = {
    name: 'TC014Name',
    email: 'TC014@Email.Address',
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

  const paymentData = {
    cardName: 'TC014CardName',
    cardNumber: 4242424242424242,
    cardCVC: 914,
    cardExpirationMonth: 4,
    cardExpirationYear: 2024,
  }
  let description = 'test Description test Description test Description test Description test Description test Description '
  let productDetails = await playwrightDev.addProductFromList(0)
  await playwrightDev.continueShopping()
  await playwrightDev.gotoCartPage()
  await playwrightDev.proceedToCheckout()
  await page.getByRole('link', { name: 'Register / Login' }).click()
  await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()
  await playwrightDev.signup(user)
  await playwrightDev.gotoCartPage()
  await playwrightDev.proceedToCheckout()
  await playwrightDev.placeOrder(user, productDetails, description)
  await playwrightDev.fillPayment(paymentData)
  await playwrightDev.completeOrder()
  await playwrightDev.deleteAccount(user)
});