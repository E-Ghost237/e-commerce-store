"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { clearCartCookie, flushMarketingTouches } from "@/lib/cart";
import { serverConfig } from "@/lib/config";
import { CART_COOKIE, LAST_ORDER_COOKIE } from "@/lib/cookies";
import type { CheckoutSession, ShippingAddress, ShippingQuote } from "@/lib/types";

export type QuoteResult = { quotes: ShippingQuote[]; errors: Record<string, string>; message: string | null };

export type CheckoutInput = {
  idempotencyKey: string;
  email: string;
  address: ShippingAddress;
  shippingMethod: string;
  discountCode: string;
  marketingConsent: boolean;
};

export type CheckoutResult = { errors: Record<string, string>; message: string | null; pricesChanged: boolean };

const US: Pick<ShippingAddress, "country_code" | "country"> = { country_code: "US", country: "United States" };

function normalizeAddress(address: ShippingAddress): ShippingAddress {
  return {
    name: address.name.trim(),
    address_line1: address.address_line1.trim(),
    address_line2: address.address_line2?.trim() || undefined,
    city: address.city.trim(),
    province: address.province.trim().toUpperCase(),
    zip: address.zip.trim(),
    phone: address.phone?.trim() || undefined,
    ...US,
  };
}

/** API field keys come back as "shipping_address.zip"; the form uses "zip". */
function formErrors(error: ApiError): Record<string, string> {
  return Object.fromEntries(Object.entries(error.firstErrors()).map(([key, message]) => [key.replace(/^shipping_address\./, ""), message]));
}

async function cartUuid(): Promise<string | null> {
  return (await cookies()).get(CART_COOKIE)?.value ?? null;
}

export async function quoteShipping(address: ShippingAddress): Promise<QuoteResult> {
  const uuid = await cartUuid();
  if (!uuid) {
    return { quotes: [], errors: {}, message: "Your cart is empty." };
  }
  try {
    const response = await api<{ data: ShippingQuote[] }>(`/carts/${uuid}/shipping-quotes`, {
      method: "POST",
      body: { shipping_address: normalizeAddress(address) },
    });
    return { quotes: response.data, errors: {}, message: response.data.length ? null : "No shipping option is available for this address." };
  } catch (error) {
    if (error instanceof ApiError) {
      return { quotes: [], errors: formErrors(error), message: error.status === 422 ? null : "We couldn't get shipping options right now. Please try again." };
    }
    throw error;
  }
}

export async function startCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const uuid = await cartUuid();
  if (!uuid) {
    return { errors: {}, message: "Your cart is empty.", pricesChanged: false };
  }

  let session: CheckoutSession;
  try {
    await flushMarketingTouches(uuid);
    session = (
      await api<{ data: CheckoutSession }>(`/carts/${uuid}/checkout`, {
        method: "POST",
        idempotencyKey: input.idempotencyKey,
        body: {
          email: input.email.trim(),
          shipping_address: normalizeAddress(input.address),
          shipping_method: input.shippingMethod,
          discount_code: input.discountCode.trim() || undefined,
          marketing_consent: input.marketingConsent,
        },
      })
    ).data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.code === "prices_changed") {
        return { errors: {}, message: error.message, pricesChanged: true };
      }
      return { errors: formErrors(error), message: error.status === 422 ? null : error.message, pricesChanged: false };
    }
    throw error;
  }

  (await cookies()).set(LAST_ORDER_COOKIE, session.order_number, {
    httpOnly: true,
    secure: serverConfig.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  redirect(session.checkout_url);
}

/** Called from the success page: the order exists, so the shopper starts with a fresh cart. */
export async function finishCheckout(): Promise<void> {
  await clearCartCookie();
}
