import { test, expect, Page } from '@playwright/test';

async function openAddDialog(page: Page) {
  // click the first icon-button in the customers table (Add)
  const addBtn = page.locator('app-customers-table button[mat-icon-button]').first();
  await expect(addBtn).toBeVisible();
  await addBtn.click();
  await page.waitForSelector('mat-dialog-container');
  return page.locator('mat-dialog-container');
}

async function fillAddForm(dialog: any, first = 'E2E', last = 'User', email = 'e2e@example.com', active = true) {
  const inputs = dialog.locator('input');
  await inputs.nth(0).fill(first);
  await inputs.nth(1).fill(last);
  await inputs.nth(2).fill(email);
  const checkbox = dialog.locator('mat-checkbox input[type="checkbox"]');
  const checked = await checkbox.isChecked();
  if (checked !== active) await dialog.locator('mat-checkbox').click();
}

// Adds correctly - Clicks add button to open add dialog
// - Fills all fields with valid values
// - Clicks add
// - Customer is added to the table
test('Adds correctly - Clicks add button to open add dialog', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tr[mat-row]');

  const dialog = await openAddDialog(page);

  const firstName = `E2EFirst${Date.now()}`;
  await fillAddForm(dialog, firstName, 'Tester', `${firstName.toLowerCase()}@example.com`, true);

  // click Add button in dialog
  const addBtn = dialog.locator('button:has-text("Add")');
  await expect(addBtn).toBeEnabled();
  await addBtn.click();

  // dialog should close
  await expect(page.locator('mat-dialog-container')).toHaveCount(0);

  // new row should be present in table (firstName is in 3rd td)
  await expect(page.locator('td:nth-child(3):has-text("' + firstName + '")')).toHaveCount(1);
});

// Validations - test missing first name
test('Validations - Missing first name shows error and disables Add', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tr[mat-row]');

  const dialog = await openAddDialog(page);
  // leave first name empty
  await fillAddForm(dialog, '', 'Tester', 'valid@example.com');

  // expect an error for first name and Add disabled
  await expect(dialog.locator('mat-error')).toBeVisible();
  await expect(dialog.locator('button:has-text("Add")')).toBeDisabled();
});

// Validations - invalid email
test('Validations - Invalid email shows error and disables Add', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tr[mat-row]');

  const dialog = await openAddDialog(page);
  await fillAddForm(dialog, 'Jane', 'Tester', 'not-an-email');

  // expect an error for email and Add disabled
  await expect(dialog.locator('mat-error')).toBeVisible();
  await expect(dialog.locator('button:has-text("Add")')).toBeDisabled();
});

// Canceling when no changes - Click cancel
test('Canceling when no changes - Click cancel', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tr[mat-row]');

  const dialog = await openAddDialog(page);
  await dialog.locator('button:has-text("Cancel")').click();
  await expect(page.locator('mat-dialog-container')).toHaveCount(0);

  // nothing added: ensure no row with a unique test marker exists (we didn't add one)
});

// Canceling when no changes - Click outside
test('Canceling when no changes - Click outside', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tr[mat-row]');

  await openAddDialog(page);
  // click near top-left to click outside dialog
  await page.mouse.click(5, 5);
  await expect(page.locator('mat-dialog-container')).toHaveCount(0);
});

// Canceling when no changes - Click back
test('Canceling when no changes - Click back', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tr[mat-row]');

  await openAddDialog(page);

  // go back should close dialog (no pending changes)
  const [dialogEvent] = await Promise.all([page.waitForEvent('dialog').catch(() => null), page.goBack()]);
  // if a dialog appears it's unexpected here; ensure dialog closed
  await expect(page.locator('mat-dialog-container')).toHaveCount(0);
});

// Canceling when changes - Click cancel
test('Canceling when changes - Click cancel', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tr[mat-row]');

  const dialog = await openAddDialog(page);
  await fillAddForm(dialog, 'Changed', 'Tester', 'changed@example.com');
  await dialog.locator('button:has-text("Cancel")').click();
  await expect(page.locator('mat-dialog-container')).toHaveCount(0);
});

// Canceling when changes - Click outside (should stay open)
test('Canceling when changes - Click outside', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tr[mat-row]');

  const dialog = await openAddDialog(page);
  await fillAddForm(dialog, 'Changed', 'Tester', 'changed@example.com');

  // click outside; since dialog.disableClose is set true when dirty, it should stay
  await page.mouse.click(5, 5);
  await expect(page.locator('mat-dialog-container')).toHaveCount(1);
});

// Canceling when changes - Click back (multiple cancels then confirm)
test('Canceling when changes - Click back', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tr[mat-row]');

  await openAddDialog(page);
  // make a change
  const dialog = page.locator('mat-dialog-container');
  await dialog.locator('input').first().fill('ChangedViaBack');

  // perform back several times and dismiss the confirm dialog (stay)
  for (let i = 0; i < 3; i++) {
    const dialogPromise = page.waitForEvent('dialog');
    await page.goBack();
    const d = await dialogPromise;
    if (d) await d.dismiss();
    // dialog should still be present
    await expect(page.locator('mat-dialog-container')).toHaveCount(1);
  }

  // final back: accept and allow close
  const finalPromise = page.waitForEvent('dialog');
  await page.goBack();
  const finalDialog = await finalPromise;
  if (finalDialog) await finalDialog.accept();

  await expect(page.locator('mat-dialog-container')).toHaveCount(0);
});
