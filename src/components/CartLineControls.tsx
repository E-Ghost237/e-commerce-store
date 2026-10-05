"use client";

import { useState, useTransition } from "react";
import { removeCartLine, updateCartLine } from "@/app/actions/cart";
import type { CartLine } from "@/lib/types";
import { Minus, Plus } from "./Icons";

const MAX_QUANTITY = 25;

export function CartLineControls({ line }: { line: CartLine }) {
  const [quantity, setQuantity] = useState(line.quantity);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function changeQuantity(next: number) {
    const clamped = Math.min(MAX_QUANTITY, Math.max(1, next));
    if (clamped === quantity) {
      return;
    }
    setQuantity(clamped);
    const formData = new FormData();
    formData.set("line", String(line.id));
    formData.set("quantity", String(clamped));
    startTransition(async () => {
      try {
        const result = await updateCartLine(formData);
        setMessage(result.ok ? null : result.message);
        if (!result.ok) {
          setQuantity(line.quantity);
        }
      } catch {
        setQuantity(line.quantity);
        setMessage("Something went wrong on our side. Please try again in a moment.");
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 rounded-full border border-ink/12 bg-white p-1 transition ${pending ? "opacity-60" : ""}`}>
          <button
            type="button"
            onClick={() => changeQuantity(quantity - 1)}
            disabled={pending || quantity <= 1}
            aria-label={`Decrease quantity of ${line.name}`}
            className="grid h-8 w-8 place-items-center rounded-full text-ink/70 hover:bg-linen disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span aria-live="polite" className="min-w-7 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => changeQuantity(quantity + 1)}
            disabled={pending || quantity >= MAX_QUANTITY}
            aria-label={`Increase quantity of ${line.name}`}
            className="grid h-8 w-8 place-items-center rounded-full text-ink/70 hover:bg-linen disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <form action={removeCartLine}>
          <input type="hidden" name="line" value={line.id} />
          <button type="submit" className="rounded-full px-3 py-2 text-[13px] font-medium text-ink/50 underline underline-offset-4 hover:text-ember" disabled={pending}>
            Remove
          </button>
        </form>
      </div>
      {message && (
        <p role="alert" className="text-[13px] font-medium text-red-700">
          {message}
        </p>
      )}
    </div>
  );
}
