import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartForm } from "@/components/AddToCartForm";
import { ArrowUpRight, Chat, Check, Paw, Refresh, Shield, Star, Truck } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductVideo } from "@/components/ProductVideo";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { ui } from "@/components/ui";
import { site } from "@/content/site";
import { fromPrice, getProduct, listProducts } from "@/lib/catalog";
import { siteUrl } from "@/lib/config";
import { formatMoney } from "@/lib/money";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  const description = product.seo_description ?? product.description ?? site.description;

  return {
    title: product.seo_title ?? product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.name, description, images: product.primary_image ? [product.primary_image.url] : [] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [product, catalogue] = await Promise.all([getProduct(slug), listProducts()]);
  if (!product) {
    notFound();
  }

  const price = fromPrice(product);
  const inStock = product.variants.some((variant) => variant.in_stock);
  const images = product.images.length ? product.images : product.primary_image ? [{ id: 0, url: product.primary_image.url, alt_text: product.primary_image.alt_text, position: 0, is_primary: true }] : [];
  const related = catalogue.filter((entry) => entry.id !== product.id).slice(0, 3);
  const category = product.categories[0];

  return (
    <div className="pb-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: images.map((image) => image.url),
          ...(product.videos[0]
            ? {
                subjectOf: {
                  "@type": "VideoObject",
                  name: `${product.name} demonstration`,
                  description: product.seo_description ?? product.name,
                  contentUrl: product.videos[0].url,
                  thumbnailUrl: product.videos[0].poster_url ?? images[0]?.url,
                  ...(product.videos[0].duration_seconds ? { duration: `PT${Math.round(product.videos[0].duration_seconds)}S` } : {}),
                },
              }
            : {}),
          sku: product.variants[0]?.sku,
          brand: { "@type": "Brand", name: site.brand },
          offers: product.variants
            .filter((variant) => variant.price_cents !== null)
            .map((variant) => ({
              "@type": "Offer",
              sku: variant.sku,
              price: ((variant.price_cents ?? 0) / 100).toFixed(2),
              priceCurrency: variant.currency ?? "USD",
              availability: variant.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `${siteUrl}/products/${product.slug}`,
            })),
        }}
      />

      <nav aria-label="Breadcrumb" className={`${ui.container} pt-6 text-[13px] text-ink/50`}>
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="hover:text-ink" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link className="hover:text-ink" href="/#shop">
              {category?.name ?? "Shop"}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink/75">{product.name}</li>
        </ol>
      </nav>

      <div className={`${ui.container} grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14`}>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={images} name={product.name} priority />
          {product.videos.length > 0 && (
            <figure className="mt-4 overflow-hidden rounded-[2rem] border border-ink/10 bg-ink">
              <ProductVideo video={product.videos[0]} label={`${product.name} demonstration`} />
            </figure>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {category && <span className={ui.eyebrow}>{category.name}</span>}
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${inStock ? "bg-mint text-forest" : "bg-linen text-ink/50"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-sage" : "bg-ink/30"}`} />
                {inStock ? "In stock · ships from the US" : "Currently sold out"}
              </span>
            </div>

            <h1 className={`${ui.h1} mt-4 text-[2.4rem] sm:text-5xl lg:text-[3.5rem]`}>{product.name}</h1>

            <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
              <p className="font-display text-3xl tabular-nums">
                {product.variants.length > 1 && <span className="text-lg text-ink/45">from </span>}
                {formatMoney(price)}
              </p>
              <span className="flex items-center gap-1 text-terracotta" aria-label="Rated five stars by owners">
                {Array.from({ length: 5 }, (_, star) => (
                  <Star key={star} className="h-4 w-4" />
                ))}
                <span className="ml-1 text-xs font-medium text-ink/50">Owner approved</span>
              </span>
            </div>

            {product.description && <p className="mt-6 text-[17px] leading-relaxed text-ink/70">{product.description}</p>}
          </div>

          {site.product.highlights.length > 0 && (
            <ul className="grid gap-3">
              {site.product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-[15px] text-ink/75">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-forest">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          )}

          <div id="buy" className={`${ui.card} scroll-mt-24 p-6 sm:p-7`}>
            <AddToCartForm kind="variant" variants={product.variants} />
            <div className="mt-6 grid gap-3 border-t border-ink/8 pt-6 text-[13px] text-ink/60 sm:grid-cols-3">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-sage" /> Live US shipping quotes
              </p>
              <p className="flex items-center gap-2">
                <Refresh className="h-4 w-4 text-sage" /> 30-day returns
              </p>
              <p className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-sage" /> Secure Stripe checkout
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {site.product.details.map((detail) => (
              <details key={detail.title} className="group rounded-3xl border border-ink/10 bg-white px-5 py-4 shadow-soft open:shadow-lift">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  {detail.title}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink/12 text-ink/55 transition duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-paper">
                    <Paw className="h-3.5 w-3.5" />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{detail.body}</p>
              </details>
            ))}
          </div>

          <p className="flex items-center gap-3 rounded-3xl bg-linen p-5 text-sm text-ink/70">
            <Chat className="h-5 w-5 shrink-0 text-sage" />
            Questions about fit or fabric? Write to{" "}
            <a className="link-underline font-semibold text-ember" href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>
          </p>
        </div>
      </div>

      <StickyBuyBar price={`${product.variants.length > 1 ? "from " : ""}${formatMoney(price)}`} cta="Choose options" />

      {product.videos.length > 1 && (
        <section className={`${ui.container} py-10`}>
          <h2 className={`${ui.h2} mb-6`}>More from this product</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.videos.slice(1).map((video) => (
              <figure key={video.id} className="overflow-hidden rounded-[2rem] border border-ink/10 bg-ink">
                <ProductVideo video={video} label={`${product.name} video`} />
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 bg-linen py-16">
        <div className={ui.container}>
          <h2 className={`${ui.h2} max-w-xl`}>Owners who stopped losing the fur fight.</h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {site.testimonials.map((testimonial) => (
              <li key={testimonial.author} className={`${ui.card} flex flex-col gap-4 p-6`}>
                <span className="flex gap-1 text-terracotta" aria-hidden>
                  {Array.from({ length: 5 }, (_, star) => (
                    <Star key={star} className="h-3.5 w-3.5" />
                  ))}
                </span>
                <blockquote className="font-display text-lg leading-snug text-ink/85">“{testimonial.quote}”</blockquote>
                <footer className="mt-auto text-sm text-ink/55">
                  <span className="font-semibold text-ink/75">{testimonial.author}</span> · {testimonial.location}
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`${ui.container} py-16 sm:py-24`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className={ui.h2}>Pairs well with</h2>
            <Link href="/#shop" className={ui.buttonQuiet}>
              Shop everything
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry) => (
              <ProductCard key={entry.id} product={entry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
