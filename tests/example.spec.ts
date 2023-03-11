import { test, expect } from '@playwright/test';
test.use({ baseURL: 'https://automationexercise.com/' })
test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/')
})

// async function deleteUser({ page }) {
//   await page.getByRole('link', { name: ' Delete Account' }).click()
//   await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
//   await page.locator('xpath=//a[@data-qa="continue-button"]').click()
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
  await page.locator('xpath=//input[@data-qa="signup-name"]').fill(newUser.name)
  await page.locator('xpath=//input[@data-qa="signup-email"]').fill(newUser.email)
  await page.locator('xpath=//button[@data-qa="signup-button"]').click()
  const IsExistingAccount = await page.getByText('Email Address already exist!').isVisible()
  if (IsExistingAccount) {
    await page.locator('xpath=//input[@data-qa="login-email"]').fill(newUser.email)
    await page.locator('xpath=//input[@data-qa="login-password"]').fill(newUser.password)
    await page.locator('xpath=//button[@data-qa="login-button"]').click()
    await page.getByRole('link', { name: 'Delete Account' }).click()
    await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
    await page.getByRole('link', { name: 'Signup / Login' }).click()
    await page.locator('xpath=//input[@data-qa="signup-name"]').fill(newUser.name)
    await page.locator('xpath=//input[@data-qa="signup-email"]').fill(newUser.email)
    await page.locator('xpath=//button[@data-qa="signup-button"]').click()
  }
  await expect(page.getByRole('heading', { name: 'ENTER ACCOUNT INFORMATION' })).toBeVisible()
  await page.locator(`xpath=//*[@data-qa="title" and @id="uniform-id_gender${newUser.gender}"]`).check()
  await page.locator('xpath=//input[@data-qa="password"]').fill(newUser.password)
  await page.locator('xpath=//select[@data-qa="days"]').selectOption(`${newUser.dateOfBirth.getDay()}`)
  await page.locator('xpath=//select[@data-qa="months"]').selectOption(`${newUser.dateOfBirth.toLocaleString("en-US", { month: "long" })}`)
  await page.locator('xpath=//select[@data-qa="years"]').selectOption(`${newUser.dateOfBirth.getFullYear()}`)
  if (newUser.newsletter)
    await page.getByRole('checkbox', { name: 'newsletter' }).check()
  if (newUser.offers)
    await page.getByRole('checkbox', { name: 'offers' }).check()
  await page.locator('xpath=//input[@data-qa="first_name"]').fill(newUser.name)
  await page.locator('xpath=//input[@data-qa="last_name"]').fill(newUser.name)
  await page.locator('xpath=//input[@data-qa="company"]').fill(newUser.name)
  await page.locator('xpath=//input[@data-qa="address"]').fill(newUser.name)
  await page.locator('xpath=//input[@data-qa="address2"]').fill(newUser.name)
  await page.locator('xpath=//select[@data-qa="country"]').selectOption(newUser.country)
  await page.locator('xpath=//input[@data-qa="state"]').fill(newUser.name)
  await page.locator('xpath=//input[@data-qa="city"]').fill(newUser.name)
  await page.locator('xpath=//input[@data-qa="zipcode"]').fill(newUser.name)
  await page.locator('xpath=//input[@data-qa="mobile_number"]').fill(newUser.name)
  await page.locator('xpath=//button[@data-qa="create-account"]').click()
  await expect(page.getByRole('heading', { name: 'ACCOUNT CREATED!' })).toBeVisible()
  await page.locator('xpath=//a[@data-qa="continue-button"]').click()
  await expect(page.getByText(`Logged in as ${newUser.name}`, { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Delete Account' }).click()
  await expect(page.getByRole('heading', { name: 'ACCOUNT DELETED!' })).toBeVisible()
  await page.locator('xpath=//a[@data-qa="continue-button"]').click()
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
  await page.locator('xpath=//input[@data-qa="login-email"]').fill(correctUser.email)
  await page.locator('xpath=//input[@data-qa="login-password"]').fill(correctUser.password)
  await page.locator('xpath=//button[@data-qa="login-button"]').click()
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
  await page.locator('xpath=//input[@data-qa="login-email"]').fill(incorrectUser.email)
  await page.locator('xpath=//input[@data-qa="login-password"]').fill(incorrectUser.password)
  await page.locator('xpath=//button[@data-qa="login-button"]').click()
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
  await page.locator('xpath=//input[@data-qa="signup-name"]').fill(correctUser.name)
  await page.locator('xpath=//input[@data-qa="signup-email"]').fill(correctUser.email)
  await page.locator('xpath=//button[@data-qa="signup-button"]').click()
  await expect(page.getByText('Email Address already exist!')).toBeVisible()
});
