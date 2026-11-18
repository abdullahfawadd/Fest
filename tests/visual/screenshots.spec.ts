import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { PNG } from 'pngjs';
import { SECTION_VIEWPORT_WIDTHS, VIEWPORTS, VISUAL_SECTIONS, viewportKey } from '../viewports';

const screenshotOptions = {
  animations: 'disabled',
  caret: 'hide',
  scale: 'css',
} as const;

function contentCard(page: Page, label: string, inlineSelector: string) {
  return page.locator(inlineSelector).or(
    page.getByText(label, { exact: true })
      .locator('xpath=ancestor::*[contains(concat(" ", normalize-space(@class), " "), " content-card ")][1]'),
  ).filter({ visible: true }).first();
}

function sectionsFor(page: Page, site: 'flowfest' | 'luma'): Record<string, Locator> {
  if (site === 'flowfest') {
    return {
      hero: page.locator('section.welcome, [data-visual-section="hero"]').first(),
      sponsors: page.locator('section.logo-marquee, [data-visual-section="sponsors"]').first(),
      about: page.locator('#about'),
      speakers: page.locator('#speakers'),
      activities: page.locator('#activities'),
      community: page.locator('section.community, #community').first(),
      testimonials: page.locator('section.tweets, #testimonials').first(),
      faq: page.locator('section.faq, #faq').first(),
      tickets: page.locator('section.prefooter, [data-visual-section="tickets"]').first(),
      footer: page.locator('footer').first(),
    };
  }

  return {
    cover: page.getByRole('img', { name: /cover image for flowfest/i }).first(),
    hosts: contentCard(page, 'Hosted By', '[data-visual-section="hosts"]'),
    attendance: contentCard(page, '120 Went', '[data-visual-section="attendance"]'),
    title: page.getByRole('heading', { level: 1, name: /FlowFest ['’]25/ }),
    tickets: page.locator('[data-visual-section="tickets"]').or(page
      .getByText('Get Tickets', { exact: true })
      .locator('xpath=ancestor::*[contains(concat(" ", normalize-space(@class), " "), " relative ")][1]'))
      .filter({ visible: true }).first(),
    about: contentCard(page, 'About Event', '[data-visual-section="about"]'),
    location: contentCard(page, 'Location', '[data-visual-section="location"]'),
    footer: page.locator('footer').first(),
  };
}

const targets = [
  {
    name: 'flowfest',
    reference: 'https://www.flowfest.co.uk/',
    local: '/',
    heading: /Webflow chat, festival vibes, good times\./i,
  },
  {
    name: 'luma',
    reference: 'https://luma.com/aq1a429h',
    local: '/tickets',
    heading: /FlowFest ['’]25/,
  },
] as const;

async function warmLazyContent(page: Page) {
  const { step, maxScroll } = await page.evaluate(() => ({
    step: Math.max(1, Math.floor(window.innerHeight * 0.8)),
    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
  }));
  for (let offset = step; offset <= maxScroll + step; offset += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), Math.min(offset, maxScroll));
    await page.waitForTimeout(40);
  }
  await page.evaluate(async () => {
    await Promise.race([
      Promise.allSettled(Array.from(document.images, (image) => image.decode())),
      new Promise<void>((resolve) => setTimeout(resolve, 2200)),
    ]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(600);
}

async function captureSections(page: Page, site: 'flowfest' | 'luma', screenshot: Buffer, output: string) {
  const full = PNG.sync.read(screenshot);

  const sections = sectionsFor(page, site);
  for (const name of VISUAL_SECTIONS[site]) {
    const locator = sections[name];
    const box = await locator.boundingBox({ timeout: 12_000 });
    expect.soft(box, `${site} ${name} did not render`).not.toBeNull();
    if (!box) continue;

    const x = Math.max(0, Math.floor(box.x));
    const y = Math.max(0, Math.floor(box.y));
    const width = Math.min(full.width - x, Math.ceil(box.x + box.width) - x);
    const height = Math.min(full.height - y, Math.ceil(box.y + box.height) - y);
    expect.soft(Math.min(width, height), `${site} ${name} was outside the capture`).toBeGreaterThan(0);
    if (width <= 0 || height <= 0) continue;

    const section = new PNG({ width, height });
    PNG.bitblt(full, section, x, y, width, height, 0, 0);
    await writeFile(join(output, `section-${name}.png`), PNG.sync.write(section));
  }
}

const requestedTarget = process.env.PLAYWRIGHT_VISUAL_TARGET ?? 'both';
if (!['reference', 'local', 'both'].includes(requestedTarget)) {
  throw new Error('PLAYWRIGHT_VISUAL_TARGET must be reference, local, or both.');
}

for (const target of targets) {
  for (const viewport of VIEWPORTS) {
    for (const kind of ['reference', 'local'] as const) {
      if (requestedTarget !== 'both' && requestedTarget !== kind) continue;

      test(`${kind} ${target.name} ${viewportKey(viewport)}`, async ({ page }) => {
        test.setTimeout(120_000);
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        if (target.name === 'luma') {
          await page.clock.setFixedTime(new Date('2026-11-19T12:00:00Z'));
        }
        const response = await page.goto(target[kind], { waitUntil: 'domcontentloaded' });
        expect(response?.ok()).toBe(true);
        // The reference splits the hero heading into adjacent word spans.
        const heading = page.locator('h1').filter({ hasText: target.heading });
        await expect(heading).toBeVisible({ timeout: 45_000 });
        await page.evaluate(() => Promise.race([
          document.fonts.ready,
          new Promise<void>((resolve) => setTimeout(resolve, 6000)),
        ]).then(() => undefined));
        await page.waitForTimeout(target.name === 'flowfest' ? 5000 : 800);

        const output = join('visual-qa', kind, target.name, viewportKey(viewport));
        await mkdir(output, { recursive: true });
        await page.screenshot({ ...screenshotOptions, path: join(output, 'viewport.png') });

        await warmLazyContent(page);
        const full = await page.screenshot({ ...screenshotOptions, fullPage: true, path: join(output, 'full-page.png') });

        if (SECTION_VIEWPORT_WIDTHS.has(viewport.width)) {
          await captureSections(page, target.name, full, output);
        }
      });
    }
  }
}
