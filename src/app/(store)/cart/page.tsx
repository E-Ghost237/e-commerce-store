import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Refresh, Shield, Truck } from "@/components/Icons";
import { CartLineControls } from "@/components/CartLineControls";
import { ProductCard } from "@/components/ProductCard";
import { ui } from "@/components/ui";
import { site } from "@/content/site";
import { readCart } from "@/lib/cart";
import { listProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default async function CartPage() {
  const cart = await readCart();
  const lines = cart?.items ?? [];
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  if (lines.length === 0) {
    return (
      <div className={`${ui.container} grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24`}>
        <div>
          <p className={ui.eyebrow}>Your cart</p>
          <h1 className={`${ui.h1} mt-4`}>Nothing in here yet.</h1>
          <p className={`${ui.lede} mt-6 max-w-md`}>
            Add a kit and we&apos;ll keep it here while you look around. No account needed, and nothing is charged until you check out.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/#bundles" className={ui.buttonAccent}>
              Shop the kit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#shop" className={ui.buttonGhost}>
              Browse the collection
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink/60">
            <li className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-sage" /> No refills to rebuy
            </li>
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-sage" /> Ships from the US
            </li>
            <li className="flex items-center gap-2">
              <Refresh className="h-4 w-4 text-sage" /> 30-day returns
            </li>
          </ul>
        </div>
        <figure className="relative hidden aspect-square overflow-hidden rounded-[2.5rem] bg-linen lg:block">
          <Image src="/images/kit-flatlay.jpg" alt="Roller, grooming glove and brush arranged on a cream surface" fill sizes="45vw" className="object-cover" />
        </figure>
      </div>
    );
  }

  const suggestions = (await listProducts().catch(() => [])).filter((product) => !lines.some((line) => line.name.includes(product.name))).slice(0, 3);

  return (
    <div className={`${ui.container} py-12 sm:py-16`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={ui.eyebrow}>Your cart</p>
          <h1 className={`${ui.h1} mt-3 text-[2.25rem] sm:text-5xl`}>
            {itemCount} item{itemCount === 1 ? "" : "s"}, ready when you are.
          </h1>
        </div>
        <Link href="/#shop" className="text-sm font-semibold text-ink/55 underline underline-offset-4 hover:text-ink">
          Keep shopping
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_0.9fr] lg:items-start">
        <ul className="grid gap-4">
          {lines.map((line) => (
            <li key={line.id} className={`${ui.card} flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6`}>
              <div className="flex items-start gap-4">
                <span className="hidden h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-linen sm:block">
                  <Image src="/images/kit-flatlay.jpg" alt="" width={128} height={128} className="h-full w-full object-cover opacity-90" />
                </span>
                <div>
                  <p className="font-display text-lg leading-snug">{line.name}</p>
                  <p className="mt-1.5 text-[13px] text-ink/55">
                    <span className="rounded-full bg-linen px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">
                      {line.type === "bundle" ? "Bundle" : "Single"}
                    </span>{" "}
                    {formatMoney(line.unit_price_cents, line.currency)} each
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end sm:gap-6">
                <CartLineControls line={line} />
                <p className="font-display text-xl tabular-nums">{formatMoney(line.line_total_cents, line.currency)}</p>
              </div>
            </li>
          ))}
        </ul>

        <aside className={`${ui.card} sticky top-28 p-6 sm:p-7`}>
          <h2 className="font-display text-xl">Order summary</h2>
          <dl className="mt-5 grid gap-3 border-t border-ink/8 pt-5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="font-semibold tabular-nums">{formatMoney(cart?.subtotal_cents ?? 0, cart?.currency)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink/60">Shipping</dt>
              <dd className="text-ink/50">Calculated at checkout</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink/60">Discount</dt>
              <dd className="text-ink/50">Applied at checkout</dd>
            </div>
          </dl>

          <Link href="/checkout" className={`${ui.buttonAccent} mt-6 w-full py-4`}>
            Continue to checkout →
          </Link>

          <ul className="mt-6 grid gap-2.5 text-[13px] text-ink/60">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-sage" /> Payment on Stripe&apos;s hosted page
            </li>
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-sage" /> Live US shipping quotes before you pay
            </li>
            <li className="flex items-center gap-2">
              <Refresh className="h-4 w-4 text-sage" /> 30-day returns
            </li>
          </ul>
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section aria-labelledby="cart-suggestions" className="mt-16">
          <h2 id="cart-suggestions" className={`${ui.h2} text-2xl sm:text-3xl`}>
            Add a finishing touch
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-12 text-center text-sm text-ink/50">
        Something wrong with your order? Write to{" "}
        <a className="link-underline font-semibold text-ember" href={`mailto:${site.supportEmail}`}>
          {site.supportEmail}
        </a>
        .
      </p>
    </div>
  );
}
