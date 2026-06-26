import { test, expect } from '../fixtures';
import { SEARCH_QUERIES, EXPECTED_RESULTS } from '../data/searchQueries';

// Helper to skip test if Google blocks with CAPTCHA
async function skipIfCaptcha(searchResultsPage: any) {
  if (await searchResultsPage.isCaptchaVisible()) {
    test.skip(true, 'Google CAPTCHA triggered — IP blocked. Re-run with a logged-in session or from a different network.');
  }
}

test.describe('Google Search', () => {
  test('should navigate to results page after search', async ({ homePage, page }) => { // @Td505da1c
    await homePage.search(SEARCH_QUERIES.simple);
    // Accept both normal results and sorry (CAPTCHA) page as "navigated"
    await expect(page).toHaveURL(/google\.com\/(search|sorry)/);
  });

  test('should display relevant results for query', async ({ homePage, searchResultsPage }) => { // @Tdd6f7d4c
    await homePage.search(SEARCH_QUERIES.simple);
    await skipIfCaptcha(searchResultsPage);

    const titles = await searchResultsPage.getResultTitles();
    expect(titles.length).toBeGreaterThan(0);

    const hasRelevantResult = titles.some(title =>
      EXPECTED_RESULTS.playwright.some(keyword =>
        title.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    expect(hasRelevantResult).toBeTruthy();
  });

  test('should show result statistics or results', async ({ homePage, searchResultsPage }) => { // @T83d43c7f
    await homePage.search(SEARCH_QUERIES.simple);
    await skipIfCaptcha(searchResultsPage);

    const count = await searchResultsPage.getResultCount();
    const titles = await searchResultsPage.getResultTitles();
    const hasResults = (count && count.match(/\d/)) || titles.length > 0;
    expect(hasResults).toBeTruthy();
  });

  test('should support Ukrainian language search', async ({ homePage, searchResultsPage }) => { // @T3c6b1c5c
    await homePage.search(SEARCH_QUERIES.ukrainian);
    await skipIfCaptcha(searchResultsPage);

    const titles = await searchResultsPage.getResultTitles();
    expect(titles.length).toBeGreaterThan(0);

    const hasUkrainianResult = titles.some(title =>
      EXPECTED_RESULTS.ukrainian.some(keyword =>
        title.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    expect(hasUkrainianResult).toBeTruthy();
  });

  test('should allow refining search query', async ({ homePage, searchResultsPage, page }) => { // @T2016ff51
    await homePage.search('Playwright');
    await skipIfCaptcha(searchResultsPage);

    await searchResultsPage.refineSearch('Playwright Python');
    await expect(page).toHaveURL(/q=Playwright/i);
  });

  test('should navigate to next page of results', async ({ homePage, searchResultsPage }) => { // @T25bada31
    await homePage.search(SEARCH_QUERIES.simple);
    await skipIfCaptcha(searchResultsPage);

    const hasNext = await searchResultsPage.hasNextPage();
    if (!hasNext) {
      test.skip(true, 'Google uses infinite scroll on this session — no explicit Next button');
    }

    await searchResultsPage.nextPageButton.click();
    await searchResultsPage.resultLinks.first().waitFor({ timeout: 15000 });
    const titles = await searchResultsPage.getResultTitles();
    expect(titles.length).toBeGreaterThan(0);
  });
});
