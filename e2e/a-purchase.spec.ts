import { expect, test } from "@playwright/test";
import { apiUrl } from "./env";
import { adminToken, artisan, findOrder, paymentSucceededEvent, sendStripeEvent } from "./helpers";

export const buyerEmail = "e2e-buyer@example.test";

test.describe.serial("guest purchase from ad click to tracking", () => {
  test("shopper buys the bundle with a discount and is sent to Stripe", async ({ page }) => {
    const token = await adminToken();
    const discount = await fetch(`${apiUrl}/api/v1/admin/discounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code: "E2E10", type: "percentage", value: 10 }),
    });
    expect(discount.status).toBe(201);

    await page.goto("/?utm_source=e2e&utm_medium=paid_social&utm_campaign=launch&utm_content=video-a&fbclid=fb-e2e-1");
    await page.getByRole("button", { name: "Add bundle to cart" }).click();
    await expect(page.getByText("Added to your cart.")).toBeVisible();
    await expect(page.getByRole("link", { name: /Cart, 1 item/ })).toBeVisible();

    await page.goto("/cart");
    await expect(page.getByText("Fur-Free Home Kit", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Continue to checkout →" }).click();

    await page.getByLabel("E-mail", { exact: true }).fill(buyerEmail);
    await page.getByLabel(/^E-mail me a reminder/).check();
    await page.getByLabel("Full name").fill("Ada Lovelace");
    await page.getByLabel("Address", { exact: true }).fill("1 Main Street");
    await page.getByLabel("City").fill("Austin");
    await page.getByLabel("State").selectOption("TX");
    await page.getByLabel("ZIP code").fill("78701");
    await page.getByRole("button", { name: "Show shipping options" }).click();
    await expect(page.getByText("Standard US")).toBeVisible();
    await page.getByLabel("Discount code").fill("e2e10");

    await page.route("https://checkout.stripe.com/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Stripe Checkout (e2e)</h1>" }));
    await page.getByRole("button", { name: "Pay securely with Stripe →" }).click();
    await page.waitForURL(/checkout\.stripe\.com/);

    const order = await findOrder(token, buyerEmail);
    expect(order.payment_status).toBe("PENDING");
    expect(order.discount_cents).toBe(449);

    // Returning from Stripe shows the order but proves nothing about payment, and starts a fresh cart.
    await page.goto("/checkout/success?session_id=cs_test_e2e");
    await expect(page.getByText(order.number)).toBeVisible();
    expect((await findOrder(token, buyerEmail)).payment_status).toBe("PENDING");
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Cart, 0 items/ })).toBeVisible();
    // The bundle ships three units: $4.95 + 2 × $1.00 shipping from the fake supplier.
    expect(order.total_cents).toBe(4499 - 449 + 695);
  });

  test("only the signed webhook marks the order paid, exactly once across five deliveries", async () => {
    const token = await adminToken();
    const order = await findOrder(token, buyerEmail);

    for (let delivery = 0; delivery < 5; delivery++) {
      expect(await sendStripeEvent(paymentSucceededEvent(order))).toBe(204);
    }

    const detail = await (await fetch(`${apiUrl}/api/v1/admin/orders/${order.id}`, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } })).json();
    expect(detail.data.payment_status).toBe("PAID");
    expect(detail.data.fulfillments).toHaveLength(1);
    expect(detail.data.fulfillments[0].supplier_order_id).toBe(`FAKE-${order.number}`);
    expect(detail.data.attributions.find((attribution: { model: string }) => attribution.model === "last_non_direct")).toMatchObject({ utm_source: "e2e", utm_campaign: "launch", utm_content: "video-a", fbclid: "fb-e2e-1" });
  });

  test("tracking appears for the customer once the supplier ships", async ({ page }) => {
    const token = await adminToken();
    const order = await findOrder(token, buyerEmail);
    artisan("fulfillments:sync-tracking");

    await page.goto(`/tracking?order=${order.number}`);
    await page.getByLabel("E-mail used at checkout").fill(buyerEmail);
    await page.getByRole("button", { name: "Track" }).click();

    await expect(page.getByText("On its way")).toBeVisible();
    await expect(page.getByText(/USPS · 9400/)).toBeVisible();
    await expect(page.getByText(/In transit/)).toBeVisible();
  });
});
