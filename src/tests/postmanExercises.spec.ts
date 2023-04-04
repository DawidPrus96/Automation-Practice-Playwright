// example.spec.ts
import { test, expect } from '@playwright/test';
import { AutomationTools } from '../pages/automationtoolsAPI.page';
test('API 1: Get All Products List', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  await playwrightDev.getAllProducts()
});
test('API 2: POST To All Products List', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  await playwrightDev.postProduct()
});
test('API 3: Get All Brands List', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  await playwrightDev.getAllBrands()
});
test('API 4: PUT To All Brands List', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  await playwrightDev.putBrand()
});
test('API 5: POST To Search Product', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  await playwrightDev.postSearchProduct('top')
});
test('API 6: POST To Search Product without search_product parameter', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  await playwrightDev.postSearchProductWithoutParameter()
});
test('API 7: POST To Verify Login with valid details', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  const credentials = {
    name: 'API07Name',
    email: 'API07@Email.Address',
    password: 'zaq1@WSX',
  }
  let response = await playwrightDev.postLogin(credentials)
  expect(response.responseCode).toEqual(200)
  expect(response.message).toBe('User exists!')
});
test('API 8: POST To Verify Login without email parameter', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  const credentials = {
    name: 'API08Name',
    email: 'API08@Email.Address',
    password: 'zaq1@WSX',
  }
  await playwrightDev.postLoginWithoutParameter(credentials)
});
test('API 9: DELETE To Verify Login', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  await playwrightDev.deleteVerifyLogin()
});
test('API 10: POST To Verify Login with invalid details', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  const credentials = {
    name: 'invalidName',
    email: 'invalidEmail@address.pl',
    password: 'invalidPassword',
  }
  let response = await playwrightDev.postLogin(credentials)
  expect(response.responseCode).toEqual(404)
  expect(response.message).toBe('User not found!')
});
test('API 11: POST To Create/Register User Account', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  const user = {
    name: 'API11Name',
    email: 'API11@Email.Address',
    password: 'zaq1@WSX',
    title: 'Mr', // Mr. or Mrs.
    dateOfBirth: new Date("1996-02-16"),
    firstname: 'testFirstname',
    lastname: 'testLastName',
    company: 'testCompany',
    address1: 'testAddress',
    address2: 'testAddress2',
    country: 'United States',
    state: 'testState',
    city: 'testCity',
    zipcode: 'testZipcode',
    mobile_number: 0,
  }
  try {
    let response = await playwrightDev.deleteAccount(user)
    expect(response.responseCode).toEqual(200)
    expect(response.message).toBe('Account deleted!')
  }
  catch (err) {
    console.log('konta już nie było, więc można tworzyć')
  }
  finally {
    let response = await playwrightDev.postCreateAccount(user)
    expect(response.responseCode).toEqual(201)
    expect(response.message).toBe('User created!')
  }
}
)
test('API 12: DELETE METHOD To Delete User Account', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  const user = {
    name: 'API12Name',
    email: 'API12@Email.Address',
    password: 'zaq1@WSX',
    title: 'Mr', // Mr. or Mrs.
    dateOfBirth: new Date("1996-02-16"),
    firstname: 'testFirstname',
    lastname: 'testLastName',
    company: 'testCompany',
    address1: 'testAddress',
    address2: 'testAddress2',
    country: 'United States',
    state: 'testState',
    city: 'testCity',
    zipcode: 'testZipcode',
    mobile_number: 0,
  }
  try {
    let response = await playwrightDev.postCreateAccount(user)
    expect(response.responseCode).toEqual(201)
    expect(response.message).toBe('User created!')
  }
  catch (err) {
    console.log('konto już jest, więc można usuwać')
  }
  finally {
    let response = await playwrightDev.deleteAccount(user)
    expect(response.responseCode).toEqual(200)
    expect(response.message).toBe('Account deleted!')
  }
})
test('API 13: PUT METHOD To Update User Account', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  const user = {
    name: 'API13Name',
    email: 'API13@Email.Address',
    password: 'zaq1@WSX',
    title: 'Mr', // Mr. or Mrs.
    dateOfBirth: new Date("1996-02-16"),
    firstname: 'testFirstname',
    lastname: 'testLastName',
    company: 'testCompany',
    address1: 'testAddress',
    address2: 'testAddress2',
    country: 'United States',
    state: 'testState',
    city: 'testCity',
    zipcode: 'testZipcode',
    mobile_number: 0,
  }
  await playwrightDev.putAccountDetails(user)
})

test('API 14: GET user account detail by email', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  const email = 'API14@Email.Address'
  let response = await playwrightDev.getDetailsByMail(email)
  expect(response.responseCode).toEqual(200)
  expect(response.user).toBeTruthy()
})