import { DiscountForm } from "@/components/admin/DiscountForm";
import { PageTitle } from "@/components/admin/Field";
import { adminApi } from "@/lib/admin";
import type { AdminProduct } from "@/lib/admin-types";
import type { Bundle, Paginated } from "@/lib/types";

export default async function NewDiscountPage() {
  const [products, bundles] = await Promise.all([adminApi<Paginated<AdminProduct>>("/products?per_page=48"), adminApi<Paginated<Bundle>>("/bundles")]);
  return (
    <>
      <PageTitle title="New discount" />
      <DiscountForm discount={null} products={products.data} bundles={bundles.data} />
    </>
  );
}
