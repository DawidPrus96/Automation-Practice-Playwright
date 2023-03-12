import { test, expect } from '@playwright/test';
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

// async function deleteUser({ page }) {
//   await page.getByRole('link', { name: ' Delete Account' }).click()
//   await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
//   await page.locator('xpath=//*[@data-qa="continue-button"]').click()
// }

test('Test Case 1: Register User', async ({ page }) => {
  const newUser = {
    name: 'testName',
    email: 'test@Email.Address',
    gender: 1, // 1 - male , 2 - female
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
  // deleteUser({ page })
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
  await page.locator(`xpath=//*[@data-qa="title" and @id="uniform-id_gender${newUser.gender}"]`).check()
  await page.locator('xpath=//*[@data-qa="password"]').fill(newUser.password)
  await page.locator('xpath=//*[@data-qa="days"]').selectOption(`${newUser.dateOfBirth.getDay()}`)
  await page.locator('xpath=//*[@data-qa="months"]').selectOption(`${newUser.dateOfBirth.toLocaleString("en-US", { month: "long" })}`)
  await page.locator('xpath=//*[@data-qa="years"]').selectOption(`${newUser.dateOfBirth.getFullYear()}`)
  if (newUser.newsletter)
    await page.getByRole('checkbox', { name: 'newsletter' }).check()
  if (newUser.offers)
    await page.getByRole('checkbox', { name: 'offers' }).check()
  await page.locator('xpath=//*[@data-qa="first_name"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="last_name"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="company"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="address"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="address2"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="country"]').selectOption(newUser.country)
  await page.locator('xpath=//*[@data-qa="state"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="city"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="zipcode"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="mobile_number"]').fill(newUser.name)
  await page.locator('xpath=//*[@data-qa="create-account"]').click()
  await expect(page.getByRole('heading', { name: 'ACCOUNT CREATED!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="continue-button"]').click()
  await expect(page.getByText(`Logged in as ${newUser.name}`, { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Delete Account' }).click()
  await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="continue-button"]').click()
  // deleteUser({ page })
  await expect(page).toHaveURL('/')
});

test('Test Case 2: Login User with correct email and password with TC004 instead of account deletion', async ({ page }) => {
  const correctUser = {
    name: 'correctName',
    email: 'correct@mail.address',
    password: 'correctPassword',
  }
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
  const incorrectUser = {
    name: 'incorrectName',
    email: 'incorrect@email.address',
    password: 'incorrectPassword',
  }
  await page.getByRole('link', { name: 'Signup / Login' }).click()
  await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="login-email"]').fill(incorrectUser.email)
  await page.locator('xpath=//*[@data-qa="login-password"]').fill(incorrectUser.password)
  await page.locator('xpath=//*[@data-qa="login-button"]').click()
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible()
});
test('Test Case 5: Register User with existing email', async ({ page }) => {
  const correctUser = {
    name: 'correctName',
    email: 'correct@mail.address',
    password: 'correctPassword',
  }
  await page.getByRole('link', { name: 'Signup / Login' }).click()
  await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="signup-name"]').fill(correctUser.name)
  await page.locator('xpath=//*[@data-qa="signup-email"]').fill(correctUser.email)
  await page.locator('xpath=//*[@data-qa="signup-button"]').click()
  await expect(page.getByText('Email Address already exist!')).toBeVisible()
});
test('Test Case 6: Contact Us Form', async ({ page }) => {
  const correctUser = {
    name: 'correctName',
    email: 'correct@mail.address',
    subject: 'correctSubject',
    message: 'correct message'
  }
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  await page.getByRole('link', { name: 'Contact us' }).click()
  await expect(page.getByRole('heading', { name: 'GET IN TOUCH' })).toBeVisible()
  await page.locator('xpath=//*[@data-qa="name"]').fill(correctUser.name)
  await page.locator('xpath=//*[@data-qa="email"]').fill(correctUser.email)
  await page.locator('xpath=//*[@data-qa="subject"]').fill(correctUser.subject)
  await page.locator('xpath=//*[@data-qa="message"]').fill(correctUser.message)
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
  await page.locator('xpath=//div[@class="product-image-wrapper"]').getByRole('link', { name: 'view product' }).first().click()
  await expect(page).toHaveURL(/\/product_details\//)
  let productDetails = page.locator('xpath=//div[@class="product-information"]')
  await expect(productDetails.getByRole('heading')).toBeVisible()
  await expect(productDetails.getByText('Category')).toBeVisible()
  await expect(productDetails.getByText('Rs. ')).toBeVisible()
  await expect(productDetails.getByText('Availability: ')).toBeVisible()
  await expect(productDetails.getByText('Condition: ')).toBeVisible()
  await expect(productDetails.getByText('Brand: ')).toBeVisible()
});