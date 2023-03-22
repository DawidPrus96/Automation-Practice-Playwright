// example.spec.ts
import { test, expect } from '@playwright/test';
import { AutomationTools } from '../pages/automationtools.page';
test.beforeEach(async ({ page }) => {
  await page.route('**/*', request => {
    return request.request().url().startsWith('https://googleads' || 'https://pagead2' || 'https://maps.googleapis')
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
  // page.on('dialog', async dialog => {
  //   await dialog.accept();
  // });
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
  await playwrightDev.viewProduct(1)
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
  const items: { name: string, price: number, quantity: number }[] = []
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
  let productDetails = [await playwrightDev.addProductFromList(1)]
  await playwrightDev.continueShopping()
  await playwrightDev.gotoCartPage()
  await playwrightDev.proceedToCheckout()
  await playwrightDev.signupFromCart()
  await playwrightDev.signup(user)
  await playwrightDev.gotoCartPage()
  await playwrightDev.proceedToCheckout()
  await playwrightDev.checkOrder(user, productDetails, description)
  await playwrightDev.placeOrder()
  await playwrightDev.fillPayment(paymentData)
  await playwrightDev.useContinueButton()
  await playwrightDev.deleteAccount(user)
});

test('Test Case 15: Place Order: Register before Checkout', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const user = {
    name: 'TC015Name',
    email: 'TC015@Email.Address',
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
    cardName: 'TC015CardName',
    cardNumber: 4242424242424242,
    cardCVC: 915,
    cardExpirationMonth: 10,
    cardExpirationYear: 2025,
  }
  let description = "test description test description test description test description "
  await playwrightDev.gotoLoginPage()
  await playwrightDev.signup(user)
  let productDetails = [await playwrightDev.addProductFromList(1)]
  await playwrightDev.continueShopping()
  await playwrightDev.gotoCartPage()
  await playwrightDev.proceedToCheckout()
  await playwrightDev.checkOrder(user, productDetails, description)
  await playwrightDev.placeOrder()
  await playwrightDev.fillPayment(paymentData)
  await playwrightDev.useContinueButton()
  await playwrightDev.deleteAccount(user)
});

test('Test Case 16: Place Order: Login before Checkout', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const user = {
    name: 'TC016Name',
    email: 'TC016@Email.Address',
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
    cardName: 'TC016CardName',
    cardNumber: 4242424242424242,
    cardCVC: 916,
    cardExpirationMonth: 11,
    cardExpirationYear: 2026,
  }
  let description = "test description test description test description test description "
  await playwrightDev.gotoLoginPage()
  await playwrightDev.login(user)
  await expect(page.getByText(`Logged in as ${user.name}`, { exact: true })).toBeVisible()
  await playwrightDev.gotoCartPage()
  await playwrightDev.resetBasket()
  await playwrightDev.gotoHomePage()
  let productDetails = [await playwrightDev.addProductFromList(1)]
  await playwrightDev.continueShopping()
  await playwrightDev.gotoCartPage()
  await playwrightDev.proceedToCheckout()
  await playwrightDev.checkOrder(user, productDetails, description)
  await playwrightDev.placeOrder()
  await playwrightDev.fillPayment(paymentData)
  await playwrightDev.useContinueButton()
  await playwrightDev.logout(user)
});

test('Test Case 17: Remove Products From Cart', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.addProductFromList(1)
  await playwrightDev.continueShopping()
  await playwrightDev.gotoCartPage()
  await playwrightDev.resetBasket()
});

test('Test Case 18: View Category Products', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.selectSubCategory("Women", "dress")
  await playwrightDev.selectSubCategory("Men", "tshirts")
});
test('Test Case 19: View & Cart Brand Products', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  await playwrightDev.gotoProductsPage()
  await playwrightDev.selectBrand("Polo")
  await playwrightDev.selectBrand("Madame")
});
test('Test Case 20: Search Products and Verify Cart After Login', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const credentials = {
    name: 'TC020Name',
    email: 'TC020@Email.Address',
    password: 'zaq1@WSX',
  }
  await playwrightDev.gotoLoginPage()
  await playwrightDev.login(credentials)
  await playwrightDev.gotoCartPage()
  await playwrightDev.resetBasket()
  await playwrightDev.logout(credentials)
  await playwrightDev.gotoProductsPage()
  let items = await playwrightDev.addEveryProductFromList("Blue")
  await playwrightDev.gotoCartPage()
  await playwrightDev.checkProductsInCart(items)
  await playwrightDev.gotoLoginPage();
  await playwrightDev.login(credentials)
  await playwrightDev.gotoCartPage()
  await playwrightDev.checkProductsInCart(items)
  await playwrightDev.logout(credentials)
});
test('Test Case 21: Add review on product', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const review = {
    name: 'TC021Name',
    email: 'TC021@Email.Address',
    message: 'message message message message message message message message message message message message ',
  }
  await playwrightDev.gotoProductsPage()
  await playwrightDev.viewProduct(1)
  await playwrightDev.addReview(review)
});
test('Test Case 22: Add to cart from Recommended items', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  let items = [await playwrightDev.addProductFromRecommended(1)]
  await playwrightDev.viewCart()
  await playwrightDev.checkProductsInCart(items)
});
test('Test Case 23: Verify address details in checkout page', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const user = {
    name: 'TC023Name',
    email: 'TC023@Email.Address',
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
  let productDetails = [await playwrightDev.addProductFromList(1)]
  await playwrightDev.continueShopping()
  await playwrightDev.gotoCartPage()
  await playwrightDev.proceedToCheckout()
  await playwrightDev.checkOrder(user, productDetails)
  await playwrightDev.deleteAccount(user)
});
test('Test Case 24: Download Invoice after purchase order', async ({ page }) => {
  const playwrightDev = new AutomationTools(page);
  const user = {
    name: 'TC024Name',
    email: 'TC024@Email.Address',
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
  let productDetails = [await playwrightDev.addProductFromList(1)]
  await playwrightDev.continueShopping()
  await playwrightDev.gotoCartPage()
  await playwrightDev.proceedToCheckout()
  await playwrightDev.signupFromCart()
  await playwrightDev.signup(user)
  await playwrightDev.gotoCartPage()
  await playwrightDev.proceedToCheckout()
  await playwrightDev.checkOrder(user, productDetails, description)
  await playwrightDev.placeOrder()
  await playwrightDev.fillPayment(paymentData)
  await playwrightDev.downloadInvoice()
  await playwrightDev.useContinueButton()
  await playwrightDev.deleteAccount(user)
});
test('Test Case 25: Verify Scroll Up using \'Arrow\' button and Scroll Down functionality', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator('.single-widget').filter({ hasText: 'SUBSCRIPTION' })).toBeInViewport()
  await page.locator('#scrollUp').click()
  await expect(page.locator('.item.active').getByText('Full-Fledged practice website for Automation Engineers')).toBeInViewport()
});
test('Test Case 26: Verify Scroll Up without \'Arrow\' button and Scroll Down functionality', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator('.single-widget').filter({ hasText: 'SUBSCRIPTION' })).toBeInViewport()
  await page.evaluate(() => window.scrollTo(0, screenTop));
  await expect(page.locator('.item.active').getByText('Full-Fledged practice website for Automation Engineers')).toBeInViewport()
});