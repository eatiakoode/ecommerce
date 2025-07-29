"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSizeById, updateSize } from "@/api/size";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export default function EditSizePage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    value: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchSize = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getSizeById(id as string);
        setForm({
          name: data.name || "",
          value: data.value || "",
          // SKU: data.SKU || "",
          isActive: data.isActive,
        });
      } catch (e) {
        setError("Failed to load size");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSize();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = slugify(form.name);
    try {
      await updateSize(id as string, { ...form, slug });
      toast.success("Size updated successfully");
      router.push("/sizes");
    } catch (e) {
      toast.error("Failed to update size");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Size</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            required
          />
        </div>
        {/* <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={form.SKU}
            onChange={(e) => setForm({ ...form, SKU: e.target.value })}
            required
          />
        </div> */}
        <div className="flex items-center">
          <Checkbox
            id="isActive"
            checked={form.isActive}
            onCheckedChange={(checked) =>
              setForm({ ...form, isActive: !!checked })
            }
          />
          <Label htmlFor="isActive" className="ml-2">
            Active
          </Label>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
} 