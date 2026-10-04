import { PageTitle } from "@/components/admin/Field";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <PageTitle title="New product" />
      <ProductForm product={null} />
    </>
  );
}
