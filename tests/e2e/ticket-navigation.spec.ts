import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function expectEvent(page: Page) {
  await expect(page).toHaveURL(/\/tickets\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: /FlowFest ['’]25/i })).toBeVisible();
  await expect(page.getByText('Sold Out', { exact: true })).toBeVisible();
}

test.use({ reducedMotion: 'reduce' });

test('every visible Buy Tickets link opens the local event page', async ({ page }) => {
  await page.goto('/');
  const ticketLinks = page.getByRole('link', { name: 'Buy Tickets', exact: true });
  await expect.poll(() => ticketLinks.count()).toBeGreaterThanOrEqual(4);
  const count = await ticketLinks.count();
  const exercised: number[] = [];

  for (let index = 0; index < count; index += 1) {
    await page.goto('/');
    const link = ticketLinks.nth(index);
    await expect(link).toHaveAttribute('href', '/tickets');

    if (!await link.isVisible()) {
      const faq = page.getByText('Can I have a discount?', { exact: true });
      if (await faq.isVisible()) await faq.click();
    }

    if (await link.isVisible()) {
      await link.click();
      await expectEvent(page);
      exercised.push(index);
    }
  }

  expect(exercised.length).toBeGreaterThanOrEqual(4);
  await page.goBack();
  await expect(page.getByRole('button', { name: 'Shuffle' })).toBeVisible();
});

test('direct ticket entry, refresh and a copied URL work', async ({ page, browser }) => {
  await page.goto('/tickets');
  await expectEvent(page);
  await page.reload();
  await expectEvent(page);

  const freshContext = await browser.newContext();
  try {
    const freshPage = await freshContext.newPage();
    await freshPage.goto(page.url());
    await expectEvent(freshPage);
  } finally {
    await freshContext.close();
  }
});
