import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function EditProduct({ product }: { product: any }) {
  return (
    <form className="bg-background p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-primary mb-1">Edit Product</h2>
      <p className="text-base text-muted-foreground">Update your product and necessary information from here</p>
      <div className="bg-card p-8 rounded-2xl shadow-lg max-w-5xl mx-auto">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            id="name"
            name="name"
            defaultValue={product?.name || ""}
            type="text"
            placeholder="Enter product name"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={product?.slug || ""}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>
        {/* Add more fields as needed */}

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            placeholder="$0.00"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Sale Price</label>
          <input
            type="number"
            placeholder="$0.00"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            placeholder="e.g., 50"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none">
            <option>Selling</option>
            <option>Out of Stock</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none">
            <option>Home</option>
            <option>Electronics</option>
            <option>Fashion</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-7">
          <input type="checkbox" id="published" className="w-5 h-5" />
          <label htmlFor="published" className="text-sm font-medium">Published</label>
        </div>

      </div>

      <div className="flex justify-end gap-4 mt-10">
        <button className="px-5 py-2 rounded-md border border-gray-400 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          Cancel
        </button>
        <button className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>
      {/* <div className="flex gap-4 mt-6">
        <Button variant="secondary" size="lg" type="button">
          Cancel
        </Button>
        <Button size="lg" type="submit">
          Save Changes
        </Button>
      </div> */}
    </form>
  );
}
