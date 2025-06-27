"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [category, setCategory] = useState({
    name: "",
    description: "",
    published: false,
    icon: "", // ✅ [ADDED] icon field
  });

  const [file, setFile] = useState<File | null>(null); // ✅ [ADDED] for image upload

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/category/${id}`);
        setCategory(res.data);
      } catch (err) {
        console.error("Error fetching category", err);
      }
    };
    fetchCategory();
  }, [id]);
  

  const handleChange = (field: string, value: string | boolean) => {
    setCategory({ ...category, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      let iconUrl = category.icon;

      // ✅ [ADDED] Upload image if changed
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        iconUrl = uploadRes.data.url;
      }

      await axios.put(`http://localhost:5000/api/category/${id}`, {
        ...category,
        icon: iconUrl,
      });

      router.push("/categories"); // ✅ [ADDED] Redirect back
    } catch (err) {
      console.error("Failed to update category", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Edit Category</h1>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input
            value={category.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Description</Label>
          <Input
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

        <div className="grid gap-2">
          <Label>Icon</Label>
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {category.icon && (
            <img src={category.icon} alt="Icon Preview" className="w-16 h-16 rounded-full" />
          )}
        </div>

        <Button onClick={handleSubmit}>Save Changes</Button>
      </div>
    </div>
  );
}
