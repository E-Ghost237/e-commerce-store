"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { addToCart, type CartActionState } from "@/app/actions/cart";
import { formatMoney } from "@/lib/money";
import type { ProductVariant } from "@/lib/types";
import { ArrowRight, Check, Minus, Plus } from "./Icons";
import { ui } from "./ui";

const initialState: CartActionState = { ok: false, message: null };
const MAX_QUANTITY = 25;

type Props =
  | { kind: "bundle"; id: number; label?: string; variants?: never }
  | { kind: "variant"; variants: ProductVariant[]; id?: never; label?: string };

export function AddToCartForm(props: Props) {
  const [state, formAction, pending] = useActionState(addToCart, initialState);
  const purchasable = props.kind === "variant" ? props.variants.filter((variant) => variant.price_cents !== null) : [];
  const [variantId, setVariantId] = useState<number | null>(purchasable.find((variant) => variant.in_stock)?.id ?? purchasable[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const selected = purchasable.find((variant) => variant.id === variantId);
  const soldOut = props.kind === "variant" && (!selected || !selected.in_stock);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="kind" value={props.kind} />
      <input type="hidden" name="id" value={props.kind === "bundle" ? props.id : (variantId ?? "")} />
      <input type="hidden" name="quantity" value={quantity} />

      {props.kind === "variant" && purchasable.length > 1 && (
        <fieldset>
          <legend className={ui.label}>Choose an option</legend>
          <div className="flex flex-wrap gap-2.5">
            {purchasable.map((variant) => {
              const active = variant.id === variantId;
              return (
                <label
                  key={variant.id}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition ${
                    active ? "border-ink bg-ink text-paper shadow-soft" : "border-ink/12 bg-white text-ink hover:border-ink/30"
                  } ${variant.in_stock ? "" : "opacity-50"}`}
                >
                  <input className="sr-only" type="radio" name="variant" value={variant.id} checked={active} onChange={() => setVariantId(variant.id)} />
                  <span className="block font-semibold">{variant.name}</span>
                  <span className={`mt-0.5 block text-xs ${active ? "text-paper/70" : "text-ink/50"}`}>
                    {variant.in_stock ? formatMoney(variant.price_cents) : "Sold out"}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center justify-between gap-1 rounded-full border border-ink/12 bg-white p-1 sm:w-40">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1 || pending}
            aria-label="Decrease quantity"
            className="grid h-10 w-10 place-items-center rounded-full text-ink/70 hover:bg-linen disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="min-w-6 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
            disabled={quantity >= MAX_QUANTITY || pending}
            aria-label="Increase quantity"
            className="grid h-10 w-10 place-items-center rounded-full text-ink/70 hover:bg-linen disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="sr-only">Quantity</span>
        </div>

        <button type="submit" className={`${ui.buttonPrimary} flex-1 py-4`} disabled={pending || soldOut}>
          {pending ? (
            "Adding…"
          ) : soldOut ? (
            "Sold out"
          ) : (
            <>
              {props.label ?? "Add to cart"}
              {!pending && !soldOut && <ArrowRight className="h-4 w-4" />}
            </>
          )}
        </button>
      </div>

      <p aria-live="polite" className={`min-h-5 text-sm font-medium ${state.ok ? "text-sage" : "text-red-700"}`}>
        {state.ok ? (
          <>
            <Check className="mr-1 inline h-4 w-4 align-[-3px]" />
            {state.message}{" "}
            <Link className="link-underline font-semibold text-ember" href="/cart">
              View cart
            </Link>
          </>
        ) : (
          state.message
        )}
      </p>
    </form>
  );
}
