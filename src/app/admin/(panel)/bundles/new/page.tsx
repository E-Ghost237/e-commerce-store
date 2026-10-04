import { BundleForm } from "@/components/admin/BundleForm";
import { PageTitle } from "@/components/admin/Field";
import { adminApi } from "@/lib/admin";
import type { AdminProduct } from "@/lib/admin-types";
import type { Paginated } from "@/lib/types";

export default async function NewBundlePage() {
  const products = await adminApi<Paginated<AdminProduct>>("/products?per_page=48");
  return (
    <>
      <PageTitle title="New bundle" />
      <BundleForm bundle={null} products={products.data} />
    </>
  );
}
