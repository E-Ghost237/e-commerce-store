import { PageTitle } from "@/components/admin/Field";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminApi } from "@/lib/admin";
import type { AdminProduct } from "@/lib/admin-types";

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const product = (await adminApi<{ data: AdminProduct }>(`/products/${Number(id)}`)).data;

  return (
    <>
      <PageTitle title={product.name} />
      <ProductForm product={product} />
    </>
  );
}
