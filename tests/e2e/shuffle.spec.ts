import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

function readCards(page: Page) {
  return page.locator('[data-stacked-cards-list] > [data-stacked-cards-item]').evaluateAll((items) =>
    items.map((item) => {
      const card = item.querySelector('[data-stacked-cards-card]') ?? item;
      const image = card.querySelector('img');
      return image?.getAttribute('src') ?? card.textContent?.trim();
    }),
  );
}

test('Shuffle changes the card composition on repeated activation', async ({ page }) => {
  await page.goto('/');
  const control = page.getByRole('button', { name: 'Shuffle' });
  await expect(control).toBeVisible({ timeout: 12_000 });
  const first = await readCards(page);
  expect(first.length).toBeGreaterThanOrEqual(5);

  await control.click();
  await expect.poll(() => readCards(page)).not.toEqual(first);
  const second = await readCards(page);

  await control.focus();
  await control.press('Enter');
  await expect.poll(() => readCards(page)).not.toEqual(second);
});

test('Shuffle still responds with reduced motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const first = await readCards(page);
  await page.getByRole('button', { name: 'Shuffle' }).click();
  await expect.poll(() => readCards(page)).not.toEqual(first);
});
