import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartForm } from "@/components/AddToCartForm";
import { JsonLd } from "@/components/JsonLd";
import { ui } from "@/components/ui";
import { site } from "@/content/site";
import { fromPrice, getProduct } from "@/lib/catalog";
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
  const product = await getProduct(slug);
  if (!product) {
    notFound();
  }

  const price = fromPrice(product);
  const inStock = product.variants.some((variant) => variant.in_stock);
  const images = product.images.length ? product.images : product.primary_image ? [{ id: 0, url: product.primary_image.url, alt_text: product.primary_image.alt_text, position: 0, is_primary: true }] : [];

  return (
    <div className={`${ui.container} grid gap-8 py-10 lg:grid-cols-2`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: images.map((image) => image.url),
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

      <div className="grid gap-3">
        {images.map((image, index) => (
          <div key={image.id} className={`relative border-2 border-ink bg-mint ${index === 0 ? "aspect-square" : "aspect-[4/3]"}`}>
            <Image src={image.url} alt={image.alt_text ?? product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority={index === 0} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <div>
          {product.categories[0] && <p className={ui.eyebrow}>{product.categories[0].name}</p>}
          <h1 className={`${ui.h1} mt-2`}>{product.name}</h1>
          <p className="mt-4 text-3xl font-black">
            {product.variants.length > 1 ? "from " : ""}
            {formatMoney(price)}
          </p>
          <p className={`mt-2 text-sm font-bold ${inStock ? "text-emerald-800" : "text-red-700"}`}>{inStock ? "In stock · ships from the US warehouse" : "Currently sold out"}</p>
        </div>

        {product.description && <p className="text-lg">{product.description}</p>}

        <div className={`${ui.card} p-5`}>
          <AddToCartForm kind="variant" variants={product.variants} />
        </div>

        <ul className="grid gap-2 text-sm">
          <li>✓ Shipping options and delivery estimates shown at checkout for your address.</li>
          <li>✓ 30-day returns. <Link className="underline" href="/returns">How returns work</Link></li>
          <li>✓ Secure checkout by Stripe. No account needed.</li>
        </ul>
      </div>
    </div>
  );
}
