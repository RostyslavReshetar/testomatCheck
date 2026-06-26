import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class GoogleHomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly feelingLuckyButton: Locator;
  readonly googleLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole('combobox', { name: 'Пошук' }).or(
      page.getByRole('combobox', { name: 'Search' })
    );
    this.searchButton = page.getByRole('button', { name: 'Пошук Google' }).or(
      page.getByRole('button', { name: 'Google Search' })
    );
    this.feelingLuckyButton = page.getByRole('button', { name: 'Мені пощастить!' }).or(
      page.getByRole('button', { name: "I'm Feeling Lucky" })
    );
    // Covers both regular logo and daily Doodles
    this.googleLogo = page.locator('#hplogo, #lga img, a[href*="google.com/doodles"] img').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
    await this.dismissCookieBanner();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(query);
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.searchInput.press('Enter'),
    ]);
  }

  async getSuggestions(): Promise<string[]> {
    const suggestions = this.page.locator('ul[role="listbox"] li');
    await suggestions.first().waitFor({ timeout: 5000 });
    return suggestions.allInnerTexts();
  }

  private async dismissCookieBanner(): Promise<void> {
    const acceptButton = this.page.getByRole('button', { name: /Accept all|Прийняти все/i });
    if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptButton.click();
    }
  }
}
