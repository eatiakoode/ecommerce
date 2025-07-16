"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  // 🔁 CHANGED: Start with null to handle loading state
  const [category, setCategory] = useState<any>(null); // ✅
  const [originalCategory, setOriginalCategory] = useState<any>(null); // ✅
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; description?: boolean }>({});
  const [isDirty, setIsDirty] = useState(false);

  // ✅ Fetch category from API
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/category/${id}`);
        setCategory(res.data);
        setOriginalCategory(res.data);
        setIsDirty(false);
      } catch (err) {
        console.error("Error fetching category", err);
        toast.error("Failed to load category");
      }
    };

    fetchCategory();
  }, [id]);

  // ✅ Warn before reload/leave
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (field: string, value: string | boolean) => {
    const updated = { ...category, [field]: value };
    setCategory(updated);
    setIsDirty(JSON.stringify(updated) !== JSON.stringify(originalCategory));

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: category.name.trim() === "",
      description: category.description.trim() === "",
    };

    if (newErrors.name || newErrors.description) {
      setErrors(newErrors);
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      let iconUrl = category.icon;

      // ✅ Upload image if new file is selected
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        iconUrl = uploadRes.data.url;
      }

      // ✅ Update category
      await axios.put(`http://localhost:5000/api/category/${id}`, {
        ...category,
        icon: iconUrl,
      });

      toast.success("Category updated successfully");
      router.push("/categories"); // ✅ Redirect to success page
    } catch (err) {
      console.error("Failed to update category", err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/category/${id}`);
      toast.success("Category deleted");
      router.push("/categories");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete category");
    }
  };

  // ✅ Show loading message until data is fetched
  if (!category) {
    return <div className="text-center mt-10">Loading category...</div>; // ✅
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Edit Category</h1>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Name *</Label>
          <Input
            className={errors.name ? "border-red-500" : ""}
            value={category.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Description *</Label>
          <Input
            className={errors.description ? "border-red-500" : ""}
            value={category.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Published</Label>
          <Switch
            checked={category.published}
            onCheckedChange={(val) => handleChange("published", val)}
          />
        </div>

        {/* <div className="grid gap-2">
          <Label>Icon</Label>
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {category.icon && (
            <img src={category.icon} alt="Icon Preview" className="w-16 h-16 rounded-full mt-2" />
          )}
        </div> */}

        <div className="flex flex-wrap gap-4 mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>

          <Button variant="outline" onClick={() => router.push("/categories")}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={handleDelete}>
            Delete Category
          </Button>
        </div>
      </div>
    </div>
  );
}
