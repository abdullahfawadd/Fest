import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('main navigation targets the correct sections', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation').first();
  const targets = [
    { name: 'About', heading: /The No\.1 Fest for/i },
    { name: 'Speakers', heading: /2025 speaker lineup/i },
    { name: 'Activities', heading: /what to expect/i },
  ];

  for (const { name, heading } of targets) {
    await navigation.getByText(name, { exact: true }).click();
    await expect(page.getByRole('heading', { name: heading })).toBeInViewport();
  }
});

test('speaker, activity, team, testimonial and footer content are present', async ({ page }) => {
  await page.goto('/');
  for (const name of [
    'Vlad Magdalin', 'Ilja van Eck', 'Cassie Evans', 'Stephanie Bruce', 'Ross Plaskow',
    'Expert Talks', 'Fun + Games', 'Food + Drink', 'Live Music',
    'Isabel Edwards', 'Josh Fry', 'Benn Raistrick', 'Scott Humphrey', 'Rachael Ward', 'John Ostler',
  ]) {
    await expect(page.getByText(name, { exact: true }).first()).toBeAttached();
  }

  await expect(page.getByRole('heading', { name: /FlowFest Love/i })).toBeVisible();
  const footer = page.locator('footer').first();
  await expect(footer).toBeVisible();
  await expect(footer.locator('a[href^="mailto:"]').first()).toBeAttached();
});
