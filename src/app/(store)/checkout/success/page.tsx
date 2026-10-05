import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Chat, Check, Refresh, Truck } from "@/components/Icons";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";
import { ui } from "@/components/ui";
import { site } from "@/content/site";
import { LAST_ORDER_COOKIE } from "@/lib/cookies";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

const nextSteps = [
  { title: "Payment confirmed", body: "Stripe confirms the charge to our servers, usually within a minute or two." },
  { title: "Confirmation e-mail", body: "It lands as soon as the payment is confirmed, with your order number and receipt." },
  { title: "Fulfilment & tracking", body: "Your order goes to our warehouse, and tracking follows the moment it ships." },
];

/** Returning from Stripe proves nothing: the order is confirmed only when Stripe's signed webhook arrives. */
export default async function CheckoutSuccessPage() {
  const orderNumber = (await cookies()).get(LAST_ORDER_COOKIE)?.value;

  return (
    <div className={`${ui.container} grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24`}>
      <ClearCartOnMount />

      <div>
        <span className="grid h-14 w-14 place-items-center rounded-3xl bg-mint text-forest">
          <Check className="h-7 w-7" />
        </span>
        <p className={`${ui.eyebrow} mt-6`}>Thank you</p>
        <h1 className={`${ui.h1} mt-4`}>We&apos;re confirming your payment.</h1>

        {orderNumber && (
          <p className="mt-7 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-white px-5 py-4 text-sm shadow-soft">
            <span className="text-ink/55">Order number</span>
            <strong className="font-display text-lg">{orderNumber}</strong>
          </p>
        )}

        <p className={`${ui.lede} mt-6 max-w-xl`}>
          A confirmation e-mail is on its way as soon as Stripe confirms the payment, usually within a minute. Tracking follows when your order ships.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href={orderNumber ? `/tracking?order=${encodeURIComponent(orderNumber)}` : "/tracking"} className={ui.buttonPrimary}>
            Track your order
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/#shop" className={ui.buttonGhost}>
            Back to the shop
          </Link>
        </div>

        <p className="mt-8 flex items-center gap-2 text-sm text-ink/55">
          <Chat className="h-4 w-4 text-sage" />
          Wrong address or a question?{" "}
          <a className="link-underline font-semibold text-ember" href={`mailto:${site.supportEmail}`}>
            {site.supportEmail}
          </a>
        </p>
      </div>

      <div className="grid gap-6">
        <div className={`${ui.card} overflow-hidden`}>
          <div className="relative h-40">
            <Image src="/images/kit-flatlay.jpg" alt="Roller, grooming glove and brush on a cream surface" fill sizes="40vw" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-ink/45 to-transparent" />
          </div>
          <div className="p-6">
            <h2 className="font-display text-xl">What happens next</h2>
            <ol className="mt-5 grid gap-5">
              {nextSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-linen text-xs font-semibold text-ink/60">{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink/60">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <ul className="grid gap-3 rounded-3xl bg-linen p-6 text-sm text-ink/70">
          <li className="flex items-center gap-3">
            <Truck className="h-4.5 w-4.5 text-sage" /> Ships from the US with tracking
          </li>
          <li className="flex items-center gap-3">
            <Refresh className="h-4.5 w-4.5 text-sage" /> 30-day returns, no restocking fees
          </li>
        </ul>
      </div>
    </div>
  );
}
