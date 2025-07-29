"use client";
import { useState, useEffect } from "react";
import { addBlog, getBlogCategories, createBlogCategory } from "@/api/blog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getBlogCategories().then((data) => setCategories(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("author", author);
      formData.append("date", date);
      if (image) formData.append("images", image);
      await addBlog(formData);
      toast.success("Blog added");
      router.push("/blogs");
    } catch (e: any) {
      toast.error(e?.message || "Failed to add blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 w-full rounded"
            placeholder="Blog title"
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Blog description"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Add new category"
              className="border p-2 rounded w-full"
              disabled={addingCategory}
            />
            <button
              type="button"
              className="px-3 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
              disabled={!newCategory.trim() || addingCategory}
              onClick={async () => {
                if (!newCategory.trim()) return;
                setAddingCategory(true);
                try {
                  const cat = await createBlogCategory(newCategory.trim());
                  setCategories(prev => [...prev, cat]);
                  setCategory(cat._id);
                  setNewCategory("");
                  toast.success("Category added");
                } catch (e: any) {
                  toast.error(e?.message || "Failed to add category");
                } finally {
                  setAddingCategory(false);
                }
              }}
            >
              {addingCategory ? "Adding..." : "Add"}
            </button>
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Author</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Author name"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files?.[0] || null)}
            className="border p-2 w-full rounded"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Add Blog"}
        </Button>
      </form>
    </div>
  );
} 