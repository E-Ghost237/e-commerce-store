"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { adminApi } from "@/lib/admin";
import { serverConfig } from "@/lib/config";
import { ADMIN_COOKIE } from "@/lib/cookies";
import { parseDollarsToCents } from "@/lib/money";

export type AdminActionState = { ok: boolean; message: string | null; errors: string[]; data?: Record<string, unknown> };

const idle: AdminActionState = { ok: false, message: null, errors: [] };

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optionalText(formData: FormData, key: string): string | null {
  return text(formData, key) || null;
}

function intOrNull(formData: FormData, key: string): number | null {
  const value = text(formData, key);
  return value === "" || !/^\d+$/.test(value) ? null : Number(value);
}

/** Run an admin API write and translate failures into form state. */
async function attempt(run: () => Promise<unknown>, success: string, paths: string[] = []): Promise<AdminActionState> {
  let result: unknown;
  try {
    result = await run();
  } catch (error) {
    if (error instanceof ApiError) {
      const errors = Object.values(error.fieldErrors).flat();
      return { ok: false, message: errors.length ? null : `${error.message}${error.correlationId ? ` (ref ${error.correlationId})` : ""}`, errors };
    }
    throw error;
  }
  for (const path of paths) {
    revalidatePath(path);
  }
  const data = (result as { data?: Record<string, unknown> } | undefined)?.data;
  return { ...idle, ok: true, message: success, data };
}

