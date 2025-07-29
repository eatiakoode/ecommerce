// src/app/(dashboard)/products/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { getCategories } from "@/api/category";
import { getBrands } from "@/api/brand";
import ProductFilters from "./_components/ProductFilters";
import ProductActions from "./_components/ProductActions";
import AllProducts from "./_components/products-table";
import { useProducts } from "@/hooks/useProducts";

export default function ProductPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "",
  });

  const { data: products, isLoading, error } = useProducts();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    getCategories().then((res: any) => setCategories(Array.isArray(res.data) ? res.data : []));
    getBrands().then((res: any) => setBrands(Array.isArray(res.data) ? res.data : []));
  }, []);

  // Create lookup maps for category and brand
  const categoryMap = useMemo(
    () => Object.fromEntries((Array.isArray(categories) ? categories : []).map((cat: any) => [cat._id, cat.name || cat.title])),
    [categories]
  );
  const brandMap = useMemo(
    () => Object.fromEntries((Array.isArray(brands) ? brands : []).map((brand: any) => [brand._id, brand.title || brand.name])),
    [brands]
  );

  // Filter products on the client side
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter((product) =>
        product.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((product) => {
        // If categories is an array, match the first category's slug
        if (Array.isArray(product.categories) && product.categories.length > 0) {
          return product.categories[0].slug === filters.category;
        }
        // Try to match by slug if available, fallback to name
        if (product.categorySlug) {
          return product.categorySlug === filters.category;
        }
        if (product.category && typeof product.category === 'object' && product.category.slug) {
          return product.category.slug === filters.category;
        }
        // If no slug, fallback to name (legacy)
        return product.category?.toLowerCase() === filters.category.toLowerCase();
      });
    }

    // Sort filter
    if (filters.sort) {
      switch (filters.sort) {
        case "low":
          filtered.sort((a, b) => a.mrp - b.mrp);
          break;
        case "high":
          filtered.sort((a, b) => b.mrp - a.mrp);
          break;
        case "sold":
          filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
          break;
        case "stock":
          filtered.sort((a, b) => (b.quantity || b.stock || 0) - (a.quantity || a.stock || 0));
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [products, filters]);

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="space-y-6">
      <ProductActions />
      <ProductFilters onFilterChange={setFilters} />
      <AllProducts products={filteredProducts} />
    </div>
  );
}
