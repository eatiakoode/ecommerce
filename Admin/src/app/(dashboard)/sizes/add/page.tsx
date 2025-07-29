"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addSize, checkSku } from "@/api/size";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X } from "lucide-react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export default function AddSizePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Remove slug from form state
  const [form, setForm] = useState({
    name: "",
    value: "",
    // SKU: "",
    isActive: true,
  });
  // Comment out SKU logic and UI
  // const [skuAvailable, setSkuAvailable] = useState<boolean | null>(null);
  // const [skuLoading, setSkuLoading] = useState(false);
  // useEffect(() => {
  //   const handler = setTimeout(async () => {
  //     if (form.SKU) {
  //       setSkuLoading(true);
  //       const { isUnique } = await checkSku(form.SKU);
  //       setSkuAvailable(isUnique);
  //       setSkuLoading(false);
  //     } else {
  //       setSkuAvailable(null);
  //     }
  //   }, 500); // Debounce API call
  //   return () => clearTimeout(handler);
  // }, [form.SKU]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (skuAvailable === false) {
    //   toast.error("SKU is already taken");
    //   return;
    // }
    setLoading(true);
    const slug = slugify(form.name);
    try {
      await addSize({ ...form, slug });
      toast.success("Size added successfully");
      router.push("/sizes");
    } catch (e) {
      toast.error("Failed to add size");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Size</h1>
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
        {/* Remove the slug field from the form UI */}
        {/*
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </div>
        */}
        {/* SKU field commented out */}
        {/*
        <div>
          <Label htmlFor="sku">SKU</Label>
          <div className="relative">
            <Input
              id="sku"
              value={form.SKU}
              onChange={(e) => setForm({ ...form, SKU: e.target.value })}
              required
            />
            {skuLoading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              </div>
            )}
            {!skuLoading && skuAvailable === true && (
              <Check className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500" />
            )}
            {!skuLoading && skuAvailable === false && (
              <X className="absolute inset-y-0 right-0 pr-3 flex items-center text-red-500" />
            )}
          </div>
        </div>
        */}
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
        <Button type="submit" disabled={loading /*|| skuAvailable === false*/}>
          {loading ? "Adding..." : "Add Size"}
        </Button>
      </form>
    </div>
  );
} 