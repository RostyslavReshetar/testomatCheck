import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  // Google uses different selectors depending on layout — cover both
  readonly results: Locator;
  readonly resultLinks: Locator;
  readonly searchInput: Locator;
  readonly resultCount: Locator;
  readonly nextPageButton: Locator;
  readonly captchaFrame: Locator;

  constructor(page: Page) {
    super(page);
    this.results = page.locator('#search .g, #rso .g, #rso > div');
    this.resultLinks = page.locator('#search h3, #rso h3');
    this.searchInput = page.locator('textarea[name="q"], input[name="q"]');
    this.resultCount = page.locator('#result-stats');
    // Google removed "Next" pagination in favor of infinite scroll — cover both
    this.nextPageButton = page.locator('#pnnext, a[aria-label*="Далі"], a[aria-label*="Next"]');
    this.captchaFrame = page.frameLocator('iframe[src*="recaptcha"]').locator('body');
  }

  async isCaptchaVisible(): Promise<boolean> {
    const url = this.page.url();
    if (url.includes('/sorry/') || url.includes('sorry/index')) return true;
    return this.page.locator('#recaptcha, .g-recaptcha').isVisible({ timeout: 2000 })
      .catch(() => false);
  }

  async getResultTitles(): Promise<string[]> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    if (await this.isCaptchaVisible()) return [];
    await this.resultLinks.first().waitFor({ timeout: 15000 });
    return this.resultLinks.allInnerTexts();
  }

  async getResultCount(): Promise<string> {
    try {
      await this.resultCount.waitFor({ timeout: 8000 });
      return this.resultCount.innerText();
    } catch {
      // Google sometimes hides result count — return empty string, not a failure
      return '';
    }
  }

  async clickResult(index: number): Promise<void> {
    await this.resultLinks.nth(index).click();
  }

  async refineSearch(query: string): Promise<void> {
    await this.searchInput.waitFor({ timeout: 10000 });
    await this.searchInput.click({ clickCount: 3 });
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async hasNextPage(): Promise<boolean> {
    return this.nextPageButton.isVisible({ timeout: 3000 }).catch(() => false);
  }
}
