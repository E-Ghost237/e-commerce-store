import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/** Hosts product images may come from (supplier CDNs, your own bucket); extend via NEXT_PUBLIC_IMAGE_HOSTS. */
const imageHosts = ["images.unsplash.com", "cf.cjdropshipping.com", "oss-cf.cjdropshipping.com", "cc-west-usa.oss-us-west-1.aliyuncs.com", ...(process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "").split(",").map((host) => host.trim()).filter(Boolean)];

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${imageHosts.map((host) => `https://${host}`).join(" ")}`,
  "media-src 'self' https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  // Checkout submits can redirect to Stripe's hosted page.
  "form-action 'self' https://checkout.stripe.com",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(isProduction ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  images: { remotePatterns: imageHosts.map((hostname) => ({ protocol: "https" as const, hostname })) },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
