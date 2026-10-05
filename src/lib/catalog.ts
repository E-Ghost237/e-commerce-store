import "server-only";
import { api, apiOrNull } from "./api";
import type { Bundle, Paginated, Product } from "./types";

const CATALOG_TTL_SECONDS = 60;

/**
 * Catalogue responses are cached across deploys, so a response cached from an older API version may lack newer
 * fields; default every collection so a page never crashes on a stale cache entry.
 */
function normalizeProduct(product: Product): Product {
  return {
    ...product,
    categories: product.categories ?? [],
    images: product.images ?? [],
    videos: product.videos ?? [],
    variants: (product.variants ?? []).map((variant) => ({ ...variant, in_stock: variant.in_stock ?? true })),
  };
}

export async function listProducts(): Promise<Product[]> {
  return (await api<Paginated<Product>>("/catalog/products?per_page=48", { revalidate: CATALOG_TTL_SECONDS })).data.map(normalizeProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const product = (await apiOrNull<{ data: Product }>(`/catalog/products/${encodeURIComponent(slug)}`, { revalidate: CATALOG_TTL_SECONDS }))?.data;
  return product ? normalizeProduct(product) : null;
}

export async function listBundles(): Promise<Bundle[]> {
  return (await api<{ data: Bundle[] }>("/catalog/bundles", { revalidate: CATALOG_TTL_SECONDS })).data;
}

/** Lowest current variant price, for cards and structured data. */
export function fromPrice(product: Product): number | null {
  const prices = product.variants.map((variant) => variant.price_cents).filter((price): price is number => price !== null);
  return prices.length ? Math.min(...prices) : null;
}
