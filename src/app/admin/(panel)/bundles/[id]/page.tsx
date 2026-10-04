import { BundleForm } from "@/components/admin/BundleForm";
import { PageTitle } from "@/components/admin/Field";
import { adminApi } from "@/lib/admin";
import type { AdminProduct } from "@/lib/admin-types";
import type { Bundle, Paginated } from "@/lib/types";

export default async function EditBundlePage({ params }: PageProps<"/admin/bundles/[id]">) {
  const { id } = await params;
  const [bundle, products] = await Promise.all([
    adminApi<{ data: Bundle }>(`/bundles/${Number(id)}`),
    adminApi<Paginated<AdminProduct>>("/products?per_page=48"),
  ]);
  return (
    <>
      <PageTitle title={bundle.data.name} />
      <BundleForm bundle={bundle.data} products={products.data} />
    </>
  );
}
