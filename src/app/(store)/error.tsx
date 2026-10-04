"use client";

import { ui } from "@/components/ui";

export default function StoreError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={`${ui.container} max-w-2xl py-16`}>
      <h1 className={ui.h1}>Something went wrong.</h1>
      <p className="mt-6 text-lg">Please try again in a moment. Your cart is safe.</p>
      <button type="button" onClick={reset} className={`${ui.buttonPrimary} mt-8`}>Try again</button>
    </div>
  );
}
