import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('all questions respond to keyboard and expand their answers', async ({ page }) => {
  await page.goto('/');
  const toggles = page.locator('[data-accordion-toggle]');
  await expect.poll(() => toggles.count()).toBeGreaterThanOrEqual(5);

  for (const toggle of await toggles.all()) {
    await expect(toggle).toBeVisible();
    const initial = await toggle.getAttribute('aria-expanded');
    expect(['true', 'false']).toContain(initial);
    await toggle.focus();
    await toggle.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', initial === 'true' ? 'false' : 'true');
    await toggle.press('Space');
    await expect(toggle).toHaveAttribute('aria-expanded', initial ?? 'false');
  }
});

test('the discount FAQ opens its local ticket link', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Can I have a discount?' });
  if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
  const faq = page.locator('#faq');
  const ticketLink = faq.getByRole('link', { name: 'Buy Tickets' });
  await expect(ticketLink).toBeVisible();
  await expect(ticketLink).toHaveAttribute('href', '/tickets');
  await ticketLink.click();
  await expect(page).toHaveURL(/\/tickets\/?$/);
});
