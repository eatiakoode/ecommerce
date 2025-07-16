"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import slugify from "slugify";

export default function EditProduct({
  product,
  onClose, // ✅ Made optional again
  categories = [], // <-- Add categories prop with default empty array
}: {
  product?: any;
  onClose?: () => void; // ✅ onClose is now optional again
  categories?: any[];
}) {
  const [form, setForm] = useState({
    title: product?.title || "",
    slug: product?.slug || "",
    price: product?.price || "",
    brand: product?.brand || "",
    stock: product?.stock || product?.quantity || "",
    sold: product?.sold || "",
    rating: product?.totalrating || product?.rating || 0,
    category: product?.category || "Home",
    published: product?.published || false,
    status: product?.status || "Selling",
  });

  const [loading, setLoading] = useState(false); // ✅ loading state
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setForm((prev) => {
      let updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      // Auto-generate slug from title
      if (name === "title") {
        updated.slug = slugify(value, { lower: true });
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading

    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // Map 'stock' to 'quantity' and 'rating' to 'totalrating' for backend
      const payload = { ...form, quantity: form.stock, totalrating: form.rating };
      if (product?._id) {
        // ✅ UPDATE
        await axios.put(`http://localhost:5000/api/product/${product._id}`, payload, config);
        toast.success("Product updated!");
        router.push("/products"); // Redirect to product page
      } else {
        // ✅ CREATE
        await axios.post("http://localhost:5000/api/product/", payload, config);
        toast.success("Product added!");
        router.push("/products"); // Redirect to product page
      }
      onClose?.(); // ✅ Safe optional call
    } catch (error: any) {
      console.error("Product update error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Something went wrong!";
      toast.error(errorMsg);
      router.push("/products"); // Redirect to product page on error
    } finally {
      setLoading(false); // ✅ End loading
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
        {product ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Product Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                name="slug"
                value={form.slug}
                disabled
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              >
                {/* Dynamically render all categories */}
                {categories.map((cat: any) => (
                  <option key={cat._id || cat.id || cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Enter brand"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </div>

        <hr className="my-4 border-blue-200 dark:border-blue-800" />

        {/* Pricing & Stock */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Pricing & Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Sold</label>
              <input
                name="sold"
                type="number"
                value={form.sold}
                onChange={handleChange}
                placeholder="0"
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <input
                name="rating"
                type="number"
                value={form.rating}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="5"
                step="0.1"
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
          </div>
        </div>

        <hr className="my-4 border-blue-200 dark:border-blue-800" />

        {/* Status & Published */}
        {/*
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Status & Published</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300"
              >
                <option value="Selling">Selling</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label htmlFor="published" className="text-sm font-medium">Published</label>
            </div>
          </div>
        </div>
        */}

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          {/* ✅ Cancel Button (only if onClose is provided) */}
          {onClose && (
            <button
              type="button"
              onClick={() => {
                if (onClose) {
                  onClose(); // ✅ If in modal/drawer
                } else {
                  window.history.back(); // ✅ If on a page
                }
              }}
              className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>

          )}

          {/* ✅ Submit Button with loading */}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
