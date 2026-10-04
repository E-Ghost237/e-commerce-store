import { expect, test } from "@playwright/test";

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

    expect(colors.text).toBe("rgb(247, 245, 239)");
    expect(colors.background).toBe("rgb(20, 33, 61)");
  });

  test("security headers are sent", async ({ request }) => {
    const response = await request.get("/");
    expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-powered-by"]).toBeUndefined();
  });
});
