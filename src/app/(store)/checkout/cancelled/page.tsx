import type { Metadata } from "next";
import Link from "next/link";
import { ui } from "@/components/ui";

export const metadata: Metadata = { title: "Payment not completed", robots: { index: false } };

export default function CheckoutCancelledPage() {
  return (
    <div className={`${ui.container} max-w-2xl py-16`}>
      <h1 className={ui.h1}>Payment not completed.</h1>
      <p className="mt-6 text-lg">No money was taken. Your cart is saved, so you can pick up where you left off.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/checkout" className={ui.buttonAccent}>Return to checkout</Link>
        <Link href="/cart" className={ui.buttonGhost}>Review cart</Link>
      </div>
    </div>
  );
}
