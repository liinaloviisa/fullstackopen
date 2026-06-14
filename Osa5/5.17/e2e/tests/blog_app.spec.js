const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test user',
        username: 'password',
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
})
