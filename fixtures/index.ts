import { test as base } from '@playwright/test';
import { GoogleHomePage } from '../pages/GoogleHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

type PageFixtures = {
  homePage: GoogleHomePage;
  searchResultsPage: SearchResultsPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new GoogleHomePage(page);
    await homePage.goto();
    await use(homePage);
  },

  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
});

export { expect } from '@playwright/test';
