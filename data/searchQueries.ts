export const SEARCH_QUERIES = {
  simple: 'Playwright testing',
  ukrainian: 'автоматизоване тестування',
  withSpecialChars: 'C++ programming',
  emptyLike: '   ',
} as const;

export const EXPECTED_RESULTS = {
  playwright: ['Playwright', 'playwright', 'Microsoft', 'testing'],
  ukrainian: ['тестування', 'тест', 'автоматиза'],
} as const;
