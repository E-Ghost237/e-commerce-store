import type { Metadata } from "next";
import Link from "next/link";
import { CartLineControls } from "@/components/CartLineControls";
import { ui } from "@/components/ui";
import { readCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default async function CartPage() {
  const cart = await readCart();
  const lines = cart?.items ?? [];

  return (
    <div className={`${ui.container} py-10`}>
      <h1 className={ui.h1}>Your cart</h1>
      {lines.length === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-4">
          <p>Your cart is empty.</p>
          <Link href="/#shop" className={ui.buttonPrimary}>Browse products</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_.6fr]">
          <ul className="divide-y-2 divide-ink border-2 border-ink">
            {lines.map((line) => (
              <li key={line.id} className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div>
                  <p className="font-black">{line.name}</p>
                  <p className="text-sm">{line.type === "bundle" ? "Bundle" : "Item"} · {formatMoney(line.unit_price_cents, line.currency)} each</p>
                </div>
                <div className="flex items-start gap-6">
                  <CartLineControls line={line} />
                  <p className="w-24 text-right font-black">{formatMoney(line.line_total_cents, line.currency)}</p>
                </div>
              </li>
            ))}
          </ul>
          <aside className={`${ui.card} h-fit p-6`}>
            <div className="flex justify-between border-b-2 border-ink pb-4 text-lg font-black">
              <span>Subtotal</span>
              <span>{formatMoney(cart?.subtotal_cents ?? 0, cart?.currency)}</span>
            </div>
            <p className="py-4 text-sm">Shipping and any discount are calculated at checkout.</p>
            <Link href="/checkout" className={`${ui.buttonAccent} w-full`}>Continue to checkout →</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
