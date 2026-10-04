import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";
import { ui } from "@/components/ui";
import { LAST_ORDER_COOKIE } from "@/lib/cookies";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

/** Returning from Stripe proves nothing: the order is confirmed only when Stripe's signed webhook arrives. */
export default async function CheckoutSuccessPage() {
  const orderNumber = (await cookies()).get(LAST_ORDER_COOKIE)?.value;

  return (
    <div className={`${ui.container} max-w-2xl py-16`}>
      <ClearCartOnMount />
      <p className={ui.eyebrow}>Thank you</p>
      <h1 className={`${ui.h1} mt-2`}>We&apos;re confirming your payment.</h1>
      <p className="mt-6 text-lg">
        {orderNumber ? <>Your order number is <strong>{orderNumber}</strong>. </> : null}
        A confirmation e-mail is on its way as soon as Stripe confirms the payment, usually within a minute. Tracking follows when your order ships.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={orderNumber ? `/tracking?order=${encodeURIComponent(orderNumber)}` : "/tracking"} className={ui.buttonPrimary}>Track your order</Link>
        <Link href="/" className={ui.buttonGhost}>Back to the shop</Link>
      </div>
    </div>
  );
}
