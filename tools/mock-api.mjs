/**
 * UI development helper — NOT part of the app or the production build.
 *
 * The real storefront talks to the Commerce Core API (Laravel). This tiny in-memory stand-in implements just
 * enough of the same contract (same paths, same payload shapes) to design, preview and screenshot the frontend
 * without running the PHP API, Stripe or a supplier.
 *
 *   node tools/mock-api.mjs            # listens on http://localhost:4100
 *   COMMERCE_API_URL=http://localhost:4100 npm run dev
 *
 * Nothing here is imported by src/ and it never ships in the Docker image.
 */
import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_API_PORT ?? 4100);
const STOREFRONT_URL = (process.env.MOCK_STOREFRONT_URL ?? "http://localhost:3000").replace(/\/$/, "");

const media = {
  hero: "/images/hero-living-room.jpg",
  roller: "/images/detail-roller.jpg",
  car: "/images/car-interior.jpg",
  bedroom: "/images/bedroom-linen.jpg",
  kit: "/images/kit-flatlay.jpg",
  cover: "/images/og-cover.jpg",
};

const image = (id, url, alt, position, isPrimary = false) => ({ id, url, alt_text: alt, position, is_primary: isPrimary });
const variant = (id, sku, name, price, inStock = true, attributes = null) => ({
  id,
  sku,
  name,
  attributes,
  price_cents: price,
  currency: "USD",
  in_stock: inStock,
});

const products = [
  {
    id: 1,
    name: "Reusable Pet Hair Roller",
    slug: "reusable-pet-hair-roller",
    description:
      "One pass lifts fur, dander and lint off fabric and traps it in a sealed chamber you empty into the bin. No adhesive sheets, no batteries, nothing to rebuy — the same roller keeps working for years.",
    seo_title: "Reusable Pet Hair Roller — no refills, no sticky tape",
    seo_description: "Lift pet hair off sofas, beds, car seats and coats in one pass. Reusable, refill-free and built to last.",
    categories: [{ id: 1, name: "Rollers", slug: "rollers" }],
    images: [
      image(1, media.roller, "Roller lifting dog fur from a linen cushion", 0, true),
      image(2, media.hero, "Golden retriever and cat on a cream boucle sofa", 1),
      image(3, media.car, "Clean car back seat with a dog", 2),
    ],
    videos: [],
    primary_image: { url: media.roller, alt_text: "Roller lifting dog fur from a linen cushion" },
    variants: [
      variant(1, "ROLLER-STD", "Standard", 2499, true, { size: "Standard" }),
      variant(2, "ROLLER-DUO", "Roller + glove duo", 2999, true, { size: "Duo" }),
    ],
  },
  {
    id: 2,
    name: "Silicone Grooming Glove",
    slug: "silicone-grooming-glove",
    description:
      "Five-finger silicone bristles pull loose undercoat straight off your pet — and the same glove clears whatever lands on the couch afterwards. Rinse it under the tap and it is ready again.",
    seo_title: "Silicone Pet Grooming Glove",
    seo_description: "Deshed your pet and clean the couch with one reusable silicone glove.",
    categories: [{ id: 2, name: "Grooming", slug: "grooming" }],
    images: [
      image(4, media.kit, "Grooming glove with roller and brush on a cream surface", 0, true),
      image(5, media.bedroom, "Cat curled up on white linen bedding", 1),
    ],
    videos: [],
    primary_image: { url: media.kit, alt_text: "Grooming glove with roller and brush on a cream surface" },
    variants: [
      variant(3, "GLOVE-RH", "Right hand", 1999, true, { hand: "Right" }),
      variant(4, "GLOVE-PAIR", "Pair", 2799, true, { hand: "Pair" }),
    ],
  },
  {
    id: 3,
    name: "Fur & Lint Brush",
    slug: "fur-and-lint-brush",
    description:
      "A dense boar-bristle brush for the last pass: coats, cushions, curtains and car seats. Solid beech handle, no plastic edges to catch on fabric.",
    seo_title: "Fur & Lint Brush — beech handle",
    seo_description: "A dense bristle brush for the final pass on coats, cushions and car seats.",
    categories: [{ id: 3, name: "Brushes", slug: "brushes" }],
    images: [image(6, media.kit, "Fur and lint brush on a cream plaster surface", 0, true)],
    videos: [],
    primary_image: { url: media.kit, alt_text: "Fur and lint brush on a cream plaster surface" },
    variants: [variant(5, "BRUSH-TRAVEL", "Travel", 1699, true, { size: "Travel" })],
  },
  {
    id: 4,
    name: "Lint Roller Refill Set",
    slug: "lint-roller-refill-set",
    description: "Spare sticky sheets for the coat-and-car kit, for the days you want tape instead of bristles.",
    seo_title: "Lint Roller Refill Set",
    seo_description: "Spare sticky sheets for the coat-and-car kit.",
    categories: [{ id: 1, name: "Rollers", slug: "rollers" }],
    images: [image(7, media.car, "Car interior detail", 0, true)],
    videos: [],
    primary_image: { url: media.car, alt_text: "Car interior detail" },
    variants: [variant(6, "REFILL-3PK", "3 pack", 899, false, { pack: "3 pack" })],
  },
];

