import { expect, test, type Page } from "@playwright/test";
import { admin } from "./env";
import { totp } from "./helpers";

const buyerEmail = "e2e-buyer@example.test";

async function signIn(page: Page, code?: string) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(admin.email);
  await page.getByLabel("Password").fill(admin.password);
  if (code) {
    await page.getByLabel("Authenticator or recovery code").fill(code);
  }
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
}

test.describe.serial("back office", () => {
  test("signed-out visitors are sent to the login page", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("dashboard reports the paid order and its campaign", async ({ page }) => {
    await signIn(page);
    await expect(page.getByText("$47.45").first()).toBeVisible();
    await expect(page.getByRole("cell", { name: "e2e" })).toBeVisible();
  });

  test("order timeline: find by e-mail, add a note and a partial refund", async ({ page }) => {
    await signIn(page);
    await page.getByRole("link", { name: "Orders" }).click();
    await page.getByLabel("Order number, e-mail or tracking").fill(buyerEmail);
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("link", { name: /^CC-/ }).click();

    await expect(page.getByText("PAID").first()).toBeVisible();
    await expect(page.getByText(/last non direct:.*e2e \/ paid_social \/ launch \/ video-a/)).toBeVisible();

    await page.getByLabel("New note (not visible to the customer)").fill("Customer asked for gift wrap.");
    await page.getByRole("button", { name: "Add note" }).click();
    await expect(page.getByText("Customer asked for gift wrap.")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByLabel(/Amount in USD/).fill("5.00");
    await page.getByLabel("Reason", { exact: true }).fill("Late delivery goodwill");
    await page.getByRole("button", { name: "Refund" }).click();
    await expect(page.getByText("Refund sent to Stripe.")).toBeVisible();
    await page.reload();
    await expect(page.getByText(/Refund \$5\.00/)).toBeVisible();
    await expect(page.getByText("PARTIALLY_REFUNDED").first()).toBeVisible();
  });

  test("catalogue: create a draft product with a variant and price", async ({ page }) => {
    await signIn(page);
    await page.goto("/admin/products/new");
    await page.getByLabel("Name", { exact: true }).fill("Lint Brush Travel Size");
    await page.getByLabel("Slug (URL)").fill("lint-brush-travel");
    await page.getByLabel("SKU").first().fill("BRUSH-TRAVEL");
    await page.getByLabel("Variant name").first().fill("Travel");
    await page.getByLabel("Price (USD)").first().fill("9.99");
    await page.getByRole("button", { name: "Create product" }).click();

    await expect(page).toHaveURL(/\/admin\/products\/\d+$/);
    await page.goto("/admin/products");
    await expect(page.getByRole("link", { name: "Lint Brush Travel Size" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "$9.99" })).toBeVisible();
  });

  test("discount usage is counted once the order is paid", async ({ page }) => {
    await signIn(page);
    await page.goto("/admin/discounts");
    await expect(page.getByRole("row", { name: /E2E10/ })).toContainText("10%");
    await expect(page.getByRole("row", { name: /E2E10/ }).getByRole("cell").nth(3)).toHaveText("1");
  });

  test("an admin enrolls in two-factor and then needs a code to sign in", async ({ page }) => {
    await signIn(page);
    await page.goto("/admin/security");
    await page.getByRole("button", { name: "1. Generate a key" }).click();
    const secret = (await page.locator("code").textContent())!.trim();
    await page.getByLabel("6-digit code from the app").fill(totp(secret));
    await page.getByRole("button", { name: "2. Confirm" }).click();
    await expect(page.getByText(/Two-factor authentication is on/)).toBeVisible();
    await expect(page.locator("ol li")).toHaveCount(8);

    await page.getByRole("button", { name: "Sign out" }).click();
    await page.getByLabel("E-mail").fill(admin.email);
    await page.getByLabel("Password").fill(admin.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Enter the code from your authenticator app.")).toBeVisible();

    await signIn(page, totp(secret, 1));
  });
});
