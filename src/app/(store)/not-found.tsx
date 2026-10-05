import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@/components/Icons";
import { ui } from "@/components/ui";

export default function NotFound() {
  return (
    <div className={`${ui.container} grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24`}>
      <div>
        <p className={ui.eyebrow}>404</p>
        <h1 className={`${ui.h1} mt-4`}>This page wandered off.</h1>
        <p className={`${ui.lede} mt-6 max-w-md`}>The link may be old or mistyped. The fur-free stuff is all still on the home page.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className={ui.buttonPrimary}>
            Back to the shop
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/tracking" className={ui.buttonGhost}>
            Track an order
          </Link>
        </div>
      </div>
      <figure className="relative hidden aspect-4/3 overflow-hidden rounded-[2.5rem] bg-linen lg:block">
        <Image src="/images/hero-living-room.jpg" alt="A dog and a cat asleep on a cream sofa" fill sizes="45vw" className="object-cover" />
      </figure>
    </div>
  );
}
