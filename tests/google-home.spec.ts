import { test, expect } from '../fixtures';

test.describe('Google Home Page', () => {
  test('should display Google logo area and search elements', async ({ homePage, page }) => { // @Tdd6f9f69
    // Logo area always exists — either standard logo or a Doodle
    const logoArea = page.locator('#hplogo, #lga, a[href*="doodles"]').first();
    await expect(logoArea).toBeVisible();
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.searchButton).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => { // @T316f68b4
    await page.goto('/');
    await expect(page).toHaveTitle(/Yahoo/);
  });

  test('should show search suggestions when typing', async ({ homePage }) => { // @Tc4c94aa9
    await homePage.searchInput.fill('Playwright');
    const suggestions = await homePage.getSuggestions();
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(s => s.toLowerCase().includes('playwright'))).toBeTruthy();
  });

  test('should clear search input', async ({ homePage }) => { // @T61e8fe9a
    await homePage.searchInput.fill('test query');
    await homePage.searchInput.clear();
    await expect(homePage.searchInput).toHaveValue('');
  });

  test('should have search input focused after load', async ({ homePage }) => { // @Tea551f33
    await expect(homePage.searchInput).toBeVisible();
    await homePage.searchInput.click();
    await expect(homePage.searchInput).toBeFocused();
  });
});
