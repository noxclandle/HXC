import { test, expect } from '@playwright/test';

test('diagnose live page for JS errors and check visibility', async ({ page }) => {
  const errors: Error[] = [];
  const consoleMessages: string[] = [];

  page.on('pageerror', (err) => {
    errors.push(err);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });

  console.log('=== Starting Diagnosis for https://virtual-business-card.hexa-relation.com/ ===');
  
  await page.goto('https://virtual-business-card.hexa-relation.com/', {
    waitUntil: 'networkidle',
  });

  console.log('JS Errors:', errors);
  console.log('Console Errors:', consoleMessages);

  const h1Text = await page.locator('h1').textContent();
  console.log('Detected H1 Header:', h1Text);

  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  console.log('Body HTML length:', bodyHTML.length);

  await page.screenshot({ path: 'live-page-screenshot.png' });
  console.log('Captured screenshot in root directory: live-page-screenshot.png');

  expect(errors.length).toBe(0);
});
