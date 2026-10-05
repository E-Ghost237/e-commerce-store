import localFont from "next/font/local";

/**
 * Fonts are self-hosted (shipped by @fontsource-variable) so a build never depends on fonts.googleapis.com:
 * the same files are used offline, behind a proxy and in CI, and no request leaves the visitor's browser.
 */

/** UI + body: Inter variable. */
export const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** Headings: Fraunces, a soft editorial serif with an optical-size axis. */
export const display = localFont({
  src: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});
