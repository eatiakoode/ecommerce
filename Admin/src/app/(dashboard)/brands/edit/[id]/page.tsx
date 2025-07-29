
"use client";
import { useEffect, useState } from "react";
import { getBrandById, updateBrand } from "@/api/brand";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function EditBrandPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchBrand() {
      try {
        const brand = await getBrandById(id);
        setTitle(brand.title || "");
        setDescription(brand.description || "");
        setStatus(brand.status || 'active');
      } catch {
        toast.error("Failed to load brand");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchBrand();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateBrand(id, { title, description, status });
      toast.success("Brand updated");
      router.push("/brands");
    } catch {
      toast.error("Failed to update brand");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Brand</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2 w-full rounded">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <Button type="submit" disabled={updating} className="w-full">
          {updating ? "Updating..." : "Update Brand"}
        </Button>
      </form>
    </div>
  );
}
