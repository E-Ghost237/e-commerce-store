import path from "node:path";

/** Paths and settings shared by the Playwright config, global setup and specs. */
export const corePath = path.resolve(process.env.COMMERCE_CORE_PATH ?? path.join(__dirname, "..", "..", "commerce-core"));
export const e2eDir = path.join(__dirname, ".state");
export const databasePath = path.join(e2eDir, "e2e.sqlite");

export const API_PORT = 8100;
export const WEB_PORT = 3100;
export const STRIPE_MOCK_PORT = 12111;
export const apiUrl = `http://127.0.0.1:${API_PORT}`;
export const webUrl = `http://localhost:${WEB_PORT}`;

export const admin = { email: "e2e-admin@example.test", password: "e2e-admin-password" };
export const webhookSecret = "whsec_e2e_secret";
export const storefrontKey = "e2e-storefront-key";

/** Environment for the Laravel API. Real environment variables win over the developer's .env file. */
export const apiEnv: Record<string, string> = {
  APP_ENV: "local",
  APP_DEBUG: "false",
  APP_URL: apiUrl,
  DB_CONNECTION: "sqlite",
  DB_DATABASE: databasePath,
  QUEUE_CONNECTION: "sync",
  CACHE_STORE: "file",
  SESSION_DRIVER: "array",
  MAIL_MAILER: "log",
  LOG_CHANNEL: "single",
  COMMERCE_SUPPLIER: "FAKE",
  COMMERCE_STOREFRONT_URL: webUrl,
  COMMERCE_STOREFRONT_API_KEY: storefrontKey,
  COMMERCE_ADMIN_REQUIRE_MFA: "false",
  STRIPE_SECRET: "sk_test_e2e",
  STRIPE_KEY: "pk_test_e2e",
  STRIPE_WEBHOOK_SECRET: webhookSecret,
  STRIPE_API_BASE: `http://127.0.0.1:${STRIPE_MOCK_PORT}`,
  STRIPE_CHECKOUT_SUCCESS_URL: `${webUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  STRIPE_CHECKOUT_CANCEL_URL: `${webUrl}/checkout/cancelled`,
  SENTRY_LARAVEL_DSN: "",
};
