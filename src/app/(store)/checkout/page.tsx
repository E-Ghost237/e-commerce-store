import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { ui } from "@/components/ui";
import { readCart } from "@/lib/cart";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const cart = await readCart();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className={`${ui.container} py-10`}>
      <h1 className={`${ui.h1} mb-8`}>Checkout</h1>
      <CheckoutForm cart={cart} />
    </div>
  );
}
