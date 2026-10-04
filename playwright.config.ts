import { defineConfig, devices } from "@playwright/test";
import { API_PORT, apiEnv, apiUrl, corePath, STRIPE_MOCK_PORT, storefrontKey, WEB_PORT, webUrl } from "./e2e/env";

/**
 * End-to-end: production Next.js build -> Laravel API (SQLite, fake supplier, sync queue) -> stripe-mock.
 * Requires PHP, Docker (for stripe-mock) and the commerce-core checkout next to this repo (or COMMERCE_CORE_PATH).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",
  use: { baseURL: webUrl, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /storefront\.spec\.ts/ },
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, testMatch: /(a-purchase|b-admin)\.spec\.ts/ },
  ],
  webServer: [
    {
      command: `docker run --rm --name cc-e2e-stripe-mock -p ${STRIPE_MOCK_PORT}:12111 stripe/stripe-mock:latest`,
      url: `http://127.0.0.1:${STRIPE_MOCK_PORT}/v1/charges`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      // Laravel's router script resolves the public directory from the working directory.
      command: `php -S 127.0.0.1:${API_PORT} ../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php`,
      cwd: `${corePath}/public`,
      env: { ...apiEnv, PHP_CLI_SERVER_WORKERS: "4" },
      url: `${apiUrl}/up`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `npx next build && npx next start --port ${WEB_PORT}`,
      env: { COMMERCE_API_URL: apiUrl, STOREFRONT_API_KEY: storefrontKey, NEXT_PUBLIC_SITE_URL: webUrl, NEXT_TELEMETRY_DISABLED: "1" },
      url: `${webUrl}/robots.txt`,
      reuseExistingServer: false,
      timeout: 240_000,
    },
  ],
});
