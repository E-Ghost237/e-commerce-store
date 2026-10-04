import "server-only";
import { cookies } from "next/headers";
import { api, ApiError } from "./api";
import { serverConfig } from "./config";
import { CART_COOKIE, TOUCHES_COOKIE, type MarketingTouch } from "./cookies";
import type { Cart } from "./types";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

/** Read the shopper's cart, or null when there is none (render-safe: never writes cookies). */
export async function readCart(): Promise<Cart | null> {
  const uuid = (await cookies()).get(CART_COOKIE)?.value;
  if (!uuid) {
    return null;
  }
  try {
    return (await api<{ data: Cart }>(`/carts/${uuid}`, { forwardClientIp: true })).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/** Server Functions only: return the cart UUID, creating the cart (and cookie) when needed. */
export async function ensureCartUuid(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing && (await readCart())) {
    return existing;
  }
  const cart = (await api<{ data: Cart }>("/carts", { method: "POST" })).data;
  store.set(CART_COOKIE, cart.uuid, {
    httpOnly: true,
    secure: serverConfig.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
  return cart.uuid;
}

/** Server Functions only: send marketing touches captured by the proxy to the cart, then clear them. */
export async function flushMarketingTouches(cartUuid: string): Promise<void> {
  const store = await cookies();
  const raw = store.get(TOUCHES_COOKIE)?.value;
  if (!raw) {
    return;
  }
  let touches: MarketingTouch[] = [];
  try {
    touches = JSON.parse(raw) as MarketingTouch[];
  } catch {
    touches = [];
  }
  for (const touch of touches) {
    try {
      await api(`/carts/${cartUuid}/marketing-touches`, { method: "POST", body: touch });
    } catch {
      // Attribution must never block shopping; a rejected touch is dropped.
    }
  }
  store.delete(TOUCHES_COOKIE);
}

export async function clearCartCookie(): Promise<void> {
  (await cookies()).delete(CART_COOKIE);
}
