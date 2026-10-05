import { expect, test } from "@playwright/test";

/** Relative luminance of a computed `rgb(...)` colour, per WCAG 2.x. */
function luminance(colour: string): number {
  const channels = (colour.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  const [r, g, b] = channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

test.describe("storefront on a phone", () => {
  test("home shows the offer, bundles and products without horizontal scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fur off.");
    await expect(page.getByRole("heading", { name: "Fur-Free Home Kit" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Reusable Pet Hair Roller" })).toBeVisible();
    await expect(page.getByText("$44.99")).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("product page exposes price, availability, canonical and Product structured data", async ({ page }) => {
    await page.goto("/products/reusable-pet-hair-roller");

    await expect(page.getByRole("heading", { level: 1, name: "Reusable Pet Hair Roller" })).toBeVisible();
    await expect(page.getByText(/In stock/)).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/products\/reusable-pet-hair-roller$/);

    const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    expect(jsonLd["@type"]).toBe("Product");
    expect(jsonLd.offers.map((offer: { price: string }) => offer.price)).toEqual(["24.99", "29.99"]);
  });

  test("unknown products and pages return 404", async ({ page }) => {
    expect((await page.goto("/products/does-not-exist"))?.status()).toBe(404);
    expect((await page.goto("/not-a-real-page"))?.status()).toBe(404);
  });

  test("policy pages, sitemap and robots are published", async ({ page, request }) => {
    for (const path of ["/shipping", "/returns", "/privacy", "/terms", "/contact"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }

    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/products/reusable-pet-hair-roller");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
  });

  test("tracking lookup does not reveal whether an order exists", async ({ page }) => {
    await page.goto("/tracking");
    await page.getByLabel("Order number").fill("CC-00000000-NOPE");
    await page.getByLabel("E-mail used at checkout").fill("nobody@example.test");
    await page.getByRole("button", { name: "Track" }).click();

    await expect(page.getByText("We couldn't find an order with that number and e-mail.")).toBeVisible();
  });

  test("links styled as buttons keep readable text, not the inherited link colour", async ({ page }) => {
    await page.goto("/contact");
    const colors = await page.getByRole("link", { name: /^E-mail / }).evaluate((element) => {
      const style = getComputedStyle(element);
      return { text: style.color, background: style.backgroundColor };
    });

    // The palette may change; what must not change is that the label stays legible on its own background
    // instead of inheriting the body colour and vanishing into the button fill.
    expect(colors.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(contrastRatio(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  test("security headers are sent", async ({ request }) => {
    const response = await request.get("/");
    expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-powered-by"]).toBeUndefined();
  });
});
