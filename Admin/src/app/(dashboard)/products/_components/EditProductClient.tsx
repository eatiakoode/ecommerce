"use client";
import { useProductBySlug } from "@/hooks/useProducts";
import EditProduct from "./EditProduct";
import { useCategories } from "@/hooks/useCategories";

export default function EditProductClient({ slug }: { slug: string }) {
  const { data: product, isLoading, error } = useProductBySlug(slug);
  const { data: categories, isLoading: loadingCategories, error: errorCategories } = useCategories();

  if (isLoading || loadingCategories) return <div>Loading...</div>;
  if (error || errorCategories) return <div>Error loading product or categories</div>;
  if (!product) return <div>Product not found</div>;

  return <EditProduct product={product} categories={categories} />;
} 