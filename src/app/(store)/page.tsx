import Link from "next/link";
import { AddToCartForm } from "@/components/AddToCartForm";
import { ProductCard } from "@/components/ProductCard";
import { ui } from "@/components/ui";
import { site } from "@/content/site";
import { listBundles, listProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";

export default async function Home() {
  const [products, bundles] = await Promise.all([listProducts(), listBundles()]);

  return (
    <>
      <section className={`${ui.container} grid gap-6 py-10 lg:grid-cols-[1.15fr_.85fr] lg:py-16`}>
        <div className="flex flex-col justify-between gap-10 border-2 border-ink bg-coral p-6 sm:p-10">
          <p className="w-fit bg-ink px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-paper">{site.hero.eyebrow}</p>
          <div>
            <h1 className={`${ui.h1} max-w-xl whitespace-pre-line`}>{site.hero.title}</h1>
            <p className="mt-5 max-w-md text-lg font-medium">{site.hero.body}</p>
          </div>
          <Link href="#bundles" className="w-fit border-2 border-ink bg-paper px-5 py-3 text-sm font-black">
            {site.hero.cta} →
          </Link>
        </div>
        <figure className="flex flex-col border-2 border-ink bg-mint">
          {site.demoVideo.src ? (
            <video className="aspect-video w-full border-b-2 border-ink object-cover" controls muted playsInline preload="none" poster={site.demoVideo.poster}>
              <source src={site.demoVideo.src} type="video/mp4" />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- static poster until a demo video URL is configured
            <img className="aspect-video w-full border-b-2 border-ink object-cover" src={site.demoVideo.poster} alt="Pet hair roller demonstration on a sofa" />
          )}
          <figcaption className="p-5 text-lg font-black tracking-[-.04em]">{site.demoVideo.caption}</figcaption>
        </figure>
      </section>

      <section aria-labelledby="benefits" className={`${ui.container} py-6`}>
        <h2 id="benefits" className="sr-only">Why it works</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {site.benefits.map((benefit) => (
            <li key={benefit.title} className={`${ui.card} p-6`}>
              <h3 className="text-xl font-black tracking-[-.04em]">{benefit.title}</h3>
              <p className="mt-2">{benefit.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {bundles.length > 0 && (
        <section id="bundles" aria-labelledby="bundles-title" className={`${ui.container} py-10`}>
          <div className="mb-6 border-b-2 border-ink pb-4">
            <p className={ui.eyebrow}>Bundles</p>
            <h2 id="bundles-title" className={ui.h2}>Everything you need, priced together.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {bundles.map((bundle) => (
              <article key={bundle.id} className={`${ui.card} flex flex-col gap-4 p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {bundle.badge && <span className="mb-2 inline-block bg-coral px-2 py-1 text-xs font-black">{bundle.badge}</span>}
                    <h3 className="text-2xl font-black tracking-[-.05em]">{bundle.name}</h3>
                  </div>
                  <p className="text-2xl font-black">{formatMoney(bundle.price_cents, bundle.currency)}</p>
                </div>
                {bundle.description && <p>{bundle.description}</p>}
                <ul className="list-inside list-disc text-sm">
                  {bundle.items.map((item) => (
                    <li key={item.product_variant_id}>
                      {item.quantity} × {item.name}
                    </li>
                  ))}
                </ul>
                <AddToCartForm kind="bundle" id={bundle.id} label="Add bundle to cart" />
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="shop" aria-labelledby="shop-title" className={`${ui.container} py-10`}>
        <div className="mb-6 flex items-end justify-between border-b-2 border-ink pb-4">
          <div>
            <p className={ui.eyebrow}>The collection</p>
            <h2 id="shop-title" className={ui.h2}>Small, useful, ready.</h2>
          </div>
          <span className="text-sm font-bold">{String(products.length).padStart(2, "0")} pieces</span>
        </div>
        {products.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index === 0} />
            ))}
          </div>
        ) : (
          <p>New products are on their way. Check back soon.</p>
        )}
      </section>

      <section aria-labelledby="reviews-title" className="border-y-2 border-ink bg-mint py-10">
        <div className={ui.container}>
          <h2 id="reviews-title" className={`${ui.h2} mb-6`}>Owners who stopped losing the fur fight.</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {site.testimonials.map((testimonial) => (
              <li key={testimonial.author} className={`${ui.card} p-6`}>
                <blockquote className="text-lg font-bold">“{testimonial.quote}”</blockquote>
                <p className="mt-3 text-sm">{testimonial.author}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className={`${ui.container} py-10`}>
        <h2 id="faq-title" className={`${ui.h2} mb-6`}>Questions</h2>
        <div className="divide-y-2 divide-ink border-2 border-ink">
          {site.faq.map((item) => (
            <details key={item.question} className="group p-5">
              <summary className="cursor-pointer list-none font-black">
                {item.question}
                <span aria-hidden className="float-right group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3">{item.answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-coral p-6">
          <p className="text-2xl font-black tracking-[-.05em]">Ready for a fur-free couch?</p>
          <Link href="#bundles" className={ui.buttonPrimary}>
            {site.hero.cta} →
          </Link>
        </div>
      </section>
    </>
  );
}
