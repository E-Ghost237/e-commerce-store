import Image from "next/image";
import Link from "next/link";
import { fromPrice } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";
import { ArrowUpRight } from "./Icons";
import { ui } from "./ui";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const price = fromPrice(product);
  const inStock = product.variants.some((variant) => variant.in_stock);

  return (
    <article className={`${ui.card} ${ui.cardHover} group flex flex-col overflow-hidden`}>
      <Link href={`/products/${product.slug}`} className="relative block aspect-4/5 overflow-hidden bg-linen" aria-hidden tabIndex={-1}>
        {product.primary_image && (
          <Image
            src={product.primary_image.url}
            alt={product.primary_image.alt_text ?? product.name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition duration-700 ease-smooth group-hover:scale-105"
            preload={priority}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-ink/25 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        {product.categories[0] && (
          <span className="absolute left-4 top-4 rounded-full bg-paper/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70 backdrop-blur">
            {product.categories[0].name}
          </span>
        )}
        {!inStock && (
          <span className="absolute right-4 top-4 rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-paper">Sold out</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className={ui.h3}>
            <Link href={`/products/${product.slug}`} className="link-underline">
              {product.name}
            </Link>
          </h3>
          <p className="shrink-0 text-[15px] font-semibold tabular-nums">
            {product.variants.length > 1 ? <span className="text-ink/45">from </span> : null}
            {formatMoney(price)}
          </p>
        </div>

        {product.description && <p className="line-clamp-2 text-sm leading-relaxed text-ink/60">{product.description}</p>}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${inStock ? "text-sage" : "text-ink/40"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-sage" : "bg-ink/30"}`} />
            {inStock ? "Ready to ship" : "Restocking"}
          </span>
          <Link href={`/products/${product.slug}`} className={ui.buttonQuiet}>
            View
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
