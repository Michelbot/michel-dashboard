import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const screenshotsDir = join(__dirname, '..', 'screenshots');

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to app...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Screenshot 1: Initial desktop view
    console.log('Taking screenshot: feature-8-desktop-full.png');
    await page.screenshot({
      path: join(screenshotsDir, 'feature-8-desktop-full.png'),
      fullPage: false,
    });

    // Screenshot 2: Click on first task to open modal
    console.log('Taking screenshot: feature-5-task-modal.png');
    const firstTask = page.locator('[role="button"][aria-roledescription="sortable"]').first();
    await firstTask.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(screenshotsDir, 'feature-5-task-modal.png'),
      fullPage: false,
    });

    // Screenshot 3: Edit mode - click on title input
    console.log('Taking screenshot: feature-5-edit-mode.png');
    await page.locator('input[type="text"]').first().click();
    await page.keyboard.type(' - Updated');
    await page.waitForTimeout(300);
    await page.screenshot({
      path: join(screenshotsDir, 'feature-5-edit-mode.png'),
      fullPage: false,
    });

    // Close modal with ESC
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Screenshot 4: Click + button to open Add Task modal
    console.log('Taking screenshot: feature-6-add-modal.png');
    const addButton = page.locator('button[aria-label="Add new task"]').first();
    await addButton.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(screenshotsDir, 'feature-6-add-modal.png'),
      fullPage: false,
    });

    // Screenshot 5: Try to submit without title (validation error)
    console.log('Taking screenshot: feature-6-validation-error.png');
    const createButton = page.locator('button:has-text("Create Task")');
    await createButton.click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: join(screenshotsDir, 'feature-6-validation-error.png'),
      fullPage: false,
    });

    // Screenshot 6: Fill in form and create task
    console.log('Creating new task...');
    await page.locator('input[type="text"]').first().fill('New Test Task from Screenshots');
    await page.locator('textarea').fill('This task was created during screenshot testing');
    await page.locator('button:has-text("high")').click();
    await page.waitForTimeout(300);

    await createButton.click();
    await page.waitForTimeout(1000);

    console.log('Taking screenshot: feature-6-new-task-added.png');
    await page.screenshot({
      path: join(screenshotsDir, 'feature-6-new-task-added.png'),
      fullPage: false,
    });

    // Screenshot 7: Open DevTools and show localStorage
    console.log('Taking screenshot: feature-7-localstorage.png');
    await page.evaluate(() => {
      const storage = localStorage.getItem('michel-dashboard-storage');
      console.log('localStorage:', storage);
    });
    await page.screenshot({
      path: join(screenshotsDir, 'feature-7-localstorage.png'),
      fullPage: false,
    });

    // Screenshot 8: Refresh page to test persistence
    console.log('Refreshing page...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('Taking screenshot: feature-7-after-refresh.png');
    await page.screenshot({
      path: join(screenshotsDir, 'feature-7-after-refresh.png'),
      fullPage: false,
    });

    // Screenshot 9: Mobile layout
    console.log('Taking screenshot: feature-8-mobile-layout.png');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(screenshotsDir, 'feature-8-mobile-layout.png'),
      fullPage: true,
    });

    // Screenshot 10: Tablet layout
    console.log('Taking screenshot: feature-8-tablet-layout.png');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(screenshotsDir, 'feature-8-tablet-layout.png'),
      fullPage: false,
    });

    console.log('All screenshots captured successfully!');
  } catch (error) {
    console.error('Error taking screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(console.error);