const bundles = [
  {
    id: 1,
    name: "Fur-Free Home Kit",
    slug: "fur-free-home-kit",
    description: "The roller, the grooming glove and the finishing brush — everything for a whole-home reset, priced below buying them apart.",
    price_cents: 4499,
    currency: "USD",
    badge: "Most popular",
    sort_order: 1,
    status: "active",
    items: [
      { product_variant_id: 1, sku: "ROLLER-STD", name: "Reusable Pet Hair Roller · Standard", quantity: 1 },
      { product_variant_id: 3, sku: "GLOVE-RH", name: "Silicone Grooming Glove · Right hand", quantity: 1 },
      { product_variant_id: 5, sku: "BRUSH-TRAVEL", name: "Fur & Lint Brush · Travel", quantity: 1 },
    ],
  },
  {
    id: 2,
    name: "Couch & Car Kit",
    slug: "couch-and-car-kit",
    description: "Two rollers and the glove: one for the sofa, one for the back seat, so neither ends up in the other room.",
    price_cents: 5299,
    currency: "USD",
    badge: "Two rollers",
    sort_order: 2,
    status: "active",
    items: [
      { product_variant_id: 2, sku: "ROLLER-DUO", name: "Reusable Pet Hair Roller · Roller + glove duo", quantity: 1 },
      { product_variant_id: 5, sku: "BRUSH-TRAVEL", name: "Fur & Lint Brush · Travel", quantity: 2 },
    ],
  },
];

/** In-memory state, reset whenever the process restarts. */
const carts = new Map();
const orders = new Map();
let cartSeq = 1;
let lineSeq = 1;
let orderSeq = 1;

const priceOfVariant = new Map(products.flatMap((product) => product.variants.map((entry) => [entry.id, { variant: entry, product }])));
const bundleById = new Map(bundles.map((bundle) => [bundle.id, bundle]));

function cartPayload(cart) {
  return {
    uuid: cart.uuid,
    currency: "USD",
    items: cart.items,
    subtotal_cents: cart.items.reduce((total, line) => total + line.line_total_cents, 0),
  };
}

function makeLine({ type, variant, product, bundle, quantity }) {
  const unit = type === "bundle" ? bundle.price_cents : variant.price_cents;
  return {
    id: lineSeq++,
    type,
    product_variant_id: type === "variant" ? variant.id : null,
    bundle_id: type === "bundle" ? bundle.id : null,
    name: type === "bundle" ? bundle.name : `${product.name} · ${variant.name}`,
    quantity,
    unit_price_cents: unit,
    line_total_cents: unit * quantity,
    currency: "USD",
  };
}

