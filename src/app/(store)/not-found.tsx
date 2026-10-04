import Link from "next/link";
import { ui } from "@/components/ui";

export default function NotFound() {
  return (
    <div className={`${ui.container} max-w-2xl py-16`}>
      <h1 className={ui.h1}>This page wandered off.</h1>
      <p className="mt-6 text-lg">The link may be old or mistyped.</p>
      <Link href="/" className={`${ui.buttonPrimary} mt-8`}>Back to the shop</Link>
    </div>
  );
}
