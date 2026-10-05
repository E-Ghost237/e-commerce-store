"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { quoteShipping, startCheckout } from "@/app/actions/checkout";
import { Check, Chat, Refresh, Shield, Truck } from "@/components/Icons";
import { formatMoney } from "@/lib/money";
import type { Cart, ShippingAddress, ShippingQuote } from "@/lib/types";
import { ui } from "./ui";

const US_STATES = "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" ");

const UNEXPECTED_ERROR = "Something went wrong on our side. Please try again in a moment.";

const emptyAddress: ShippingAddress = { name: "", address_line1: "", address_line2: "", city: "", province: "", zip: "", phone: "", country_code: "US", country: "United States" };

export function CheckoutForm({ cart }: { cart: Cart }) {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [quotes, setQuotes] = useState<ShippingQuote[] | null>(null);
  const [method, setMethod] = useState<string>("");
  const [discountCode, setDiscountCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const [quoting, startQuoting] = useTransition();
  const [paying, startPaying] = useTransition();
  // One key per checkout attempt: double clicks and retries reuse the same order and Stripe session.
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  const selectedQuote = quotes?.find((quote) => quote.method === method) ?? null;
  const itemCount = cart.items.reduce((sum, line) => sum + line.quantity, 0);

  function update(field: keyof ShippingAddress, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
    setQuotes(null);
    setMethod("");
  }

  function fetchQuotes() {
    setMessage(null);
    startQuoting(async () => {
      try {
        const result = await quoteShipping(address);
        setErrors(result.errors);
        setMessage(result.message);
        setQuotes(result.quotes.length ? result.quotes : null);
        setMethod(result.quotes[0]?.method ?? "");
      } catch {
        setMessage(UNEXPECTED_ERROR);
      }
    });
  }

  function pay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quotes) {
      fetchQuotes();
      return;
    }
    setMessage(null);
    startPaying(async () => {
      try {
        const result = await startCheckout({ idempotencyKey, email, address, shippingMethod: method, discountCode, marketingConsent: consent });
        setErrors(result.errors);
        setMessage(result.message);
        if (result.pricesChanged) {
          router.push("/cart");
          router.refresh();
        }
      } catch {
        // Never surface raw errors; the cart and the idempotent checkout attempt are safe to retry.
        setMessage(UNEXPECTED_ERROR);
      }
    });
  }

  const field = (name: keyof ShippingAddress, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className={ui.label} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={ui.input}
        value={address[name] ?? ""}
        onChange={(event) => update(name, event.target.value)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <p id={`${name}-error`} className={ui.error}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={pay} className="grid gap-10 lg:grid-cols-[1.35fr_0.85fr] lg:items-start" noValidate>
      <div className="flex flex-col gap-6">
        <ol aria-label="Checkout steps" className="flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/45">
          <li className="flex items-center gap-2 text-ember">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-terracotta text-[11px] text-white">1</span>
            Details
          </li>
          <li aria-hidden className="h-px w-6 bg-ink/15" />
          <li className="flex items-center gap-2">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${quotes ? "bg-terracotta text-white" : "bg-linen text-ink/50"}`}>2</span>
            Shipping
          </li>
          <li aria-hidden className="h-px w-6 bg-ink/15" />
          <li className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-linen text-[11px] text-ink/50">3</span>
            Payment
          </li>
        </ol>

        <fieldset className={`${ui.card} grid gap-5 p-6 sm:p-7`}>
          <legend className="sr-only">Contact</legend>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-mint text-forest">
              <Chat className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-display text-xl">Where should we e-mail you?</p>
              <p className="text-[13px] text-ink/55">Confirmation and tracking go here. No account needed.</p>
            </div>
          </div>

          <div>
            <label className={ui.label} htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className={ui.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className={ui.error}>
                {errors.email}
              </p>
            )}
          </div>

          <label className="flex items-start gap-3 rounded-2xl bg-linen/70 p-4 text-[13px] leading-relaxed text-ink/70">
            <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-ink" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>E-mail me a reminder if I don&apos;t finish checking out, and occasional offers. Unsubscribe anytime.</span>
          </label>
        </fieldset>

        <fieldset className={`${ui.card} grid gap-5 p-6 sm:grid-cols-2 sm:p-7`}>
          <legend className="sr-only">Shipping address</legend>
          <div className="flex items-center gap-3 sm:col-span-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-mint text-forest">
              <Truck className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-display text-xl">Shipping address</p>
              <p className="text-[13px] text-ink/55">We currently deliver inside the United States.</p>
            </div>
          </div>

          <div className="sm:col-span-2">{field("name", "Full name", { autoComplete: "name", required: true, maxLength: 50 })}</div>
          <div className="sm:col-span-2">{field("address_line1", "Address", { autoComplete: "address-line1", required: true })}</div>
          <div className="sm:col-span-2">{field("address_line2", "Apartment, suite (optional)", { autoComplete: "address-line2" })}</div>
          {field("city", "City", { autoComplete: "address-level2", required: true })}
          <div>
            <label className={ui.label} htmlFor="province">
              State
            </label>
            <select id="province" className={ui.input} value={address.province} onChange={(event) => update("province", event.target.value)} autoComplete="address-level1" required>
              <option value="">Select…</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.province && <p className={ui.error}>{errors.province}</p>}
          </div>
          {field("zip", "ZIP code", { autoComplete: "postal-code", inputMode: "numeric", required: true, pattern: "\\d{5}(-\\d{4})?" })}
          {field("phone", "Phone (for the carrier, optional)", { autoComplete: "tel", type: "tel" })}
        </fieldset>

        <fieldset className={`${ui.card} grid gap-4 p-6 sm:p-7`}>
          <legend className="sr-only">Shipping method</legend>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-mint text-forest">
                <Refresh className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="font-display text-xl">Shipping method</p>
                <p className="text-[13px] text-ink/55">Live options for this address and cart.</p>
              </div>
            </div>
            {quotes && (
              <button type="button" className="text-[13px] font-semibold text-ember underline underline-offset-4" onClick={fetchQuotes} disabled={quoting}>
                {quoting ? "Refreshing…" : "Refresh"}
              </button>
            )}
          </div>

          {quotes ? (
            <div className="grid gap-3">
              {quotes.map((quote) => {
                const active = quote.method === method;
                return (
                  <label
                    key={quote.method}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition ${
                      active ? "border-ink bg-ink text-paper shadow-soft" : "border-ink/12 bg-white hover:border-ink/30"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input type="radio" name="shipping_method" className="sr-only" checked={active} onChange={() => setMethod(quote.method)} />
                      <span className={`grid h-5 w-5 place-items-center rounded-full border ${active ? "border-paper/60 bg-paper/20" : "border-ink/20"}`}>
                        {active && <Check className="h-3 w-3" />}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{quote.method}</span>
                        {quote.estimated_days && <span className={`text-[13px] ${active ? "text-paper/70" : "text-ink/55"}`}>{quote.estimated_days} business days</span>}
                      </span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{formatMoney(quote.shipping_cents)}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <button type="button" className={`${ui.buttonGhost} w-full py-3.5`} onClick={fetchQuotes} disabled={quoting}>
              {quoting ? "Getting live shipping options…" : "Show shipping options"}
            </button>
          )}
          {errors.shipping_method && <p className={ui.error}>{errors.shipping_method}</p>}
        </fieldset>
      </div>

      <aside className={`${ui.card} p-6 sm:p-7 lg:sticky lg:top-28`}>
        <h2 className="font-display text-xl">Order summary</h2>
        <p className="mt-1 text-[13px] text-ink/55">
          {itemCount} item{itemCount === 1 ? "" : "s"} in your cart
        </p>

        <ul className="mt-5 grid gap-3 border-t border-ink/8 pt-5 text-sm">
          {cart.items.map((line) => (
            <li key={line.id} className="flex items-start justify-between gap-4">
              <span className="flex items-start gap-3">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-linen">
                  <Image src="/images/kit-flatlay.jpg" alt="" fill sizes="44px" className="object-cover opacity-90" />
                </span>
                <span className="text-ink/70">
                  {line.quantity} × {line.name}
                </span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums">{formatMoney(line.line_total_cents, line.currency)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-ink/8 pt-5">
          <label className={ui.label} htmlFor="discount">
            Discount code
          </label>
          <input
            id="discount"
            className={ui.input}
            value={discountCode}
            onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
            autoComplete="off"
            placeholder="Optional"
          />
          {errors.discount_code && <p className={ui.error}>{errors.discount_code}</p>}
        </div>

        <dl className="mt-5 grid gap-2 border-t border-ink/8 pt-5 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-ink/60">Subtotal</dt>
            <dd className="font-semibold tabular-nums">{formatMoney(cart.subtotal_cents, cart.currency)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-ink/60">Shipping</dt>
            <dd className="font-semibold tabular-nums">{selectedQuote ? formatMoney(selectedQuote.shipping_cents) : "—"}</dd>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-ink/8 pt-3 font-display text-xl">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatMoney(cart.subtotal_cents + (selectedQuote?.shipping_cents ?? 0), cart.currency)}</dd>
          </div>
        </dl>
        {discountCode && <p className="mt-2 text-right text-xs text-ink/50">Discount applied by our server before payment.</p>}

        <button type="submit" className={`${ui.buttonAccent} mt-6 w-full py-4`} disabled={paying || quoting}>
          {paying ? "Opening secure payment…" : quotes ? "Pay securely with Stripe →" : "Continue →"}
        </button>

        <p aria-live="polite" className="mt-3 min-h-5 text-[13px] font-medium text-red-700">
          {message}
        </p>

        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink/55">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
          The final amount is confirmed by our server. You&apos;ll be redirected to Stripe to pay; card details never touch our servers.
        </p>
      </aside>
    </form>
  );
}
