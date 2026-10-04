import "server-only";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
}

/** Server-only settings. Nothing here is exposed to the browser. */
export const serverConfig = {
  apiUrl: required("COMMERCE_API_URL", "http://localhost:8000").replace(/\/$/, ""),
  storefrontApiKey: process.env.STOREFRONT_API_KEY ?? "",
  isProduction: process.env.NODE_ENV === "production",
};

/** Public site URL used for canonical links, sitemap and structured data. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
