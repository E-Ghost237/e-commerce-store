import Image from "next/image";
import Link from "next/link";
import { fromPrice } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";
import { ui } from "./ui";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const price = fromPrice(product);
  const inStock = product.variants.some((variant) => variant.in_stock);

  return (
    <article className={`${ui.card} flex flex-col`}>
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] border-b-2 border-ink bg-mint" aria-hidden tabIndex={-1}>
        {product.primary_image && (
          <Image src={product.primary_image.url} alt={product.primary_image.alt_text ?? product.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" priority={priority} />
        )}
        {!inStock && <span className="absolute left-3 top-3 bg-paper px-2 py-1 text-xs font-black">Sold out</span>}
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <div className="flex justify-between gap-3">
          <h3 className="font-black tracking-[-.04em]">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="shrink-0 font-black">{product.variants.length > 1 ? "from " : ""}{formatMoney(price)}</p>
        </div>
        <Link href={`/products/${product.slug}`} className={ui.buttonGhost}>
          View details
        </Link>
      </div>
    </article>
  );
}
