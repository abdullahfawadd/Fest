import { expect, test } from '@playwright/test';

const officialEvent = 'https://luma.com/aq1a429h';

test('event details, cover, hosts, location and sold-out message are rendered', async ({ page }) => {
  await page.goto('/tickets', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: /FlowFest ['’]25/i })).toBeVisible();

  const cover = page.getByRole('img', { name: /cover image for flowfest/i }).first();
  await expect(cover).toBeVisible();
  await expect.poll(() => cover.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);

  for (const name of ['Isabel', 'Benn Raistrick', 'Rachael Ward', 'Joshua Fry', 'Scott Humphrey']) {
    const host = page.getByRole('link', { name, exact: true });
    await expect(host.first()).toBeVisible();
  }
  const hosts = page.getByText('Hosted By', { exact: true });
  await expect(hosts).toHaveCount(2);
  await expect(hosts.filter({ visible: true })).toBeVisible();
  await expect(page.getByText('120 Went', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Dennis Snellenberg, Lizzie Curtis and 118 others/).first()).toBeVisible();
  await expect(page.getByText('Get Tickets', { exact: true })).toBeVisible();
  await expect(page.getByText('Sold Out', { exact: true })).toBeVisible();
  await expect(page.getByText('This event is sold out and no longer taking registrations.')).toBeVisible();
  await expect(page.getByText('About Event', { exact: true })).toBeVisible();
  await expect(page.getByText('Location', { exact: true })).toBeVisible();
  await expect(page.getByText('Salford, Manchester M50 2HF, UK')).toBeVisible();
  await expect(page.getByRole('link', { name: /watch on youtube/i })).toHaveAttribute('href', /0njOFCPorQc/);
  await expect(page.locator('input[type="password"], input[autocomplete="cc-number"]')).toHaveCount(0);
});

test('event, account, map and footer actions target official destinations', async ({ page }) => {
  await page.goto('/tickets', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'Discover Events' })).toHaveAttribute('href', 'https://luma.com/discover');
  await expect(page.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', /^https:\/\/luma\.com\//);
  await expect(page.getByRole('link', { name: 'Contact the Host' }).first()).toHaveAttribute('href', officialEvent);
  await expect(page.getByRole('link', { name: 'Report Event' }).first()).toHaveAttribute('href', officialEvent);
  await expect(page.getByRole('link', { name: /Blue Peter Garden|View on Google Maps/i }).first())
    .toHaveAttribute('href', /^https:\/\/www\.google\.com\/maps\//);
  await expect(page.getByRole('link', { name: 'Pricing', exact: true })).toHaveAttribute('href', 'https://luma.com/pricing');
  await expect(page.getByRole('link', { name: 'Help', exact: true })).toHaveAttribute('href', /^https:\/\/help\.luma\.com/);
  await expect(page.getByRole('link', { name: 'Get the App' })).toHaveAttribute('href', 'https://luma.com/app');
  await expect(page.locator('a[href="mailto:support@luma.com"]')).toBeAttached();
});

test('the host and attendee details move into view on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tickets', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Hosted By', { exact: true }).filter({ visible: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Scott Humphrey', exact: true }).first()).toBeVisible();
  await expect(page.getByText('120 Went', { exact: true }).filter({ visible: true })).toBeVisible();
});
