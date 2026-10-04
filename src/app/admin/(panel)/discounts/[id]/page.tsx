import { DiscountForm } from "@/components/admin/DiscountForm";
import { PageTitle } from "@/components/admin/Field";
import { adminApi } from "@/lib/admin";
import type { AdminDiscount, AdminProduct } from "@/lib/admin-types";
import type { Bundle, Paginated } from "@/lib/types";

export default async function EditDiscountPage({ params }: PageProps<"/admin/discounts/[id]">) {
  const { id } = await params;
  const [discount, products, bundles] = await Promise.all([
    adminApi<{ data: AdminDiscount }>(`/discounts/${Number(id)}`),
    adminApi<Paginated<AdminProduct>>("/products?per_page=48"),
    adminApi<Paginated<Bundle>>("/bundles"),
  ]);
  return (
    <>
      <PageTitle title={`Discount ${discount.data.code}`} />
      <DiscountForm discount={discount.data} products={products.data} bundles={bundles.data} />
    </>
  );
}
