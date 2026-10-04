"use client";

import { useMemo, useState } from "react";

const products = [
  { id: 1, name: "Long Sleeve Knit Sweater", color: "Red / S", price: 3597, tag: "New", shade: "bg-rose-200" },
  { id: 2, name: "Everyday Canvas Tote", color: "Natural", price: 2497, tag: "Essential", shade: "bg-amber-100" },
  { id: 3, name: "Soft Ribbed Beanie", color: "Pine", price: 1897, tag: "Warm", shade: "bg-emerald-200" },
];

const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export default function Home() {
  const [cart, setCart] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const total = useMemo(() => cart.reduce((sum, id) => sum + (products.find((product) => product.id === id)?.price ?? 0), 0), [cart]);
  const add = (id: number) => { setCart((items) => [...items, id]); setNotice("Added to your cart"); };

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#14213d]">
      <header className="border-b-2 border-[#14213d] bg-[#f7f5ef]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a className="text-xl font-black tracking-[-0.08em]" href="#top">COMMON/CORE</a>
          <nav className="hidden items-center gap-7 text-sm font-bold md:flex"><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#support">Support</a></nav>
          <a className="border-2 border-[#14213d] bg-[#ff6b5e] px-4 py-2 text-sm font-black" href="#cart">Cart · {cart.length}</a>
        </div>
      </header>

      <section id="top" className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:py-20">
        <div className="flex flex-col justify-between gap-10 border-2 border-[#14213d] bg-[#ff6b5e] p-7 sm:p-10">
          <p className="w-fit bg-[#14213d] px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-[#f7f5ef]">Autumn edit / 2026</p>
          <div><p className="mb-4 text-sm font-bold uppercase tracking-[.12em]">Made for the everyday</p><h1 className="max-w-xl text-5xl font-black leading-[.9] tracking-[-.08em] sm:text-7xl">Good pieces.<br />No noise.</h1></div>
          <a href="#shop" className="w-fit border-2 border-[#14213d] bg-[#f7f5ef] px-5 py-3 text-sm font-black">Shop the collection →</a>
        </div>
        <div className="relative min-h-80 overflow-hidden border-2 border-[#14213d] bg-[#9ed6d1] p-7"><div className="absolute -right-16 -top-12 h-72 w-72 rounded-full border-[18px] border-[#14213d]" /><div className="absolute bottom-8 left-8 h-44 w-40 rounded-t-[5rem] bg-[#14213d]" /><p className="relative z-10 max-w-44 text-2xl font-black leading-none tracking-[-.06em]">Comfort you can see.</p></div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><div className="mb-7 flex items-end justify-between border-b-2 border-[#14213d] pb-4"><div><p className="text-xs font-bold uppercase tracking-[.18em]">The collection</p><h2 className="text-3xl font-black tracking-[-.06em]">Small, useful, ready.</h2></div><span className="text-sm font-bold">03 pieces</span></div><div className="grid gap-5 md:grid-cols-3">{products.map((product) => <article key={product.id} className="border-2 border-[#14213d] bg-[#f7f5ef]"><div className={`relative h-64 border-b-2 border-[#14213d] ${product.shade}`}><span className="absolute left-4 top-4 bg-[#f7f5ef] px-2 py-1 text-xs font-black">{product.tag}</span><div className="absolute bottom-0 left-1/2 h-44 w-28 -translate-x-1/2 rounded-t-[4rem] border-2 border-b-0 border-[#14213d] bg-[#f7f5ef]" /></div><div className="flex flex-col gap-4 p-5"><div className="flex justify-between gap-3"><div><h3 className="font-black tracking-[-.04em]">{product.name}</h3><p className="text-sm">{product.color}</p></div><p className="font-black">{money(product.price)}</p></div><button onClick={() => add(product.id)} className="border-2 border-[#14213d] bg-[#14213d] px-4 py-3 text-sm font-black text-[#f7f5ef] hover:bg-[#ff6b5e] hover:text-[#14213d]">Add to cart</button></div></article>)}</div></section>

      <section id="cart" className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_.8fr]"><div id="story" className="border-2 border-[#14213d] bg-[#9ed6d1] p-7"><p className="text-xs font-bold uppercase tracking-[.18em]">Simple by design</p><h2 className="mt-5 max-w-lg text-4xl font-black leading-none tracking-[-.07em]">We keep the product, the price and the promise clear.</h2></div><aside className="border-2 border-[#14213d] bg-[#f7f5ef] p-6"><div className="flex justify-between border-b-2 border-[#14213d] pb-4"><h2 className="text-xl font-black">Your cart</h2><span className="font-bold">{cart.length} item{cart.length === 1 ? "" : "s"}</span></div><div className="flex min-h-24 items-center justify-between py-5"><span className="text-sm">Shipping is calculated after your address.</span><strong>{money(total)}</strong></div><button disabled={!cart.length} onClick={() => setNotice("Checkout is ready to connect to Laravel API") } className="w-full border-2 border-[#14213d] bg-[#ff6b5e] px-4 py-3 font-black disabled:cursor-not-allowed disabled:bg-stone-300">Continue to checkout →</button>{notice && <p className="mt-3 text-sm font-bold">{notice}</p>}</aside></section>
      <footer id="support" className="border-t-2 border-[#14213d] px-5 py-7 text-sm font-bold sm:px-8">© 2026 Common/Core <span className="float-right">US delivery · Secure checkout</span></footer>
    </main>
  );
}
