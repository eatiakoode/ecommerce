"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addCategory } from "@/api/category";

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");
    if (!image) return toast.error("Image is required");

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("isActive", String(isActive));
      formData.append("image", image); // required by backend

      await addCategory(formData); // ⬅️ correctly submits

      toast.success("Category added successfully");
      router.push("/categories");
    } catch (err: any) {
      toast.error("Failed to add category");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="border p-2 rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive((prev) => !prev)}
          />
          <label>Active</label>
        </div>
        <div>
          <label className="block mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)
            }
            required
            className="border p-2 rounded w-full"
          />
          {image && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-24 h-24 object-cover rounded border"
              />
            </div>
          )}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Adding..." : "Add Category"}
        </Button>
      </form>
    </div>
  );
}
