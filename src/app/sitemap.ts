import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { listProducts } from "@/lib/catalog";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts().catch(() => []);

  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    ...products.map((product) => ({ url: `${siteUrl}/products/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...Object.keys(site.pages).map((page) => ({ url: `${siteUrl}/${page}`, changeFrequency: "yearly" as const, priority: 0.3 })),
    { url: `${siteUrl}/tracking`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
