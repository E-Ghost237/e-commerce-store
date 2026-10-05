import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Chat, Leaf, Paw, Play, Refresh, Shield, Star, Truck, Sparkle } from "@/components/Icons";
import { Marquee } from "@/components/Marquee";
import { AddToCartForm } from "@/components/AddToCartForm";
import { ProductCard } from "@/components/ProductCard";
import { ProductVideo } from "@/components/ProductVideo";
import { ui } from "@/components/ui";
import { site } from "@/content/site";
import { listBundles, listProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import type { Bundle } from "@/lib/types";

/** Bundle cards get a backdrop image; the API's bundles carry no media, so the brand layer picks one. */
const bundleBackdrops = ["/images/kit-flatlay.jpg", "/images/car-interior.jpg", "/images/bedroom-linen.jpg"];

export default async function Home() {
  const [products, bundles] = await Promise.all([listProducts(), listBundles()]);
  const demoProduct = products.find((product) => product.videos.length > 0);
  const demoVideo = demoProduct ? { product: demoProduct, video: demoProduct.videos[0] } : null;

  // Bundle savings are read from the catalogue (sum of the member variants) — never hard-coded.
  const priceBySku = new Map(products.flatMap((product) => product.variants.map((variant) => [variant.sku, variant.price_cents])));
  const savingsFor = (bundle: Bundle): number | null => {
    let full = 0;
    for (const item of bundle.items) {
      const price = priceBySku.get(item.sku);
      if (price === null || price === undefined) {
        return null;
      }
      full += price * item.quantity;
    }
    const saved = full - bundle.price_cents;
    return saved > 0 ? saved : null;
  };

  return (
    <>
      {/* Hero ------------------------------------------------------------------------------------------------ */}
      <section className="relative isolate flex min-h-[88svh] items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="parallax absolute inset-0">
            <Image src={site.hero.image} alt="" fill sizes="100vw" className="kenburns object-cover object-center" preload />
          </div>
          <div className="absolute inset-0 bg-linear-to-tr from-ink/92 via-ink/62 to-ink/25" />
          <div className="grain absolute inset-0" />
        </div>

        <div className={`${ui.container} relative w-full py-20 sm:py-28`}>
          <div className="max-w-3xl text-paper">
            <span className="reveal inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] backdrop-blur">
              <Leaf className="h-3.5 w-3.5" />
              {site.hero.eyebrow}
            </span>

            <h1 className="reveal reveal-delay-1 mt-6 whitespace-pre-line text-[3rem] leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:text-[5.25rem]">{site.hero.title}</h1>

            <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-paper/80 sm:text-xl">{site.hero.body}</p>

            <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-3">
              <Link href="#bundles" className={ui.buttonAccent}>
                {site.hero.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#how" className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/30 bg-paper/10 px-6 py-3.5 text-sm font-semibold text-paper backdrop-blur hover:bg-paper/20">
                {site.hero.secondaryCta}
              </Link>
            </div>

            <ul className="reveal reveal-delay-4 mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-paper/75">
              {site.hero.trust.map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-terracotta" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="absolute bottom-10 right-8 hidden max-w-[15rem] animate-float rounded-3xl border border-paper/20 bg-paper/12 p-5 text-paper backdrop-blur-xl lg:block">
          <Sparkle className="h-5 w-5 text-terracotta" />
          <p className="mt-3 font-display text-3xl leading-none">{site.hero.stat.value}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-paper/70">{site.hero.stat.label}</p>
        </aside>
      </section>

      <div className="border-y border-ink/8 bg-sand/70 py-4 text-ink/70">
        <Marquee items={site.marquee} />
      </div>

      {/* Story ----------------------------------------------------------------------------------------------- */}
      <section className={`${ui.container} ${ui.section} grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
        <figure className="reveal relative">
          <div className="relative aspect-4/5 overflow-hidden rounded-[2.5rem] bg-linen">
            <Image src={site.demoVideo.poster} alt={site.demoVideo.fallbackAlt} fill sizes="(min-width: 1024px) 46vw, 92vw" className="object-cover" />
          </div>
          <figcaption className="absolute -bottom-5 -right-3 hidden max-w-[13rem] rounded-2xl border border-ink/10 bg-white/95 p-4 text-xs leading-relaxed text-ink/70 shadow-lift backdrop-blur sm:block">
            <Paw className="mb-2 h-4 w-4 text-terracotta" />
            {site.demoVideo.caption}
          </figcaption>
        </figure>

        <div>
          <p className={`${ui.eyebrow} reveal`}>{site.story.eyebrow}</p>
          <h2 className={`${ui.h2} reveal reveal-delay-1 mt-4`}>{site.story.title}</h2>
          <div className="reveal reveal-delay-2 prose-page mt-6">
            {site.story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="reveal reveal-delay-3 mt-8 grid gap-4">
            {site.story.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-[15px] text-ink/75">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-forest">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {bullet}
              </li>
            ))}
          </ul>
          <Link href="#how" className={`reveal reveal-delay-4 mt-8 ${ui.buttonQuiet}`}>
            See how it works
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* How it works ---------------------------------------------------------------------------------------- */}
      <section id="how" className="scroll-mt-24 bg-linen py-16 sm:py-24">
        <div className={ui.container}>
          <div className="max-w-2xl">
            <p className={`${ui.eyebrow} reveal`}>{site.how.eyebrow}</p>
            <h2 className={`${ui.h2} reveal reveal-delay-1 mt-4`}>{site.how.title}</h2>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {site.how.steps.map((step, index) => (
              <li key={step.title} className={`${ui.card} ${ui.cardHover} reveal reveal-delay-${index + 1} flex flex-col gap-4 p-7`}>
                <span className="font-display text-5xl leading-none text-clay">{String(index + 1).padStart(2, "0")}</span>
                <h3 className={ui.h3}>{step.title}</h3>
                <p className={ui.body}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Bundles --------------------------------------------------------------------------------------------- */}
      {bundles.length > 0 && (
        <section id="bundles" aria-labelledby="bundles-title" className={`${ui.container} ${ui.section} scroll-mt-24`}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className={ui.eyebrow}>Kits & bundles</p>
              <h2 id="bundles-title" className={`${ui.h2} mt-4`}>
                Everything you need, priced together.
              </h2>
            </div>
            <p className="max-w-xs text-sm text-ink/60">Buying the pieces apart costs more — the kit price already carries the saving.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {bundles.map((bundle, index) => {
              const savings = savingsFor(bundle);
              return (
                <article key={bundle.id} className={`${ui.card} ${ui.cardHover} group flex flex-col overflow-hidden`}>
                  <div className="relative h-52 overflow-hidden bg-linen sm:h-60">
                    <Image
                      src={bundleBackdrops[index % bundleBackdrops.length]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 45vw, 92vw"
                      className="object-cover transition duration-700 ease-smooth group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-ink/60 via-ink/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-5">
                      {bundle.badge && (
                        <span className="rounded-full bg-terracotta px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">{bundle.badge}</span>
                      )}
                      <span className="rounded-full bg-paper/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/70 backdrop-blur">
                        {bundle.items.length} pieces
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <h3 id={`bundle-${bundle.id}`} className={`${ui.h3} text-2xl sm:text-[1.75rem]`}>
                        {bundle.name}
                      </h3>
                      <p className="text-right">
                        <span className="block font-display text-3xl leading-none">{formatMoney(bundle.price_cents, bundle.currency)}</span>
                        {savings !== null && <span className="mt-1 block text-xs font-semibold text-sage">Save {formatMoney(savings, bundle.currency)}</span>}
                      </p>
                    </div>

                    {bundle.description && <p className={ui.body}>{bundle.description}</p>}

                    <ul className="grid gap-2.5">
                      {bundle.items.map((item) => (
                        <li key={item.product_variant_id} className="flex items-start gap-3 text-sm text-ink/70">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                          <span>
                            {item.quantity > 1 && <span className="font-semibold">{item.quantity} × </span>}
                            {item.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-2">
                      <AddToCartForm kind="bundle" id={bundle.id} label="Add bundle to cart" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Collection ------------------------------------------------------------------------------------------ */}
      <section id="shop" aria-labelledby="shop-title" className="scroll-mt-24 bg-linen py-16 sm:py-24">
        <div className={ui.container}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={ui.eyebrow}>The collection</p>
              <h2 id="shop-title" className={`${ui.h2} mt-4`}>
                Small, useful, ready.
              </h2>
            </div>
            {products.length > 0 && (
              <span className="rounded-full border border-ink/10 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
                {String(products.length).padStart(2, "0")} pieces
              </span>
            )}
          </div>

          {products.length ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index === 0} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-ink/60">New products are on their way. Check back soon.</p>
          )}
        </div>
      </section>

      {/* Demonstration --------------------------------------------------------------------------------------- */}
      <section className="bg-forest py-16 text-paper sm:py-24">
        <div className={`${ui.container} grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16`}>
          <div className="reveal relative overflow-hidden rounded-[2.5rem] border border-paper/10 bg-ink">
            {site.demoVideo.src ? (
              <video className="aspect-video w-full object-cover" controls muted playsInline preload="none" poster={site.demoVideo.poster}>
                <source src={site.demoVideo.src} type="video/mp4" />
              </video>
            ) : demoVideo ? (
              <ProductVideo video={demoVideo.video} label={`${demoVideo.product.name} demonstration`} />
            ) : (
              <Link href={demoProduct ? `/products/${demoProduct.slug}` : "#shop"} className="group relative block aspect-video">
                <Image src={site.demoVideo.poster} alt={site.demoVideo.fallbackAlt} fill sizes="(min-width: 1024px) 55vw, 92vw" className="object-cover" />
                <span className="absolute inset-0 grid place-items-center bg-ink/25">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-paper/90 text-ink transition group-hover:scale-110">
                    <Play className="h-6 w-6" />
                  </span>
                </span>
              </Link>
            )}
          </div>

          <div>
            <p className="reveal text-[11px] font-semibold uppercase tracking-[0.28em] text-terracotta">See it in action</p>
            <h2 className={`${ui.h2} reveal reveal-delay-1 mt-4`}>One cushion, one pass, twelve seconds.</h2>
            <p className="reveal reveal-delay-2 mt-6 text-lg leading-relaxed text-paper/70">
              Watch the chamber fill instead of the bin liner. No sheets to peel, no battery to charge, no fur left in the weave.
            </p>
            <ul className="reveal reveal-delay-3 mt-8 grid gap-3 text-sm text-paper/75">
              <li className="flex items-center gap-3">
                <Refresh className="h-4.5 w-4.5 text-terracotta" /> Rinseable head, reusable for years
              </li>
              <li className="flex items-center gap-3">
                <Shield className="h-4.5 w-4.5 text-terracotta" /> Fabric-safe bristles, no pilling
              </li>
              <li className="flex items-center gap-3">
                <Truck className="h-4.5 w-4.5 text-terracotta" /> Ships from the US with tracking
              </li>
            </ul>
            <Link href="#bundles" className={`reveal reveal-delay-4 mt-9 ${ui.buttonAccent}`}>
              {site.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Rooms ----------------------------------------------------------------------------------------------- */}
      <section id="rooms" aria-labelledby="rooms-title" className={`${ui.container} ${ui.section} scroll-mt-24`}>
        <div className="max-w-2xl">
          <p className={`${ui.eyebrow} reveal`}>{site.rooms.eyebrow}</p>
          <h2 id="rooms-title" className={`${ui.h2} reveal reveal-delay-1 mt-4`}>
            {site.rooms.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {site.rooms.items.map((room, index) => (
            <figure key={room.title} className={`reveal reveal-delay-${index + 1} group relative aspect-4/5 overflow-hidden rounded-[2rem]`}>
              <Image
                src={room.image}
                alt={room.alt}
                fill
                sizes="(min-width: 768px) 31vw, 92vw"
                className="object-cover transition duration-1000 ease-smooth group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/25 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-paper">
                <p className="font-display text-2xl">{room.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-paper/75">{room.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Comparison ------------------------------------------------------------------------------------------ */}
      <section aria-labelledby="compare-title" className="bg-linen py-16 sm:py-24">
        <div className={ui.container}>
          <div className="max-w-xl">
            <p className={`${ui.eyebrow} reveal`}>{site.comparison.eyebrow}</p>
            <h2 id="compare-title" className={`${ui.h2} reveal reveal-delay-1 mt-4`}>
              {site.comparison.title}
            </h2>
          </div>

          <div className="reveal reveal-delay-2 mt-10 overflow-x-auto hide-scrollbar">
            <table className="w-full min-w-[38rem] border-separate border-spacing-0 overflow-hidden rounded-3xl border border-ink/10 bg-white text-left text-sm shadow-soft">
              <thead>
                <tr>
                  <th scope="col" className="w-[28%] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
                    Compare
                  </th>
                  {site.comparison.columns.map((column, index) => (
                    <th
                      key={column}
                      scope="col"
                      className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        index === site.comparison.columns.length - 1 ? "bg-mint/70 text-forest" : "text-ink/45"
                      }`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {site.comparison.rows.map((row, rowIndex) => (
                  <tr key={row[0]} className={rowIndex % 2 ? "bg-linen/40" : ""}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${row[0]}-${cellIndex}`}
                        className={`border-t border-ink/8 px-6 py-4 align-top ${
                          cellIndex === 0
                            ? "font-semibold text-ink/80"
                            : cellIndex === row.length - 1
                              ? "bg-mint/40 font-semibold text-forest"
                              : "text-ink/60"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink/45 sm:hidden">Swipe the table to compare →</p>
        </div>
      </section>

      {/* Testimonials ---------------------------------------------------------------------------------------- */}
      <section aria-labelledby="reviews-title" className={`${ui.container} ${ui.section}`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className={ui.eyebrow}>Owner notes</p>
            <h2 id="reviews-title" className={`${ui.h2} mt-4`}>
              What owners say once the sticky sheets are gone.
            </h2>
          </div>
          <Chat className="hidden h-10 w-10 text-clay sm:block" />
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {site.testimonials.map((testimonial, index) => (
            <li key={testimonial.author} className={`${ui.card} ${ui.cardHover} reveal reveal-delay-${index + 1} flex flex-col gap-5 p-7`}>
              <span className="flex gap-1 text-terracotta" aria-hidden>
                {Array.from({ length: 5 }, (_, star) => (
                  <Star key={star} className="h-4 w-4" />
                ))}
              </span>
              <blockquote className="font-display text-xl leading-snug text-ink/85">“{testimonial.quote}”</blockquote>
              <footer className="mt-auto text-sm text-ink/55">
                <span className="font-semibold text-ink/75">{testimonial.author}</span> · {testimonial.location}
              </footer>
            </li>
          ))}
        </ul>
      </section>

      {/* Trust band ------------------------------------------------------------------------------------------ */}
      <section className={ui.container}>
        <ul className="grid gap-4 rounded-[2.5rem] border border-ink/10 bg-white p-6 shadow-soft sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {site.trust.map((item, index) => {
            const icons = [Refresh, Shield, Truck, Chat];
            const Icon = icons[index % icons.length];
            return (
              <li key={item.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint text-forest">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink/60">{item.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* FAQ ------------------------------------------------------------------------------------------------ */}
      <section id="faq" aria-labelledby="faq-title" className={`${ui.container} ${ui.section} scroll-mt-24 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className={`${ui.eyebrow} reveal`}>Good to know</p>
          <h2 id="faq-title" className={`${ui.h2} reveal reveal-delay-1 mt-4`}>
            Questions, answered.
          </h2>
          <p className="reveal reveal-delay-2 mt-5 text-[15px] leading-relaxed text-ink/60">
            Still unsure? Write to{" "}
            <a className="link-underline font-semibold text-ember" href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>{" "}
            and a person will answer, usually within one business day.
          </p>
        </div>

        <div className="grid gap-3">
          {site.faq.map((item) => (
            <details key={item.question} className="group rounded-3xl border border-ink/10 bg-white px-6 py-5 shadow-soft transition duration-300 open:shadow-lift">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/12 text-ink/60 transition duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-paper">
                  <Paw className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final call to action -------------------------------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src={site.finalCta.image} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-ink/72" />
          <div className="grain absolute inset-0" />
        </div>
        <div className={`${ui.container} py-20 text-center text-paper sm:py-28`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-terracotta">{site.finalCta.eyebrow}</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-[1.05] tracking-[-0.03em] sm:text-6xl">{site.finalCta.title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-paper/75">{site.finalCta.body}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="#bundles" className={ui.buttonAccent}>
              {site.finalCta.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#shop" className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/30 bg-paper/10 px-6 py-3.5 text-sm font-semibold text-paper backdrop-blur hover:bg-paper/20">
              Browse the collection
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
