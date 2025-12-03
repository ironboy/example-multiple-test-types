import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('homepage loads and shows products heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Our products' })).toBeVisible();
  });

  test('can navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About us' }).click();
    await expect(page.getByRole('heading', { name: 'About us' })).toBeVisible();
    await expect(page).toHaveURL(/about-us/);
  });

  test('products page has category filter', async ({ page }) => {
    await page.goto('/');
    const categorySelect = page.locator('select').filter({ hasText: /All \(\d+\)/ });
    await expect(categorySelect).toBeVisible();
  });

  test('products page has sort options', async ({ page }) => {
    await page.goto('/');
    const sortSelect = page.locator('select').filter({ hasText: 'Price' });
    await expect(sortSelect).toBeVisible();
  });
});
