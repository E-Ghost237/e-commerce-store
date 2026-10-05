import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Shield } from "@/components/Icons";
import { ui } from "@/components/ui";
import { site } from "@/content/site";
import { readCart } from "@/lib/cart";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const cart = await readCart();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className={`${ui.container} py-12 sm:py-16`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={ui.eyebrow}>Secure checkout</p>
          <h1 className={`${ui.h1} mt-3 text-[2.25rem] sm:text-5xl`}>Almost yours.</h1>
          <p className="mt-4 flex items-center gap-2 text-sm text-ink/60">
            <Shield className="h-4 w-4 text-sage" />
            Payment is handled by Stripe. We never see or store your card.
          </p>
        </div>
        <Link href="/cart" className="text-sm font-semibold text-ink/55 underline underline-offset-4 hover:text-ink">
          ← Back to cart
        </Link>
      </div>

      <div className="mt-10">
        <CheckoutForm cart={cart} />
      </div>

      <p className="mt-12 text-center text-sm text-ink/50">
        Need a hand? Write to{" "}
        <a className="link-underline font-semibold text-ember" href={`mailto:${site.supportEmail}`}>
          {site.supportEmail}
        </a>
        .
      </p>
    </div>
  );
}
