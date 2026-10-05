export type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
  error?: { code: string; message: string; correlation_id?: string | null };
};

export type Paginated<T> = {
  data: T[];
  meta?: { current_page: number; last_page: number; total: number; per_page: number };
};

export type ProductImage = { id: number; url: string; alt_text: string | null; position: number; is_primary: boolean };

export type ProductVariant = {
  id: number;
  sku: string;
  name: string;
  attributes: Record<string, string> | null;
  price_cents: number | null;
  currency: string | null;
  in_stock: boolean;
};

export type ProductVideo = {
  id: number;
  url: string;
  poster_url: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  categories: { id: number; name: string; slug: string }[];
  images: ProductImage[];
  videos: ProductVideo[];
  primary_image: { url: string; alt_text: string | null } | null;
  variants: ProductVariant[];
};

export type Bundle = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  currency: string;
  badge: string | null;
  sort_order: number;
  status?: string;
  items: { product_variant_id: number; sku: string; name: string; quantity: number }[];
};

export type CartLine = {
  id: number;
  type: "variant" | "bundle";
  product_variant_id: number | null;
  bundle_id: number | null;
  name: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
  currency: string;
};

export type Cart = { uuid: string; currency: string; items: CartLine[]; subtotal_cents: number };

export type ShippingQuote = { method: string; shipping_cents: number; estimated_days: string | null };

export type ShippingAddress = {
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string;
  zip: string;
  country_code: string;
  country: string;
  phone?: string;
};

export type CheckoutSession = { order_number: string; checkout_session_id: string; checkout_url: string };

export type Tracking = {
  order_number: string;
  fulfillment_status: string;
  shipments: {
    carrier: string | null;
    tracking_number: string | null;
    status: string;
    shipped_at: string | null;
    delivered_at: string | null;
    events: { status: string; location: string | null; occurred_at: string }[];
  }[];
};
