"use client";

import { useState, useTransition } from "react";
import { removeCartLine, updateCartLine } from "@/app/actions/cart";
import type { CartLine } from "@/lib/types";
import { ui } from "./ui";

export function CartLineControls({ line }: { line: CartLine }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function changeQuantity(quantity: number) {
    const formData = new FormData();
    formData.set("line", String(line.id));
    formData.set("quantity", String(quantity));
    startTransition(async () => {
      try {
        const result = await updateCartLine(formData);
        setMessage(result.ok ? null : result.message);
      } catch {
        setMessage("Something went wrong on our side. Please try again in a moment.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor={`qty-${line.id}`}>Quantity for {line.name}</label>
        <select id={`qty-${line.id}`} className={`${ui.input} w-20 py-1.5`} defaultValue={line.quantity} disabled={pending} onChange={(event) => changeQuantity(Number(event.target.value))}>
          {Array.from({ length: 25 }, (_, index) => index + 1).map((quantity) => (
            <option key={quantity} value={quantity}>{quantity}</option>
          ))}
        </select>
        <form action={removeCartLine}>
          <input type="hidden" name="line" value={line.id} />
          <button type="submit" className="text-sm font-bold underline" disabled={pending}>Remove</button>
        </form>
      </div>
      {message && <p role="alert" className={ui.error}>{message}</p>}
    </div>
  );
}
