import Link from "next/link";
import { Logo } from "@/components/Icons";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "../actions";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/orders", "Orders"],
  ["/admin/products", "Products"],
  ["/admin/bundles", "Bundles"],
  ["/admin/discounts", "Discounts"],
  ["/admin/suppliers", "Suppliers"],
  ["/admin/marketing", "Ad spend"],
  ["/admin/security", "Security"],
] as const;

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="grid min-h-screen bg-paper md:grid-cols-[250px_1fr]">
      <aside className="bg-forest text-paper md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div className="flex items-center gap-3 p-5">
          <Logo className="h-9 w-9 text-terracotta" />
          <span className="font-display text-lg leading-none">Back office</span>
        </div>
        <nav aria-label="Back office" className="flex flex-wrap gap-1 px-3 pb-4 text-sm font-medium md:flex-col">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-2xl px-4 py-2.5 text-paper/75 hover:bg-paper/10 hover:text-paper">
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-paper/15 p-5 text-xs text-paper/70">
          <p className="truncate">{admin.email}</p>
          <p className="mt-1">{admin.mfa_enabled ? "2FA on" : "2FA off"}</p>
          <form action={signOut} className="mt-3">
            <button className="link-underline font-semibold text-paper" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main id="main" className="min-w-0 p-4 sm:p-8">
        {admin.mfa_required && !admin.mfa_enabled && (
          <p className="mb-6 rounded-2xl border border-terracotta/25 bg-terracotta/10 p-4 text-sm font-medium text-ember">
            Two-factor authentication is required. <Link className="underline" href="/admin/security">Enable it now</Link>.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
