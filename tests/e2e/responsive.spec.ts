import { expect, test } from '@playwright/test';
import { VIEWPORTS, viewportKey } from '../viewports';

test.use({ reducedMotion: 'reduce' });

for (const viewport of VIEWPORTS) {
  for (const route of ['/', '/tickets']) {
    test(`${route} fits ${viewport.name} (${viewportKey(viewport)})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(route);
      expect(response?.ok()).toBe(true);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      await expect.poll(() => page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        return Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - width;
      })).toBeLessThanOrEqual(1);

      if (route === '/tickets') {
        await expect(page.getByText('Sold Out', { exact: true })).toBeVisible();
        await expect(page.getByText('Salford, Manchester M50 2HF, UK', { exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Get the App' })).toBeVisible();
      } else {
        await expect(page.getByRole('button', { name: 'Shuffle' })).toBeVisible();
        await expect(page.getByText('Frequently Asked Questions', { exact: true })).toBeVisible();
      }
    });
  }
}
