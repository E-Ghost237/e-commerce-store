import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Back office", template: "%s · Back office" }, robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-full bg-paper">{children}</div>;
}
