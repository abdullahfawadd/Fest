import { expect, test } from '@playwright/test';

test('newsletter validates inputs and submits to the official Mailchimp destination', async ({ page, context }) => {
  await page.goto('/');
  const submit = page.getByRole('button', { name: /get updates/i });
  const form = page.locator('form').filter({ has: submit });
  await expect(form).toBeVisible();
  await expect(form).toHaveAttribute('action', /^https:\/\/webflow\.us21\.list-manage\.com\/subscribe\/post\?/i);
  const email = form.locator('input[type="email"]');
  const name = form.locator('input[name="FNAME"]');
  await expect(email).toBeVisible();
  await expect(name).toBeVisible();
  await expect(email).toHaveAttribute('name', 'EMAIL');

  await email.fill('invalid-email');
  await submit.click();
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);

  let submittedFields: URLSearchParams | undefined;
  await context.route(/^https:\/\/webflow\.us21\.list-manage\.com\/subscribe\/post\?/i, async (route) => {
    expect(route.request().method()).toBe('POST');
    submittedFields = new URLSearchParams(route.request().postData() ?? '');
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<p>Newsletter provider intercepted for testing.</p>',
    });
  });

  await name.fill('Playwright Fixture');
  await email.fill('newsletter-fixture@example.com');
  await submit.click();
  await expect.poll(() => submittedFields?.get('EMAIL')).toBe('newsletter-fixture@example.com');
  expect(submittedFields?.get('FNAME')).toBe('Playwright Fixture');
});
