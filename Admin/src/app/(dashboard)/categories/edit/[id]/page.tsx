
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getCategoryById, updateCategory } from "@/api/category";

// Helper to get the correct image URL
const getImageUrl = (image: string) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/uploads/')) return `http://localhost:5000${image}`;
  if (!image.startsWith('/')) return `http://localhost:5000/uploads/${image}`;
  return `http://localhost:5000/uploads/${image.replace(/^\//, '')}`;
};

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    async function fetchCategory() {
      try {
        const stringId = Array.isArray(id) ? id[0] : id;
        const response = await getCategoryById(stringId);
        const category = response.data;
        setName(category.name || "");
        setDescription(category.description || "");
        setIsActive(category.isActive ?? true);
        setCurrentImage(category.image || "");
      } catch {
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCategory();
  }, [id]);

  // const handleUpdate = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setUpdating(true);
  //   try {
  //     let payload: any;
  //     let headers = {};
  //     if (image) {
  //       payload = new FormData();
  //       payload.append("name", name);
  //       payload.append("description", description);
  //       payload.append("isActive", String(isActive));
  //       payload.append("image", image);
  //       headers = { headers: { "Content-Type": "multipart/form-data" } };
  //     } else {
  //       payload = { name, description, isActive };
  //     }
  //     await updateCategory(id, payload, headers);
  //     toast.success("Category updated");
  //     router.push("/categories");
  //   } catch {
  //     toast.error("Failed to update category");
  //   } finally {
  //     setUpdating(false);
  //   }
  // };

  const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  setUpdating(true);
  try {
    let payload: any;
    let config = {};
    if (image) {
      payload = new FormData();
      payload.append("name", name);
      payload.append("description", description);
      payload.append("isActive", String(isActive));
      payload.append("image", image); // Only if image is a File
      config = { headers: { "Content-Type": "multipart/form-data" } };
      await updateCategory(Array.isArray(id) ? id[0] : id, payload, config);
    } else {
      // Only send name, description, isActive (do NOT send image)
      payload = { name, description, isActive };
      await updateCategory(Array.isArray(id) ? id[0] : id, payload);
    }
    toast.success("Category updated");
    router.push("/categories");
  } catch (error) {
    toast.error("Failed to update category");
  } finally {
    setUpdating(false);
  }
};


  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
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
            onChange={e => setImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            className="border p-2 rounded w-full"
          />
          {image ? (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-24 h-24 object-cover rounded border"
              />
            </div>
          ) : currentImage ? (
            <div className="mt-2">
              <img
                src={getImageUrl(currentImage)}
                alt="Current"
                className="w-24 h-24 object-cover rounded border"
              />
            </div>
          ) : null}
        </div>
        <Button type="submit" disabled={updating} className="w-full">
          {updating ? "Updating..." : "Update Category"}
        </Button>
      </form>
    </div>
  );
}