function quoteFor(address) {
  const zip = String(address?.zip ?? "");
  const west = Number.parseInt(zip, 10) > 59999;
  return [
    { method: "Standard US", shipping_cents: 495, estimated_days: west ? "5-8" : "3-5" },
    { method: "Express US", shipping_cents: 1495, estimated_days: "2-3" },
  ];
}

function freshCart() {
  const uuid = `mock-cart-${String(cartSeq++).padStart(4, "0")}-${Math.random().toString(36).slice(2, 10)}`;
  const cart = { uuid, items: [] };
  carts.set(uuid, cart);
  return cart;
}

function orderNumber() {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `CC-${day}-${String(orderSeq++).padStart(4, "0")}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function trackingFor(order) {
  const shippedAt = new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString();
  return {
    order_number: order.number,
    fulfillment_status: "SHIPPED",
    shipments: [
      {
        carrier: "USPS",
        tracking_number: "9400100000000000000000",
        status: "IN_TRANSIT",
        shipped_at: shippedAt,
        delivered_at: null,
        events: [
          { status: "Label created", location: "Austin, TX", occurred_at: shippedAt },
          { status: "Accepted at USPS origin facility", location: "Austin, TX", occurred_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
          { status: "In transit to next facility", location: "Dallas, TX", occurred_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
        ],
      },
    ],
  };
}

function json(response, status, body) {
  const payload = JSON.stringify(body ?? {});
  response.writeHead(status, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) });
  response.end(payload);
}

function readBody(request) {
  return new Promise((resolve) => {
    let raw = "";
    request.on("data", (chunk) => (raw += chunk));
    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${PORT}`);
  const path = url.pathname.replace(/^\/api\/v1/, "");
  const method = request.method ?? "GET";
  const body = method === "GET" || method === "DELETE" ? {} : await readBody(request);

  // Catalogue ------------------------------------------------------------------------------------------------
  if (method === "GET" && path === "/catalog/products") {
    return json(response, 200, {
      data: products,
      meta: { current_page: 1, last_page: 1, total: products.length, per_page: 48 },
    });
  }

  const productMatch = path.match(/^\/catalog\/products\/(.+)$/);
  if (method === "GET" && productMatch) {
    const slug = decodeURIComponent(productMatch[1]);
    const product = products.find((entry) => entry.slug === slug);
    return product ? json(response, 200, { data: product }) : json(response, 404, { message: "Not found" });
  }

  if (method === "GET" && path === "/catalog/bundles") {
    return json(response, 200, { data: bundles });
  }

  // Cart -----------------------------------------------------------------------------------------------------
  if (method === "POST" && path === "/carts") {
    return json(response, 201, { data: cartPayload(freshCart()) });
  }

  const cartMatch = path.match(/^\/carts\/([^/]+)(\/.*)?$/);
  if (cartMatch) {
    const cart = carts.get(cartMatch[1]);
    if (!cart) {
      return json(response, 404, { message: "Cart not found" });
    }
    const rest = cartMatch[2] ?? "";

    if (!rest && method === "GET") {
      return json(response, 200, { data: cartPayload(cart) });
    }

    if (rest === "/marketing-touches" && method === "POST") {
      return json(response, 201, { data: { ok: true } });
    }

    if (rest === "/items" && method === "POST") {
      const quantity = Math.min(Math.max(Number(body.quantity ?? 1), 1), 25);
      if (body.bundle_id) {
        const bundle = bundleById.get(Number(body.bundle_id));
        if (!bundle) {
          return json(response, 422, { message: "Unavailable", errors: { bundle_id: ["That bundle is no longer available."] } });
        }
        const existing = cart.items.find((line) => line.type === "bundle" && line.bundle_id === bundle.id);
        if (existing) {
          existing.quantity += quantity;
          existing.line_total_cents = existing.unit_price_cents * existing.quantity;
        } else {
          cart.items.push(makeLine({ type: "bundle", bundle, quantity }));
        }
        return json(response, 201, { data: cartPayload(cart) });
      }

      const entry = priceOfVariant.get(Number(body.product_variant_id));
      if (!entry) {
        return json(response, 422, { message: "Unavailable", errors: { product_variant_id: ["Choose an option first."] } });
      }
      if (!entry.variant.in_stock) {
        return json(response, 422, { message: "Sold out", errors: { product_variant_id: ["That option is sold out."] } });
      }
      const existing = cart.items.find((line) => line.type === "variant" && line.product_variant_id === entry.variant.id);
      if (existing) {
        existing.quantity += quantity;
        existing.line_total_cents = existing.unit_price_cents * existing.quantity;
      } else {
        cart.items.push(makeLine({ type: "variant", variant: entry.variant, product: entry.product, quantity }));
      }
      return json(response, 201, { data: cartPayload(cart) });
    }

    const lineMatch = rest.match(/^\/items\/(\d+)$/);
    if (lineMatch) {
      const line = cart.items.find((entry) => entry.id === Number(lineMatch[1]));
      if (!line) {
        return json(response, 404, { message: "Line not found" });
      }
      if (method === "PATCH") {
        line.quantity = Math.min(Math.max(Number(body.quantity ?? line.quantity), 1), 25);
        line.line_total_cents = line.unit_price_cents * line.quantity;
        return json(response, 200, { data: cartPayload(cart) });
      }
      if (method === "DELETE") {
        cart.items = cart.items.filter((entry) => entry.id !== line.id);
        return json(response, 204, null);
      }
    }

    if (rest === "/shipping-quotes" && method === "POST") {
      const address = body.shipping_address ?? {};
      const errors = {};
      for (const field of ["name", "address_line1", "city", "province", "zip"]) {
        if (!String(address[field] ?? "").trim()) {
          errors[`shipping_address.${field}`] = ["This field is required."];
        }
      }
      if (Object.keys(errors).length) {
        return json(response, 422, { message: "The given data was invalid.", errors });
      }
      return json(response, 200, { data: quoteFor(address) });
    }

    if (rest === "/checkout" && method === "POST") {
      if (!cart.items.length) {
        return json(response, 422, { message: "Your cart is empty.", errors: {} });
      }
      const number = orderNumber();
      const shipping = method === "Express US" ? 1495 : 495;
      orders.set(number, {
        number,
        email: String(body.email ?? "").toLowerCase(),
        total_cents: cartPayload(cart).subtotal_cents + shipping,
        placed_at: new Date().toISOString(),
      });
      // The real API returns a Stripe hosted checkout URL; locally we bounce straight back to the success page.
      // A root-relative URL keeps the redirect working whatever host the storefront is served from (localhost, tunnel, preview).
      return json(response, 201, {
        data: {
          order_number: number,
          checkout_session_id: `cs_mock_${number}`,
          checkout_url: `/checkout/success?session_id=cs_mock_${number}`,
        },
      });
    }
  }

  // Tracking -------------------------------------------------------------------------------------------------
  const trackingMatch = path.match(/^\/tracking\/([^/]+)$/);
  if (method === "GET" && trackingMatch) {
    const number = decodeURIComponent(trackingMatch[1]).toUpperCase();
    const email = (url.searchParams.get("email") ?? "").toLowerCase();
    const order = orders.get(number);
    if (!order || (order.email && order.email !== email)) {
      return json(response, 404, { message: "We couldn't find an order with that number and e-mail." });
    }
    return json(response, 200, { data: trackingFor(order) });
  }

  return json(response, 404, { message: `No mock route for ${method} ${path}` });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[mock-api] Commerce Core stand-in listening on http://localhost:${PORT}`);
  console.log(`[mock-api] storefront origin for checkout redirects: ${STOREFRONT_URL}`);
});
