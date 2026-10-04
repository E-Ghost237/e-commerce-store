import "server-only";
import { api, apiOrNull } from "./api";
import type { Bundle, Paginated, Product } from "./types";

const CATALOG_TTL_SECONDS = 60;

export async function listProducts(): Promise<Product[]> {
  return (await api<Paginated<Product>>("/catalog/products?per_page=48", { revalidate: CATALOG_TTL_SECONDS })).data;
}

export async function getProduct(slug: string): Promise<Product | null> {
  return (await apiOrNull<{ data: Product }>(`/catalog/products/${encodeURIComponent(slug)}`, { revalidate: CATALOG_TTL_SECONDS }))?.data ?? null;
}

export async function listBundles(): Promise<Bundle[]> {
  return (await api<{ data: Bundle[] }>("/catalog/bundles", { revalidate: CATALOG_TTL_SECONDS })).data;
}

/** Lowest current variant price, for cards and structured data. */
export function fromPrice(product: Product): number | null {
  const prices = product.variants.map((variant) => variant.price_cents).filter((price): price is number => price !== null);
  return prices.length ? Math.min(...prices) : null;
}
