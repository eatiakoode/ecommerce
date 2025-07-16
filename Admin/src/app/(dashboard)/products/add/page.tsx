"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/hooks/useProducts";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TestAPI from "@/components/shared/TestAPI";

export default function AddProductPage() {
  const router = useRouter();
  const createProductMutation = useCreateProduct();
  const { data: categories, isLoading: loadingCategories, error: errorCategories } = useCategories();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    quantity: "",
    sold: "0",
    totalrating: "0",
    tags: "",
  });

  const [formErrors, setFormErrors] = useState({
    title: false,
    price: false,
    category: false,
    brand: false,
    quantity: false,
    description: false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value } = target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && { slug: generateSlug(value) }),
    }));

    // Clear error on user input
    if (name in formErrors) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { title, price, category, brand, quantity, description } = form;

    const errors = {
      title: !title.trim(),
      price: !price.trim() || isNaN(Number(price)),
      category: !category.trim(),
      brand: !brand.trim(),
      quantity: !quantity.trim() || isNaN(Number(quantity)),
      description: !description.trim(),
    };

    setFormErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      toast.warning("🚫 Please fill in all required fields correctly.");
      return;
    }

    try {
      const productData = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        brand: form.brand,
        quantity: Number(form.quantity),
        sold: Number(form.sold),
        totalrating: Number(form.totalrating),
        tags: form.tags,
        images: [],
        color: [],
        ratings: [],
      };

      console.log("Sending product data:", productData);
      
      await createProductMutation.mutateAsync(productData);
      toast.success("✅ Product added successfully!");
      router.push("/products");
    } catch (error) {
      console.error("Add failed", error);
      toast.error("❌ Failed to add product. Please check the console for details.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">🛍️ Add New Product</h1>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Product Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className={formErrors.title ? "border-red-500" : ""}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label>Category <span className="text-red-500">*</span></Label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full border rounded-md p-2 ${formErrors.category ? "border-red-500" : ""}`}
                  disabled={loadingCategories || !!errorCategories}
                >
                  <option value="">Select Category</option>
                  {Array.isArray(categories) && categories.map((cat: any) => (
                    <option key={cat._id || cat.id || cat.slug} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {errorCategories && <div className="text-red-500 text-xs mt-1">Failed to load categories</div>}
              </div>

              <div>
                <Label>Brand <span className="text-red-500">*</span></Label>
                <Input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  className={formErrors.brand ? "border-red-500" : ""}
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <Label>Slug (auto-generated)</Label>
                <Input
                  value={form.slug}
                  readOnly
                  disabled
                  className="bg-muted text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <Label>Description <span className="text-red-500">*</span></Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Enter product description"
                rows={4}
                className={formErrors.description ? "border-red-500" : ""}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Pricing & Stock</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                className={formErrors.price ? "border-red-500" : ""}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label>
                Stock Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                required
                className={formErrors.quantity ? "border-red-500" : ""}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <Label>Sold (Default: 0)</Label>
              <Input
                name="sold"
                type="number"
                value={form.sold}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <Label>Rating (Default: 0)</Label>
              <Input
                name="totalrating"
                type="number"
                value={form.totalrating}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="5"
                step="0.1"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Tags</Label>
              <Input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Product tags (comma separated)"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={createProductMutation.isPending}
            className="flex-1"
          >
            {createProductMutation.isPending ? "Adding Product..." : "Add Product"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.push("/products")}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