export async function signIn(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  let token: string;
  try {
    const response = await api<{ data: { token: string; expires_at: string; mfa_enrollment_required: boolean } }>("/admin/tokens", {
      method: "POST",
      body: { email: text(formData, "email"), password: String(formData.get("password") ?? ""), code: optionalText(formData, "code"), device_name: "back-office" },
    });
    token = response.data.token;
  } catch (error) {
    if (error instanceof ApiError) {
      return { ...idle, message: error.status === 429 ? "Too many attempts. Wait a minute and try again." : null, errors: Object.values(error.fieldErrors).flat() };
    }
    throw error;
  }

  (await cookies()).set(ADMIN_COOKIE, token, { httpOnly: true, secure: serverConfig.isProduction, sameSite: "strict", path: "/admin", maxAge: 60 * 60 * 12 });
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  await adminApi("/tokens/current", { method: "DELETE" }).catch(() => undefined);
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

export async function fulfillmentAction(fulfillmentId: number, orderId: number, _previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const action = text(formData, "action");
  if (!["retry", "hold", "release", "cancel"].includes(action)) {
    return { ...idle, errors: ["Unknown action."] };
  }
  return attempt(() => adminApi(`/fulfillments/${fulfillmentId}/${action}`, { method: "POST", body: { note: text(formData, "note") } }), `Fulfilment ${action} recorded.`, [`/admin/orders/${orderId}`]);
}

export async function refundOrder(orderId: number, _previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const amount = parseDollarsToCents(formData.get("amount"));
  if (amount === null || amount <= 0) {
    return { ...idle, errors: ["Enter a refund amount like 12.50."] };
  }
  return attempt(() => adminApi(`/orders/${orderId}/refunds`, { method: "POST", body: { amount_cents: amount, reason: optionalText(formData, "reason") } }), "Refund sent to Stripe.", [`/admin/orders/${orderId}`]);
}

export async function addOrderNote(orderId: number, _previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return attempt(() => adminApi(`/orders/${orderId}/notes`, { method: "POST", body: { body: text(formData, "body") } }), "Note added.", [`/admin/orders/${orderId}`]);
}

export async function saveProduct(productId: number | null, _previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const ids = formData.getAll("variant_id").map(String);
  const variants = ids.map((id, index) => {
    const price = parseDollarsToCents(formData.getAll("variant_price")[index] ?? null);
    const cost = parseDollarsToCents(formData.getAll("variant_cost")[index] ?? null);
    return {
      ...(id ? { id: Number(id) } : {}),
      sku: String(formData.getAll("variant_sku")[index] ?? "").trim(),
      name: String(formData.getAll("variant_name")[index] ?? "").trim(),
      status: String(formData.getAll("variant_status")[index] ?? "draft"),
      currency: "USD",
      ...(price !== null ? { price_cents: price } : {}),
      unit_cost_cents: cost,
    };
  }).filter((variant) => variant.sku !== "" || variant.name !== "");

  const imageUrl = text(formData, "image_url");
  const body = {
    name: text(formData, "name"),
    slug: text(formData, "slug"),
    description: optionalText(formData, "description"),
    status: text(formData, "status"),
    seo_title: optionalText(formData, "seo_title"),
    seo_description: optionalText(formData, "seo_description"),
    ...(imageUrl ? { images: [{ url: imageUrl, alt_text: text(formData, "image_alt") || text(formData, "name"), position: 0, is_primary: true }] } : {}),
    variants,
  };

  const result = await attempt(
    () => adminApi(productId ? `/products/${productId}` : "/products", { method: productId ? "PATCH" : "POST", body }),
    "Product saved.",
    ["/admin/products"],
  );
  if (result.ok && !productId && result.data?.id) {
    redirect(`/admin/products/${result.data.id}`);
  }
  return result;
}

export async function saveBundle(bundleId: number | null, _previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const price = parseDollarsToCents(formData.get("price"));
  const variantIds = formData.getAll("item_variant").map(String);
  const quantities = formData.getAll("item_quantity").map(String);
  const items = variantIds
    .map((variantId, index) => ({ product_variant_id: Number(variantId), quantity: Number(quantities[index] || 1) }))
    .filter((item) => item.product_variant_id > 0);

  const result = await attempt(
    () =>
      adminApi(bundleId ? `/bundles/${bundleId}` : "/bundles", {
        method: bundleId ? "PATCH" : "POST",
        body: {
          name: text(formData, "name"),
          slug: text(formData, "slug"),
          description: optionalText(formData, "description"),
          price_cents: price,
          badge: optionalText(formData, "badge"),
          sort_order: intOrNull(formData, "sort_order") ?? 0,
          status: text(formData, "status"),
          items,
        },
      }),
    "Bundle saved.",
    ["/admin/bundles"],
  );
  if (result.ok && !bundleId && result.data?.id) {
    redirect(`/admin/bundles/${result.data.id}`);
  }
  return result;
}

export async function saveDiscount(discountId: number | null, _previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const type = text(formData, "type");
  const value = type === "fixed" ? parseDollarsToCents(formData.get("value")) : intOrNull(formData, "value");
  const minimum = parseDollarsToCents(formData.get("minimum") || "0") ?? 0;
  const ids = (key: string) => {
    const values = formData.getAll(key).map(Number).filter((id) => id > 0);
    return values.length ? values : null;
  };
  const body = {
    ...(discountId ? {} : { code: text(formData, "code"), type }),
    value,
    minimum_subtotal_cents: minimum,
    product_ids: ids("product_ids"),
    bundle_ids: ids("bundle_ids"),
    usage_limit: intOrNull(formData, "usage_limit"),
    starts_at: optionalText(formData, "starts_at"),
    ends_at: optionalText(formData, "ends_at"),
    active: formData.get("active") === "on",
  };

  const result = await attempt(() => adminApi(discountId ? `/discounts/${discountId}` : "/discounts", { method: discountId ? "PATCH" : "POST", body }), "Discount saved.", ["/admin/discounts"]);
  if (result.ok && !discountId) {
    redirect("/admin/discounts");
  }
  return result;
}

export async function saveSupplier(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return attempt(() => adminApi("/suppliers", { method: "POST", body: { name: text(formData, "name"), code: text(formData, "code").toUpperCase(), status: "active" } }), "Supplier added.", ["/admin/suppliers"]);
}

export async function saveMapping(mappingId: number | null, _previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const cost = parseDollarsToCents(formData.get("unit_cost"));
  const body = {
    ...(mappingId ? {} : { supplier_id: intOrNull(formData, "supplier_id"), product_variant_id: intOrNull(formData, "product_variant_id") }),
    supplier_sku: text(formData, "supplier_sku"),
    warehouse: optionalText(formData, "warehouse")?.toUpperCase() ?? null,
    unit_cost_cents: cost,
  };
  return attempt(() => adminApi(mappingId ? `/supplier-products/${mappingId}` : "/supplier-products", { method: mappingId ? "PATCH" : "POST", body }), "Mapping saved.", ["/admin/suppliers"]);
}

export async function syncMapping(mappingId: number, _previous: AdminActionState): Promise<AdminActionState> {
  return attempt(() => adminApi(`/supplier-products/${mappingId}/sync`, { method: "POST" }), "Stock refresh queued.", ["/admin/suppliers"]);
}

export async function recordAdSpend(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return attempt(
    () =>
      adminApi("/ad-spends", {
        method: "POST",
        body: {
          spent_on: text(formData, "spent_on"),
          utm_source: text(formData, "utm_source"),
          utm_campaign: optionalText(formData, "utm_campaign"),
          utm_content: optionalText(formData, "utm_content"),
          amount_cents: parseDollarsToCents(formData.get("amount")),
        },
      }),
    "Ad spend recorded.",
    ["/admin/marketing", "/admin"],
  );
}

export async function beginMfa(_previous: AdminActionState): Promise<AdminActionState> {
  return attempt(() => adminApi("/mfa", { method: "POST" }), "Scan the key into your authenticator app, then confirm with a code.");
}

export async function confirmMfa(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  // No revalidation here: re-rendering would swap the panel and hide the one-time recovery codes.
  return attempt(() => adminApi("/mfa/confirm", { method: "POST", body: { code: text(formData, "code") } }), "Two-factor authentication is on. Store these recovery codes somewhere safe; they are shown once.");
}

export async function disableMfa(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return attempt(() => adminApi("/mfa", { method: "DELETE", body: { code: text(formData, "code") } }), "Two-factor authentication is off.", ["/admin/security"]);
}
