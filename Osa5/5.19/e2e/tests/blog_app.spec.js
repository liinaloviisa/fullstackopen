const { test, expect, beforeEach, describe } = require('@playwright/test')

test('database reset works', async ({ request }) => {

  console.log('Current environment in tests: ', process.env.NODE_ENV)
  //console.log("Test for resetting database")
  const response = await request.post('http://localhost:3003/api/testing/reset')
  console.log('Response from reset: ', response.status());
  expect(response.status()).toBe(204)

  //await request.post('http://localhost:3003/api/testing/reset')

  //const blogs = await response.json()
  //expect(blogs).toEqual([])
})

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test user',
        username: 'username',
        password: 'secret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('log in to application')
    await expect(locator).toBeVisible()

    const loginButton = page.getByRole('button', {name: 'log in'})
    await expect(loginButton).toBeVisible()

    await loginButton.click()

    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {

    const loginButton = page.getByRole('button', {name: 'log in'})
    await expect(loginButton).toBeVisible()

    await loginButton.click()

    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
      
    await page.locator('input').first().fill('username')

    await page.locator('input[type="password"]').first().fill('secret')

    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('blogs')).toBeVisible()
    await expect(page.getByText('Test user')).toBeVisible()
    await expect(page.getByText('logged in')).toBeVisible()
    await expect(page.getByText('create new')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {

    const loginButton = page.getByRole('button', {name: 'log in'})
    await expect(loginButton).toBeVisible()

    await loginButton.click()

    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
      
    await page.locator('input').first().fill('wrong_username')

    await page.locator('input[type="password"]').first().fill('wrong_password')

    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {

      await request.post('http://localhost:3003/api/testing/reset')

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Test user',
          username: 'username',
          password: 'secret'
        }
      })

      await page.goto('http://localhost:5173')

      const loginButton = page.getByRole('button', {name: 'log in'})
      await loginButton.click()

      await page.locator('input').first().fill('username')

      await page.locator('input[type="password"]').first().fill('secret')

      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      
      await page.getByLabel('title').fill('Test title')
      await page.getByLabel('author').fill('Test author')

      const buttons = page.getByRole('button')
      await buttons.nth(1).click()

      await expect(page.getByText('a new blog "Test title" added')).toBeVisible()

      await expect(page.getByText('Test title Test author')).toBeVisible()
      
    })
  })
})
