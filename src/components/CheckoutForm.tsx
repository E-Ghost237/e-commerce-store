"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { quoteShipping, startCheckout } from "@/app/actions/checkout";
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
      <label className={ui.label} htmlFor={name}>{label}</label>
      <input id={name} name={name} className={ui.input} value={address[name] ?? ""} onChange={(event) => update(name, event.target.value)} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} {...props} />
      {errors[name] && <p id={`${name}-error`} className={ui.error}>{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={pay} className="grid gap-8 lg:grid-cols-[1.3fr_.7fr]" noValidate>
      <div className="flex flex-col gap-8">
        <fieldset className="grid gap-4">
          <legend className="mb-3 text-xl font-black">Contact</legend>
          <div>
            <label className={ui.label} htmlFor="email">E-mail</label>
            <input id="email" type="email" autoComplete="email" required className={ui.input} value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} />
            {errors.email && <p className={ui.error}>{errors.email}</p>}
            <p className="mt-1 text-sm">We send your confirmation and tracking here.</p>
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-ink" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>E-mail me a reminder if I don&apos;t finish checking out, and occasional offers. Unsubscribe anytime.</span>
          </label>
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-xl font-black">Shipping address (US only)</legend>
          <div className="sm:col-span-2">{field("name", "Full name", { autoComplete: "name", required: true, maxLength: 50 })}</div>
          <div className="sm:col-span-2">{field("address_line1", "Address", { autoComplete: "address-line1", required: true })}</div>
          <div className="sm:col-span-2">{field("address_line2", "Apartment, suite (optional)", { autoComplete: "address-line2" })}</div>
          {field("city", "City", { autoComplete: "address-level2", required: true })}
          <div>
            <label className={ui.label} htmlFor="province">State</label>
            <select id="province" className={ui.input} value={address.province} onChange={(event) => update("province", event.target.value)} autoComplete="address-level1" required>
              <option value="">Select…</option>
              {US_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
            {errors.province && <p className={ui.error}>{errors.province}</p>}
          </div>
          {field("zip", "ZIP code", { autoComplete: "postal-code", inputMode: "numeric", required: true, pattern: "\\d{5}(-\\d{4})?" })}
          {field("phone", "Phone (for the carrier, optional)", { autoComplete: "tel", type: "tel" })}
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="mb-3 text-xl font-black">Shipping method</legend>
          {quotes ? (
            quotes.map((quote) => (
              <label key={quote.method} className="flex cursor-pointer items-center justify-between gap-4 border-2 border-ink p-4 has-[:checked]:bg-sand">
                <span className="flex items-center gap-3">
                  <input type="radio" name="shipping_method" className="h-4 w-4 accent-ink" checked={quote.method === method} onChange={() => setMethod(quote.method)} />
                  <span>
                    <span className="block font-bold">{quote.method}</span>
                    {quote.estimated_days && <span className="text-sm">{quote.estimated_days} business days</span>}
                  </span>
                </span>
                <span className="font-black">{formatMoney(quote.shipping_cents)}</span>
              </label>
            ))
          ) : (
            <button type="button" className={ui.buttonGhost} onClick={fetchQuotes} disabled={quoting}>
              {quoting ? "Getting live shipping options…" : "Show shipping options"}
            </button>
          )}
          {errors.shipping_method && <p className={ui.error}>{errors.shipping_method}</p>}
        </fieldset>
      </div>

      <aside className={`${ui.card} h-fit p-6`}>
        <h2 className="border-b-2 border-ink pb-3 text-xl font-black">Order summary</h2>
        <ul className="divide-y divide-stone-300 py-2 text-sm">
          {cart.items.map((line) => (
            <li key={line.id} className="flex justify-between gap-3 py-2">
              <span>{line.quantity} × {line.name}</span>
              <span className="font-bold">{formatMoney(line.line_total_cents, line.currency)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2">
          <label className={ui.label} htmlFor="discount">Discount code</label>
          <input id="discount" className={ui.input} value={discountCode} onChange={(event) => setDiscountCode(event.target.value.toUpperCase())} autoComplete="off" />
          {errors.discount_code && <p className={ui.error}>{errors.discount_code}</p>}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-y-1 text-sm">
          <dt>Subtotal</dt><dd className="text-right">{formatMoney(cart.subtotal_cents, cart.currency)}</dd>
          <dt>Shipping</dt><dd className="text-right">{selectedQuote ? formatMoney(selectedQuote.shipping_cents) : "—"}</dd>
          <dt className="pt-2 text-base font-black">Total</dt>
          <dd className="pt-2 text-right text-base font-black">{formatMoney(cart.subtotal_cents + (selectedQuote?.shipping_cents ?? 0), cart.currency)}{discountCode && <span className="block text-xs font-normal">before discount</span>}</dd>
        </dl>
        <button type="submit" className={`${ui.buttonAccent} mt-5 w-full`} disabled={paying || quoting}>
          {paying ? "Opening secure payment…" : quotes ? "Pay securely with Stripe →" : "Continue →"}
        </button>
        <p aria-live="polite" className="mt-3 min-h-5 text-sm font-bold text-red-700">{message}</p>
        <p className="mt-2 text-xs">The final amount is confirmed by our server. You&apos;ll be redirected to Stripe to pay; we never see your card.</p>
      </aside>
    </form>
  );
}
