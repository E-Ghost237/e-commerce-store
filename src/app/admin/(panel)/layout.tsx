import Link from "next/link";
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
    <div className="grid min-h-screen md:grid-cols-[220px_1fr]">
      <aside className="border-b-2 border-ink bg-ink text-paper md:border-b-0 md:border-r-2">
        <div className="p-5 text-lg font-black tracking-[-.06em]">BACK OFFICE</div>
        <nav aria-label="Back office" className="flex flex-wrap gap-1 px-3 pb-4 text-sm font-bold md:flex-col">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="px-3 py-2 hover:bg-coral hover:text-ink">{label}</Link>
          ))}
        </nav>
        <div className="border-t border-paper/30 p-5 text-xs">
          <p className="truncate">{admin.email}</p>
          <p className="mt-1">{admin.mfa_enabled ? "2FA on" : "2FA off"}</p>
          <form action={signOut} className="mt-3">
            <button className="underline" type="submit">Sign out</button>
          </form>
        </div>
      </aside>
      <main id="main" className="min-w-0 p-4 sm:p-8">
        {admin.mfa_required && !admin.mfa_enabled && (
          <p className="mb-6 border-2 border-ink bg-coral p-3 text-sm font-bold">
            Two-factor authentication is required. <Link className="underline" href="/admin/security">Enable it now</Link>.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
