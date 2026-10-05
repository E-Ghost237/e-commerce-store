import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Chat, Shield } from "@/components/Icons";
import { ui } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Payment not completed", robots: { index: false } };

export default function CheckoutCancelledPage() {
  return (
    <div className={`${ui.container} grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24`}>
      <div>
        <p className={ui.eyebrow}>Nothing was charged</p>
        <h1 className={`${ui.h1} mt-4`}>Payment not completed.</h1>
        <p className={`${ui.lede} mt-6 max-w-xl`}>
          No money was taken and your cart is exactly where you left it. Pick up where you stopped, or head back to the shop.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/checkout" className={ui.buttonAccent}>
            Return to checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/cart" className={ui.buttonGhost}>
            Review cart
          </Link>
        </div>

        <ul className="mt-10 grid gap-3 text-sm text-ink/60">
          <li className="flex items-center gap-3">
            <Shield className="h-4.5 w-4.5 text-sage" /> Card details are handled by Stripe, never by us
          </li>
          <li className="flex items-center gap-3">
            <Chat className="h-4.5 w-4.5 text-sage" /> Questions?{" "}
            <a className="link-underline font-semibold text-ember" href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>
          </li>
        </ul>
      </div>

      <figure className="relative hidden aspect-4/5 overflow-hidden rounded-[2.5rem] bg-linen lg:block">
        <Image src="/images/bedroom-linen.jpg" alt="A cat curled up on white linen bedding" fill sizes="40vw" className="object-cover" />
      </figure>
    </div>
  );
}
