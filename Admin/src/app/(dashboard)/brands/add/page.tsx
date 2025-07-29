
"use client";
import { useState } from "react";
import { addBrand } from "@/api/brand";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AddBrandPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addBrand({ title, description, isActive });
      toast.success("Brand added");
      router.push("/brands");
    } catch (e: any) {
      toast.error(e?.message || "Failed to add brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Brand</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 w-full rounded"
            placeholder="Brand title"
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Optional description"
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
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Add Brand"}
        </Button>
      </form>
    </div>
  );
}
