# Commerce Storefront

Next.js 16 storefront and back office for the Commerce Core API (the Laravel app in `commerce-core`). The browser never talks to the API directly: pages and server actions call it from the Next.js server, so API URLs and keys stay server-side, the cart and admin session live in httpOnly cookies, and no CORS is needed.

## What's here

- **Storefront** (`src/app/(store)`): home (hero, demo video, benefits, bundles, products, testimonials, FAQ), product pages with availability and Product/Offer JSON-LD, guest cart, checkout (US address, live shipping quotes, discount code, marketing consent, Stripe hosted checkout), success and cancel pages, order tracking, shipping/returns/privacy/terms/contact pages, `sitemap.xml`, `robots.txt`.
- **Back office** (`src/app/admin`): sign-in with TOTP, contribution dashboard (revenue, AOV, CAC, ROAS, COGS, shipping, fees, contribution per source/campaign/creative), orders (search by number, e-mail or tracking; timeline; fulfilment retry/hold/release/cancel; refunds; internal notes; attribution), products, bundles, discounts, suppliers and SKU mapping, ad spend, MFA enrollment.
- **Attribution** (`src/proxy.ts`): UTM parameters, `fbclid`/`ttclid`/`gclid`, landing page and external referrer are captured on arrival and sent to the cart before checkout, where the API snapshots first touch and last non-direct click.
- **Brand content** lives in `src/content/site.ts`; the components are brand-neutral.

## Run locally

```bash
cp .env.example .env.local     # COMMERCE_API_URL and STOREFRONT_API_KEY (same as the API's COMMERCE_STOREFRONT_API_KEY)
npm install
npm run dev                    # http://localhost:3000, back office at /admin
```

The API must be running. Without supplier or Stripe credentials, start it with `COMMERCE_SUPPLIER=FAKE`, seed `DemoCatalogSeeder`, and create an admin with `php artisan admin:create`. Point the API's `STRIPE_CHECKOUT_SUCCESS_URL` / `STRIPE_CHECKOUT_CANCEL_URL` at this app's `/checkout/success?session_id={CHECKOUT_SESSION_ID}` and `/checkout/cancelled`.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e   # needs PHP 8.4 and Docker; uses ../commerce-core or COMMERCE_CORE_PATH
```

The end-to-end suite builds this app, starts the Laravel API on a fresh SQLite database (fake supplier, synchronous queue), runs Stripe's official `stripe-mock`, and drives Chromium through:

- a 360 px phone: home, product page (JSON-LD, canonical), 404s, policy pages, sitemap/robots, tracking privacy, security headers;
- a full purchase: campaign landing → bundle → discount → shipping quote → Stripe redirect → success page (still unpaid) → five signed webhook deliveries (one paid order, one fulfilment) → supplier tracking shown to the customer;
- the back office: login redirect, dashboard numbers, order search/note/partial refund, product creation, discount usage, MFA enrollment and sign-in with a code.

## Deploy

`Dockerfile` builds a standalone image (`node server.js` on port 3000). Pass `NEXT_PUBLIC_*` values as build args and `COMMERCE_API_URL` / `STOREFRONT_API_KEY` at runtime. Security headers (CSP, HSTS in production, frame and content-type protections) are set in `next.config.ts`.
