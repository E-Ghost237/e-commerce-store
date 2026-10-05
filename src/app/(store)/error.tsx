"use client";

import Link from "next/link";
import { Refresh } from "@/components/Icons";
import { ui } from "@/components/ui";

export default function StoreError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={`${ui.container} grid place-items-center py-20 text-center sm:py-28`}>
      <div className="max-w-xl">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-linen text-ink/60">
          <Refresh className="h-6 w-6" />
        </span>
        <h1 className={`${ui.h1} mt-6`}>Something went wrong.</h1>
        <p className={`${ui.lede} mt-5`}>Please try again in a moment. Your cart is safe.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className={ui.buttonPrimary}>
            Try again
          </button>
          <Link href="/" className={ui.buttonGhost}>
            Back to the shop
          </Link>
        </div>
      </div>
    </div>
  );
}
