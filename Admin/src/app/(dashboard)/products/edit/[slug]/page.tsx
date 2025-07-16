import { notFound } from "next/navigation";
import EditProduct from "@/app/(dashboard)/products/_components/EditProduct";
import { fetchProductBySlug } from "@/data/products";

export default async function EditProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <EditProduct product={product} />
    </div>
  );
} 