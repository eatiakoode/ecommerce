"use client";
import { useProductBySlug } from "@/hooks/useProducts";
import EditProduct from "./EditProduct";
import { useCategories } from "@/hooks/useCategories";

export default function EditProductClient({ slug }: { slug: string }) {
  const { data: product, isLoading, error } = useProductBySlug(slug);
  const { data: categories, isLoading: loadingCategories, error: errorCategories } = useCategories();

  if (isLoading || loadingCategories) return <div>Loading...</div>;
  if (error || errorCategories) {
    // Friendlier error message
    return (
      <div className="text-center mt-10 text-red-500">
        <h2 className="text-xl font-semibold mb-2">Unable to load product or categories</h2>
        <p className="mb-2">This may be because:</p>
        <ul className="list-disc list-inside mb-2 text-left inline-block">
          <li>The product does not exist (was deleted or never created).</li>
          <li>The product slug is incorrect or does not match any product.</li>
          <li>There was a network or server error.</li>
        </ul>
        <p className="mb-2">Please check the product list and try again, or contact support if the issue persists.</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="text-center mt-10 text-yellow-600">
        <h2 className="text-xl font-semibold mb-2">Product not found</h2>
        <p>The product you are trying to edit does not exist or the slug is incorrect.</p>
        <p className="mt-2">Please return to the product list and try again.</p>
      </div>
    );
  }

  return <EditProduct product={product} categories={categories} />;
} 