const { test, expect, beforeEach, describe } = require('@playwright/test')

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
})
