import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/** Hosts product images may come from (supplier CDNs, your own bucket); extend via NEXT_PUBLIC_IMAGE_HOSTS. */
const imageHosts = ["images.unsplash.com", "cf.cjdropshipping.com", "oss-cf.cjdropshipping.com", "cc-west-usa.oss-us-west-1.aliyuncs.com", ...(process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "").split(",").map((host) => host.trim()).filter(Boolean)];

/** Mirrored product pictures and videos are served by the API's media disk (APP_URL/storage) or its CDN. */
const mediaOrigin = new URL(process.env.COMMERCE_MEDIA_URL ?? process.env.COMMERCE_API_URL ?? "http://localhost:8000");

const mediaIsLocal = ["localhost", "127.0.0.1", "[::1]"].includes(mediaOrigin.hostname);

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${mediaOrigin.origin} ${imageHosts.map((host) => `https://${host}`).join(" ")}`,
  `media-src 'self' https: ${mediaOrigin.origin}`,
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

/** Extra dev origins (tunnels, preview domains) so `next dev` answers requests proxied through them. */
const devOrigins = (process.env.NEXT_DEV_ORIGINS ?? "").split(",").map((origin) => origin.trim()).filter(Boolean);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  ...(isProduction ? {} : { allowedDevOrigins: ["*.e2b.app", "*.e2b.dev", ...devOrigins] }),
  images: {
    remotePatterns: [
      ...imageHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
      { protocol: mediaOrigin.protocol.replace(":", "") as "http" | "https", hostname: mediaOrigin.hostname, port: mediaOrigin.port, pathname: "/storage/**" },
    ],
    // Only when media is deliberately served from this machine (local runs); a public media/CDN host keeps the SSRF guard.
    dangerouslyAllowLocalIP: mediaIsLocal,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
