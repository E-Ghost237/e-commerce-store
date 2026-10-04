"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { addToCart, type CartActionState } from "@/app/actions/cart";
import { formatMoney } from "@/lib/money";
import type { ProductVariant } from "@/lib/types";
import { ui } from "./ui";

const initialState: CartActionState = { ok: false, message: null };

type Props =
  | { kind: "bundle"; id: number; label?: string; variants?: never }
  | { kind: "variant"; variants: ProductVariant[]; id?: never; label?: string };

export function AddToCartForm(props: Props) {
  const [state, formAction, pending] = useActionState(addToCart, initialState);
  const purchasable = props.kind === "variant" ? props.variants.filter((variant) => variant.price_cents !== null) : [];
  const [variantId, setVariantId] = useState<number | null>(purchasable.find((variant) => variant.in_stock)?.id ?? purchasable[0]?.id ?? null);
  const selected = purchasable.find((variant) => variant.id === variantId);
  const soldOut = props.kind === "variant" && (!selected || !selected.in_stock);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="kind" value={props.kind} />
      <input type="hidden" name="id" value={props.kind === "bundle" ? props.id : (variantId ?? "")} />

      {props.kind === "variant" && purchasable.length > 1 && (
        <fieldset>
          <legend className={ui.label}>Option</legend>
          <div className="flex flex-wrap gap-2">
            {purchasable.map((variant) => (
              <label key={variant.id} className={`cursor-pointer border-2 border-ink px-4 py-2 text-sm font-bold has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-coral ${variant.in_stock ? "" : "opacity-60 line-through"}`}>
                <input className="sr-only" type="radio" name="variant" value={variant.id} checked={variant.id === variantId} onChange={() => setVariantId(variant.id)} />
                {variant.name} · {formatMoney(variant.price_cents)}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-end gap-3">
        <div className="w-24">
          <label className={ui.label} htmlFor={`qty-${props.kind}-${props.id ?? "product"}`}>Qty</label>
          <input id={`qty-${props.kind}-${props.id ?? "product"}`} className={ui.input} type="number" name="quantity" min={1} max={25} defaultValue={1} required />
        </div>
        <button type="submit" className={`${ui.buttonPrimary} flex-1`} disabled={pending || soldOut}>
          {pending ? "Adding…" : soldOut ? "Sold out" : (props.label ?? "Add to cart")}
        </button>
      </div>

      <p aria-live="polite" className={`min-h-5 text-sm font-bold ${state.ok ? "text-emerald-800" : "text-red-700"}`}>
        {state.message}
        {state.ok && (
          <>
            {" "}
            <Link className="underline" href="/cart">View cart →</Link>
          </>
        )}
      </p>
    </form>
  );
}
