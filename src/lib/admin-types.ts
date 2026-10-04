export type AdminOrder = {
  id: number;
  number: string;
  email: string;
  currency: string;
  payment_status: string;
  fulfillment_status: string;
  status: string;
  subtotal_cents: number;
  discount_cents: number;
  discount_code: string | null;
  shipping_cents: number;
  total_cents: number;
  paid_at: string | null;
  created_at: string;
  shipping_address: Record<string, string> | null;
  shipping_method: string | null;
  items: { sku: string; name: string; quantity: number; line_total_cents: number; unit_cost_cents: number | null; components: { sku: string; name: string; quantity: number }[] | null }[];
  payments?: { status: string; amount_cents: number; completed_at: string | null; refunds: { id: number; amount_cents: number; status: string; reason: string | null; created_at: string }[] }[];
  notes?: { id: number; body: string; author_id: number | null; created_at: string }[];
  attributions?: { model: string; utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_content: string | null; fbclid: string | null; ttclid: string | null; gclid: string | null; landing_page: string | null; touched_at: string | null }[];
  fulfillments: {
    id: number;
    status: string;
    supplier_order_id: string | null;
    last_error?: string | null;
    attempt_count?: number;
    submitted_at?: string | null;
    shipments: { carrier: string | null; tracking_number: string | null; status: string; events?: { status: string; location: string | null; occurred_at: string }[] }[];
  }[];
};

export type AdminProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  images: { id: number; url: string; alt_text: string | null }[];
  variants: { id: number; sku: string; name: string; status: string; unit_cost_cents: number | null; stock_quantity: number | null; price_cents: number | null }[];
};

export type AdminDiscount = {
  id: number;
  code: string;
  type: "fixed" | "percentage";
  value: number;
  minimum_subtotal_cents: number;
  product_ids: number[] | null;
  bundle_ids: number[] | null;
  usage_limit: number | null;
  usage_count: number;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
};

export type LaravelPage<T> = { data: T[]; current_page: number; last_page: number; total: number };
