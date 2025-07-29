"use client";
import { useEffect, useState } from "react";
import { getBlogById, updateBlog, getBlogCategories } from "@/api/blog";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const blog = await getBlogById(id);
        setTitle(blog.title || "");
        setDescription(blog.description || "");
        setCategory(blog.category || "");
        setAuthor(blog.author || "");
        setDate(blog.date ? new Date(blog.date).toISOString().split('T')[0] : "");
        if (blog.images && blog.images.length > 0) {
          setCurrentImage(blog.images[0].url);
        }
      } catch {
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    }
    getBlogCategories().then((data) => setCategories(data || []));
    if (id) fetchBlog();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      let data: any;
      if (image) {
        data = new FormData();
        data.append("title", title);
        data.append("description", description);
        data.append("category", category);
        data.append("author", author);
        data.append("date", date);
        data.append("images", image);
      } else {
        data = { title, description, category, author, date };
      }
      await updateBlog(id, data);
      toast.success("Blog updated");
      router.push("/blogs");
    } catch {
      toast.error("Failed to update blog");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
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
            required
          />
        </div>
        <div>
          <label className="block mb-1">Category</label>
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
          {currentImage && (
            <img 
              src={currentImage.startsWith('http') ? currentImage : `http://localhost:5000${currentImage}`} 
              alt="Current" 
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} 
              onError={e => { 
                console.log('Image failed to load:', currentImage);
                (e.target as HTMLImageElement).src = '/no-image.png'; 
              }} 
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files?.[0] || null)}
            className="border p-2 w-full rounded"
          />
        </div>

        <Button type="submit" disabled={updating} className="w-full">
          {updating ? "Updating..." : "Update Blog"}
        </Button>
      </form>
    </div>
  );
} 