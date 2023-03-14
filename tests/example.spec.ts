import { test, expect } from '@playwright/test';

const newUser = {
  name: 'testName',
  email: 'test@Email.Address',
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
const incorrectUser = {
  name: 'incorrectName',
  email: 'incorrect@email.address',
  password: 'incorrectPassword',
}

const correctUser = {
  name: 'correctName',
  email: 'correct@mail.address',
  password: 'correctPassword',
}

const paymentData = {
  cardName: 'testCardName',
  cardNumber: 4242424242424242,
  cardCVC: 551,
  cardExpirationMonth: 10,
  cardExpirationYear: 2025,
}

const contactUsForm = {
  subject: 'correctSubject',
  message: 'correct message'
}

test.use({ baseURL: 'https://automationexercise.com/' })

test.beforeEach(async ({ page }) => {
  page.route('**/*', request => {
    return request.request().url().startsWith('https://googleads' || 'https://pagead2' || 'https://adservice')
      ? request.abort() :
      request.continue();
  })
  await page.goto('/')
  await expect(page).toHaveURL('/')
})



test('Test Case 1: Register User', async ({ page }) => {
  await page.getByRole('link', { name: 'Signup / Login' }).click()
  await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="signup-name"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="signup-email"]').fill(newUser.email)
  await page.locator('xpath=//*[@data-qa="signup-button"]').click()
  const IsExistingAccount = await page.getByText('Email Address already exist!').isVisible()
  if (IsExistingAccount) {
    await page.locator('xpath=//*[@data-qa="login-email"]').fill(newUser.email)
    await page.locator('xpath=//*[@data-qa="login-password"]').fill(newUser.password)
    await page.locator('xpath=//*[@data-qa="login-button"]').click()
    await page.getByRole('link', { name: 'Delete Account' }).click()
    await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
    await page.getByRole('link', { name: 'Signup / Login' }).click()
    await page.locator('xpath=//*[@data-qa="signup-name"]').fill(newUser.name)
    await page.locator('xpath=//*[@data-qa="signup-email"]').fill(newUser.email)
    await page.locator('xpath=//*[@data-qa="signup-button"]').click()
  }
  await expect(page.getByRole('heading', { name: 'ENTER ACCOUNT INFORMATION' })).toBeVisible()
  await page.getByLabel(newUser.gender).check()
  await page.locator('xpath=//*[@data-qa="password"]').fill(newUser.password)
  await page.locator('xpath=//*[@data-qa="days"]').selectOption(`${newUser.dateOfBirth.getDay()}`)
  await page.locator('xpath=//*[@data-qa="months"]').selectOption(`${newUser.dateOfBirth.toLocaleString("en-US", { month: "long" })}`)
  await page.locator('xpath=//*[@data-qa="years"]').selectOption(`${newUser.dateOfBirth.getFullYear()}`)
  if (newUser.newsletter)
    await page.getByRole('checkbox', { name: 'newsletter' }).check()
  if (newUser.offers)
    await page.getByRole('checkbox', { name: 'offers' }).check()
  await page.locator('xpath=//*[@data-qa="first_name"]').fill(newUser.firstName)
  await page.locator('xpath=//*[@data-qa="last_name"]').fill(newUser.lastName)
  await page.locator('xpath=//*[@data-qa="company"]').fill(newUser.company)
  await page.locator('xpath=//*[@data-qa="address"]').fill(newUser.address)
  await page.locator('xpath=//*[@data-qa="address2"]').fill(newUser.address2)
  await page.locator('xpath=//*[@data-qa="country"]').selectOption(newUser.country)
  await page.locator('xpath=//*[@data-qa="state"]').fill(newUser.state)
  await page.locator('xpath=//*[@data-qa="city"]').fill(newUser.city)
  await page.locator('xpath=//*[@data-qa="zipcode"]').fill(newUser.zipcode)
  await page.locator('xpath=//*[@data-qa="mobile_number"]').fill(`${newUser.mobileNumber}`)
  await page.locator('xpath=//*[@data-qa="create-account"]').click()
  await expect(page.getByRole('heading', { name: 'ACCOUNT CREATED!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="continue-button"]').click()
  await expect(page.getByText(`Logged in as ${newUser.name}`, { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Delete Account' }).click()
  await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="continue-button"]').click()
  await expect(page).toHaveURL('/')
});



test('Test Case 2: Login User with correct email and password with TC004 instead of account deletion', async ({ page }) => {
  await page.getByRole('link', { name: 'Signup / Login' }).click()
  await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="login-email"]').fill(correctUser.email)
  await page.locator('xpath=//*[@data-qa="login-password"]').fill(correctUser.password)
  await page.locator('xpath=//*[@data-qa="login-button"]').click()
  await expect(page.getByText(`Logged in as ${correctUser.name}`, { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'logout' }).click()
  await expect(page).toHaveURL('/login')

});


test('Test Case 3: Login User with correct email and password', async ({ page }) => {
  await page.getByRole('link', { name: 'Signup / Login' }).click()
  await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="login-email"]').fill(incorrectUser.email)
  await page.locator('xpath=//*[@data-qa="login-password"]').fill(incorrectUser.password)
  await page.locator('xpath=//*[@data-qa="login-button"]').click()
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible()
});


test('Test Case 5: Register User with existing email', async ({ page }) => {
  await page.getByRole('link', { name: 'Signup / Login' }).click()
  await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="signup-name"]').fill(correctUser.name)
  await page.locator('xpath=//*[@data-qa="signup-email"]').fill(correctUser.email)
  await page.locator('xpath=//*[@data-qa="signup-button"]').click()
  await expect(page.getByText('Email Address already exist!')).toBeVisible()
});


test('Test Case 6: Contact Us Form', async ({ page }) => {
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  await page.getByRole('link', { name: 'Contact us' }).click()
  await expect(page.getByRole('heading', { name: 'GET IN TOUCH' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="name"]').fill(correctUser.name)
  await page.locator('xpath=//*[@data-qa="email"]').fill(correctUser.email)
  await page.locator('xpath=//*[@data-qa="subject"]').fill(contactUsForm.subject)
  await page.locator('xpath=//*[@data-qa="message"]').fill(contactUsForm.message)
  await page.locator('input[name="upload_file"]').setInputFiles('exampleTextFile.txt');
  await page.locator('xpath=//*[@data-qa="submit-button"]').click()
  await expect(page.locator('xpath=//div[@class="contact-form"]').getByText('Success! Your details have been submitted successfully.')).toBeVisible()
  await page.locator('xpath=//div[@class="contact-form"]').getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL('/')
});


test('Test Case 7: Verify Test Cases Page', async ({ page }) => {
  await page.getByRole('banner')
    .getByRole('link', { name: 'Test Cases' }).click()
  await expect(page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible()
});


test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
  await page.getByRole('banner')
    .getByRole('link', { name: 'Products' }).click()
  await expect(page.getByRole('heading', { name: 'ALL PRODUCTS' })).toBeVisible()
  await expect(page.locator('xpath=//div[@class="features_items"]')).toBeVisible()
  await page.getByRole('link', { name: 'view product' }).first().click()
  await expect(page).toHaveURL(/\/product_details\//)
  let productDetails = page.locator('xpath=//div[@class="product-information"]')
  await expect(productDetails.getByRole('heading')).toBeVisible()
  await expect(productDetails.getByText('Category')).toBeVisible()
  await expect(productDetails.getByText('Rs. ')).toBeVisible()
  await expect(productDetails.getByText('Availability: ')).toBeVisible()
  await expect(productDetails.getByText('Condition: ')).toBeVisible()
  await expect(productDetails.getByText('Brand: ')).toBeVisible()
});



test('Test Case 9: Search Product', async ({ page }) => {
  let productName = 'blue'
  await page.getByRole('banner')
    .getByRole('link', { name: 'Products' }).click()
  await expect(page.getByRole('heading', { name: 'ALL PRODUCTS' })).toBeVisible()
  await expect(page.locator('xpath=//div[@class="features_items"]')).toBeVisible()
  await page.getByPlaceholder('Search Product').fill(productName);
  await page.locator('xpath=//button[@id="submit_search"]').click()
  let allSearchedProducts = await page.locator(`xpath=//div[starts-with(@class, "productinfo")]/p`).count()
  let correctSearchedProducts = await page.locator(`xpath=//div[starts-with(@class, "productinfo")]/p[contains(text(),${new RegExp(productName, "i")})]`).count()
  expect(allSearchedProducts).toEqual(correctSearchedProducts)
});


test('Test Case 10: Verify Subscription in home page', async ({ page }) => {
  let email = 'test@test.test'
  let footer = page.locator('xpath=//div[@class="footer-widget"]')
  await expect(footer.getByRole('heading', { name: 'Subscription' })).toBeVisible()
  await footer.getByRole('textbox').fill(email)
  await footer.getByRole('button').click()
  await expect(footer.getByText('You have been successfully subscribed!')).toBeVisible()
});


test('Test Case 11: Verify Subscription in Cart page', async ({ page }) => {
  let email = 'test@test.test'
  let footer = page.locator('xpath=//div[@class="footer-widget"]')
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Cart' }).click()
  await expect(footer.getByRole('heading', { name: 'Subscription' })).toBeVisible()
  await footer.getByRole('textbox').fill(email)
  await footer.getByRole('button').click()
  await expect(footer.getByText('You have been successfully subscribed!')).toBeVisible()
});


test('Test Case 12: Add Products in Cart', async ({ page }) => {
  const items: { name: any, price: any }[] = []
  const howManyItems = 2
  await page.getByRole('banner')
    .getByRole('link', { name: 'Products' }).click()
  await expect(page.getByRole('heading', { name: 'ALL PRODUCTS' })).toBeVisible()
  await expect(page.locator('xpath=//div[@class="features_items"]')).toBeVisible()
  for (let i = 0; i < howManyItems; i++) {
    await page.locator('xpath=//div[contains(@class, "productinfo")]/a[contains(text(), "Add to cart")]').nth(i).hover()
    await page.locator('xpath=//div[contains(@class, "overlay-content")]/a[contains(text(), "Add to cart")]').nth(i).click()
    items.push(
      {
        name: await page.locator('xpath=//div[contains(@class, "productinfo")]').getByRole('paragraph').nth(i).textContent(),
        price: Number((await page.locator('xpath=//div[contains(@class, "productinfo")]').getByRole('heading').nth(i).textContent())?.substring(3))
      }
    )
    if (i < howManyItems - 1)
      await page.getByRole('button', { name: 'Continue Shopping' }).click()
    else
      await page.getByRole('link', { name: 'View Cart' }).click()
  }
  await expect(page
    .getByRole('row')).toHaveCount(items.length + 1)
  let i = 0
  for (const tr of await page.locator('xpath=//tbody/tr').all()) {
    await expect(tr.locator('xpath=/td[@class="cart_description"]').filter({ hasText: `${items[i].name}` })).toBeVisible()
    await expect(tr.locator('xpath=/td[@class="cart_price"]').filter({ hasText: `${items[i].price}` })).toBeVisible()
    let count = Number(await tr.locator('xpath=/td[@class="cart_quantity"]').innerText())
    expect(count).toEqual(1)
    let totalPrice = Number((await tr.locator('xpath=/td[@class="cart_total"]').innerText()).substring(3))
    expect(totalPrice).toEqual(items[i].price * count)
    i++
  }
});


test('Test Case 13: Verify Product quantity in Cart', async ({ page }) => {
  let quantity = 4
  await page.getByRole('link', { name: 'view product' }).first().click()
  await expect(page.locator('xpath=//div[@class="product-information"]')).toBeVisible()
  await page.locator('xpath=//*[@id="quantity"]').fill(`${quantity}`)
  await page.getByRole('button', { name: 'Add to cart' }).click()
  await page.getByRole('link', { name: 'View Cart' }).click()
  expect(
    Number(await page.locator('xpath=//td[@class="cart_quantity"]').innerText())
  ).toEqual(quantity)
});


test('Test Case 14: Place Order: Register while Checkout', async ({ page }) => {
  await page
    .locator('xpath=//div[contains(@class, "productinfo")]')
    .getByText('Add to cart').first().click()
  let itemName = await page
    .locator('xpath=//div[contains(@class, "productinfo")]')
    .getByRole('paragraph').first().textContent()
  let itemPrice = Number((await page
    .locator('xpath=//div[contains(@class, "productinfo")]')
    .getByRole('heading').first().textContent())?.substring(3))
  let itemQuantity = 1
  await page.getByRole('button', { name: 'Continue Shopping' }).click()
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Cart' }).click()
  await expect(page).toHaveURL('/view_cart')
  await page.getByText('Proceed To Checkout').click()
  await page.getByRole('link', { name: 'Register / Login' }).click()
  await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="signup-name"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="signup-email"]').fill(newUser.email)
  await page.locator('xpath=//*[@data-qa="signup-button"]').click()
  const IsExistingAccount = await page.getByText('Email Address already exist!').isVisible()
  if (IsExistingAccount) {
    await page.locator('xpath=//*[@data-qa="login-email"]').fill(newUser.email)
    await page.locator('xpath=//*[@data-qa="login-password"]').fill(newUser.password)
    await page.locator('xpath=//*[@data-qa="login-button"]').click()
    await page.getByRole('link', { name: 'Delete Account' }).click()
    await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
    await page.getByRole('link', { name: 'Signup / Login' }).click()
    await page.locator('xpath=//*[@data-qa="signup-name"]').fill(newUser.name)
    await page.locator('xpath=//*[@data-qa="signup-email"]').fill(newUser.email)
    await page.locator('xpath=//*[@data-qa="signup-button"]').click()
  }
  await expect(page.getByRole('heading', { name: 'ENTER ACCOUNT INFORMATION' })).toBeVisible()
  await page.getByLabel(newUser.gender).check()
  await page.locator('xpath=//*[@data-qa="password"]').fill(newUser.password)
  await page.locator('xpath=//*[@data-qa="days"]').selectOption(`${newUser.dateOfBirth.getDay()}`)
  await page.locator('xpath=//*[@data-qa="months"]').selectOption(`${newUser.dateOfBirth.toLocaleString("en-US", { month: "long" })}`)
  await page.locator('xpath=//*[@data-qa="years"]').selectOption(`${newUser.dateOfBirth.getFullYear()}`)
  if (newUser.newsletter)
    await page.getByRole('checkbox', { name: 'newsletter' }).check()
  if (newUser.offers)
    await page.getByRole('checkbox', { name: 'offers' }).check()
  await page.locator('xpath=//*[@data-qa="first_name"]').fill(newUser.firstName)
  await page.locator('xpath=//*[@data-qa="last_name"]').fill(newUser.lastName)
  await page.locator('xpath=//*[@data-qa="company"]').fill(newUser.company)
  await page.locator('xpath=//*[@data-qa="address"]').fill(newUser.address)
  await page.locator('xpath=//*[@data-qa="address2"]').fill(newUser.address2)
  await page.locator('xpath=//*[@data-qa="country"]').selectOption(newUser.country)
  await page.locator('xpath=//*[@data-qa="state"]').fill(newUser.state)
  await page.locator('xpath=//*[@data-qa="city"]').fill(newUser.city)
  await page.locator('xpath=//*[@data-qa="zipcode"]').fill(newUser.zipcode)
  await page.locator('xpath=//*[@data-qa="mobile_number"]').fill(`${newUser.mobileNumber}`)
  await page.locator('xpath=//*[@data-qa="create-account"]').click()
  await expect(page.getByRole('heading', { name: 'ACCOUNT CREATED!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="continue-button"]').click()
  await expect(page.getByText(`Logged in as ${newUser.name}`, { exact: true })).toBeVisible()
  await expect(page).toHaveURL('/')
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Cart' }).click()
  await expect(page).toHaveURL('/view_cart')
  await page.getByText('Proceed To Checkout').click()
  await expect(page.getByRole('list').filter({ hasText: 'delivery address' })).toContainText(
    newUser.gender &&
    newUser.firstName &&
    newUser.lastName &&
    newUser.company &&
    newUser.address &&
    newUser.address2 &&
    newUser.city &&
    newUser.state &&
    newUser.zipcode &&
    newUser.country &&
    `${newUser.mobileNumber}`
  )
  await expect(page
    .locator('xpath=//td[@class="cart_description"]')).toContainText(`${itemName}`)
  await expect(page
    .locator('xpath=//td[@class="cart_price"]')).toContainText(`${itemPrice}`)
  await expect(page
    .locator('xpath=//td[@class="cart_quantity"]')).toContainText(`${itemQuantity}`)
  await expect(page
    .locator('xpath=//td[@class="cart_total"]')).toContainText(`${itemPrice * itemQuantity}`)
  await expect(page
    .getByRole('row').last()
    .locator('xpath=//p[@class="cart_total_price"]')).toContainText(`${itemPrice * itemQuantity}`)
  await page.getByRole('textbox').first().fill('Test description')
  await page.getByRole('link', { name: 'place order' }).click()
  await page.locator('xpath=//*[@data-qa="name-on-card"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="card-number"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="cvc"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="expiry-month"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="expiry-year"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="pay-button"]').click({ noWaitAfter: true })
  expect(page.locator('xpath=//div[@id="success_message"]')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Order placed' })).toBeVisible({})
  await page.getByRole('link', { name: 'continue' }).click()
  await expect(page).toHaveURL('/')
  await page.getByRole('link', { name: 'Delete Account' }).click()
  await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="continue-button"]').click()
  await expect(page).toHaveURL('/')
});


test('Test Case 15: Place Order: Register before Checkout', async ({ page }) => {
  await page.getByRole('link', { name: 'Signup / Login' }).click()
  await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="signup-name"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="signup-email"]').fill(newUser.email)
  await page.locator('xpath=//*[@data-qa="signup-button"]').click()
  const IsExistingAccount = await page.getByText('Email Address already exist!').isVisible()
  if (IsExistingAccount) {
    await page.locator('xpath=//*[@data-qa="login-email"]').fill(newUser.email)
    await page.locator('xpath=//*[@data-qa="login-password"]').fill(newUser.password)
    await page.locator('xpath=//*[@data-qa="login-button"]').click()
    await page.getByRole('link', { name: 'Delete Account' }).click()
    await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
    await page.getByRole('link', { name: 'Signup / Login' }).click()
    await page.locator('xpath=//*[@data-qa="signup-name"]').fill(newUser.name)
    await page.locator('xpath=//*[@data-qa="signup-email"]').fill(newUser.email)
    await page.locator('xpath=//*[@data-qa="signup-button"]').click()
  }
  await expect(page.getByRole('heading', { name: 'ENTER ACCOUNT INFORMATION' })).toBeVisible()
  await page.getByLabel(newUser.gender).check()
  await page.locator('xpath=//*[@data-qa="password"]').fill(newUser.password)
  await page.locator('xpath=//*[@data-qa="days"]').selectOption(`${newUser.dateOfBirth.getDay()}`)
  await page.locator('xpath=//*[@data-qa="months"]').selectOption(`${newUser.dateOfBirth.toLocaleString("en-US", { month: "long" })}`)
  await page.locator('xpath=//*[@data-qa="years"]').selectOption(`${newUser.dateOfBirth.getFullYear()}`)
  if (newUser.newsletter)
    await page.getByRole('checkbox', { name: 'newsletter' }).check()
  if (newUser.offers)
    await page.getByRole('checkbox', { name: 'offers' }).check()
  await page.locator('xpath=//*[@data-qa="first_name"]').fill(newUser.firstName)
  await page.locator('xpath=//*[@data-qa="last_name"]').fill(newUser.lastName)
  await page.locator('xpath=//*[@data-qa="company"]').fill(newUser.company)
  await page.locator('xpath=//*[@data-qa="address"]').fill(newUser.address)
  await page.locator('xpath=//*[@data-qa="address2"]').fill(newUser.address2)
  await page.locator('xpath=//*[@data-qa="country"]').selectOption(newUser.country)
  await page.locator('xpath=//*[@data-qa="state"]').fill(newUser.state)
  await page.locator('xpath=//*[@data-qa="city"]').fill(newUser.city)
  await page.locator('xpath=//*[@data-qa="zipcode"]').fill(newUser.zipcode)
  await page.locator('xpath=//*[@data-qa="mobile_number"]').fill(`${newUser.mobileNumber}`)
  await page.locator('xpath=//*[@data-qa="create-account"]').click()
  await expect(page.getByRole('heading', { name: 'ACCOUNT CREATED!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="continue-button"]').click()
  await expect(page.getByText(`Logged in as ${newUser.name}`, { exact: true })).toBeVisible()
  await page
    .locator('xpath=//div[contains(@class, "productinfo")]')
    .getByText('Add to cart').first().click()
  let itemName = await page
    .locator('xpath=//div[contains(@class, "productinfo")]')
    .getByRole('paragraph').first().textContent()
  let itemPrice = Number((await page
    .locator('xpath=//div[contains(@class, "productinfo")]')
    .getByRole('heading').first().textContent())?.substring(3))
  let itemQuantity = 1
  await page.getByRole('button', { name: 'Continue Shopping' }).click()
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Cart' }).click()
  await expect(page).toHaveURL('/view_cart')
  await page.getByText('Proceed To Checkout').click()
  await expect(page.getByRole('list').filter({ hasText: 'delivery address' })).toContainText(
    newUser.gender &&
    newUser.firstName &&
    newUser.lastName &&
    newUser.company &&
    newUser.address &&
    newUser.address2 &&
    newUser.city &&
    newUser.state &&
    newUser.zipcode &&
    newUser.country &&
    `${newUser.mobileNumber}`
  )
  await expect(page
    .locator('xpath=//td[@class="cart_description"]')).toContainText(`${itemName}`)
  await expect(page
    .locator('xpath=//td[@class="cart_price"]')).toContainText(`${itemPrice}`)
  await expect(page
    .locator('xpath=//td[@class="cart_quantity"]')).toContainText(`${itemQuantity}`)
  await expect(page
    .locator('xpath=//td[@class="cart_total"]')).toContainText(`${itemPrice * itemQuantity}`)
  await expect(page
    .getByRole('row').last()
    .locator('xpath=//p[@class="cart_total_price"]')).toContainText(`${itemPrice * itemQuantity}`)
  await page.getByRole('textbox').first().fill('Test description')
  await page.getByRole('link', { name: 'place order' }).click()
  await page.locator('xpath=//*[@data-qa="name-on-card"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="card-number"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="cvc"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="expiry-month"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="expiry-year"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="pay-button"]').click({ noWaitAfter: true })
  expect(page.locator('xpath=//div[@id="success_message"]')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Order placed' })).toBeVisible({})
  await page.getByRole('link', { name: 'continue' }).click()
  await expect(page).toHaveURL('/')
  await page.getByRole('link', { name: 'Delete Account' }).click()
  await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="continue-button"]').click()
  await expect(page).toHaveURL('/')
});


test('Test Case 16: Place Order: Login before Checkout', async ({ page }) => {
  await page.getByRole('link', { name: 'Signup / Login' }).click()
  await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="login-email"]').fill(correctUser.email)
  await page.locator('xpath=//*[@data-qa="login-password"]').fill(correctUser.password)
  await page.locator('xpath=//*[@data-qa="login-button"]').click()
  await expect(page.getByText(`Logged in as ${correctUser.name}`, { exact: true })).toBeVisible()
  await page
    .locator('xpath=//div[contains(@class, "productinfo")]')
    .getByText('Add to cart').first().click()
  let itemName = await page
    .locator('xpath=//div[contains(@class, "productinfo")]')
    .getByRole('paragraph').first().textContent()
  let itemPrice = Number((await page
    .locator('xpath=//div[contains(@class, "productinfo")]')
    .getByRole('heading').first().textContent())?.substring(3))
  let itemQuantity = 1
  await page.getByRole('button', { name: 'Continue Shopping' }).click()
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Cart' }).click()
  await expect(page).toHaveURL('/view_cart')
  await page.getByText('Proceed To Checkout').click()
  await expect(page.getByRole('list').filter({ hasText: 'delivery address' })).toContainText(
    newUser.gender &&
    newUser.firstName &&
    newUser.lastName &&
    newUser.company &&
    newUser.address &&
    newUser.address2 &&
    newUser.city &&
    newUser.state &&
    newUser.zipcode &&
    newUser.country &&
    `${newUser.mobileNumber}`
  )
  await expect(page
    .locator('xpath=//td[@class="cart_description"]')).toContainText(`${itemName}`)
  await expect(page
    .locator('xpath=//td[@class="cart_price"]')).toContainText(`${itemPrice}`)
  await expect(page
    .locator('xpath=//td[@class="cart_quantity"]')).toContainText(`${itemQuantity}`)
  await expect(page
    .locator('xpath=//td[@class="cart_total"]')).toContainText(`${itemPrice * itemQuantity}`)
  await expect(page
    .getByRole('row').last()
    .locator('xpath=//p[@class="cart_total_price"]')).toContainText(`${itemPrice * itemQuantity}`)
  await page.getByRole('textbox').first().fill('Test description')
  await page.getByRole('link', { name: 'place order' }).click()
  await page.locator('xpath=//*[@data-qa="name-on-card"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="card-number"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="cvc"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="expiry-month"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="expiry-year"]').fill(paymentData.cardName)
  await page.locator('xpath=//*[@data-qa="pay-button"]').click({ noWaitAfter: true })
  expect(page.locator('xpath=//div[@id="success_message"]')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Order placed' })).toBeVisible({})
  await page.getByRole('link', { name: 'continue' }).click()
  await expect(page).toHaveURL('/')
  await page.getByRole('link', { name: 'logout' }).click()
  await expect(page).toHaveURL('/login')
});


test('Test Case 17: Remove Products From Cart', async ({ page }) => {
  await page
    .locator('xpath=//div[contains(@class, "productinfo")]')
    .getByText('Add to cart').first().click()
  await page.getByRole('button', { name: 'Continue Shopping' }).click()
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Cart' }).click()
  await expect(page).toHaveURL('/view_cart')
  await page.locator('xpath=//td[@class="cart_delete"]/a').click()
  await expect(page.locator('xpath=//*[@id="empty_cart"]')).toBeVisible()
});