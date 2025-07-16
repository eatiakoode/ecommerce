"use client";

import EditProduct from "../../_components/EditProduct";

// import EditProduct from "@/products/_components/EditProduct";

export default function AddProductPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <EditProduct/>
    </div>
  );
}
