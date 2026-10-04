"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { api, ApiError } from "@/lib/api";
import { ensureCartUuid, flushMarketingTouches } from "@/lib/cart";
import { CART_COOKIE } from "@/lib/cookies";
import type { Cart } from "@/lib/types";

export type CartActionState = { ok: boolean; message: string | null };

function quantityFrom(formData: FormData): number {
  const quantity = Number(formData.get("quantity") ?? 1);
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= 25 ? quantity : 1;
}

export async function addToCart(_previous: CartActionState, formData: FormData): Promise<CartActionState> {
  const kind = formData.get("kind") === "bundle" ? "bundle" : "variant";
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, message: "Choose an option first." };
  }

  try {
    const cartUuid = await ensureCartUuid();
    await flushMarketingTouches(cartUuid);
    await api<{ data: Cart }>(`/carts/${cartUuid}/items`, {
      method: "POST",
      body: { [kind === "bundle" ? "bundle_id" : "product_variant_id"]: id, quantity: quantityFrom(formData) },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: Object.values(error.firstErrors())[0] ?? error.message };
    }
    throw error;
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Added to your cart." };
}

async function cartUuidOrNull(): Promise<string | null> {
  return (await cookies()).get(CART_COOKIE)?.value ?? null;
}

export async function updateCartLine(formData: FormData): Promise<CartActionState> {
  const cartUuid = await cartUuidOrNull();
  if (!cartUuid) {
    return { ok: false, message: "Your cart has expired." };
  }
  try {
    await api(`/carts/${cartUuid}/items/${Number(formData.get("line"))}`, { method: "PATCH", body: { quantity: quantityFrom(formData) } });
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: Object.values(error.firstErrors())[0] ?? error.message };
    }
    throw error;
  }
  revalidatePath("/", "layout");
  return { ok: true, message: null };
}

export async function removeCartLine(formData: FormData): Promise<void> {
  const cartUuid = await cartUuidOrNull();
  if (cartUuid) {
    await api(`/carts/${cartUuid}/items/${Number(formData.get("line"))}`, { method: "DELETE" }).catch(() => undefined);
  }
  revalidatePath("/", "layout");
}
