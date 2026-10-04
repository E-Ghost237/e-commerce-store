/** Cookie names shared by the proxy (edge) and server code. */
export const CART_COOKIE = "cc_cart";
export const TOUCHES_COOKIE = "cc_touches";
export const ADMIN_COOKIE = "cc_admin";
export const LAST_ORDER_COOKIE = "cc_last_order";

export const ATTRIBUTION_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "ttclid", "gclid"] as const;

export type MarketingTouch = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  occurred_at: string;
};

export const MAX_STORED_TOUCHES = 5;
