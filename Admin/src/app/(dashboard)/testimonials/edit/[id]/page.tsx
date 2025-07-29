"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/helpers/axiosInstance";

const API_BASE = "http://localhost:5000/api/testimonials";

// Helper to get the correct image URL
const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/uploads/')) return `http://localhost:5000${image}`;
  return image;
};

export default function EditTestimonialPage() {
  const router = useRouter();
  const { id } = useParams(); // Correct way to get id
  console.log("Edit page id:", id); // Debug
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", image: "", status: "Active" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonial = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get(`${API_BASE}/${id}`);
        const t = res.data;
        // Normalize status to capitalized
        let status = t.status || "Active";
        if (status.toLowerCase() === "active") status = "Active";
        else if (status.toLowerCase() === "inactive") status = "Inactive";
        setForm({
          title: t.title || "",
          description: t.description || "",
          image: t.image || "",
          status,
        });
      } catch (e) {
        setError("Failed to load testimonial");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTestimonial();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let dataToSend;
      let headers = {};
      let updatedImage = form.image;
      if (imageFile) {
        // If a new image is selected, use FormData
        dataToSend = new FormData();
        dataToSend.append("title", form.title);
        dataToSend.append("description", form.description);
        dataToSend.append("status", form.status);
        dataToSend.append("image", imageFile);
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        // No new image, send JSON
        dataToSend = { title: form.title, description: form.description, status: form.status, image: form.image };
      }
      const res = await axiosInstance.put(`${API_BASE}/${id}`, dataToSend, { headers });
      // If a new image was uploaded, update the form state with the new image path
      if (res.data && res.data.image) {
        updatedImage = res.data.image;
        setForm(f => ({ ...f, image: updatedImage }));
        setPreviewUrl(null);
      }
      router.push("/testimonials");
    } catch (e) {
      setError("Failed to update testimonial");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Testimonial</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block mb-1">Image</label>
          {(previewUrl || form.image) && (
            <img src={previewUrl ? previewUrl : getImageUrl(form.image)} alt="Current" className="w-20 h-20 object-cover rounded mb-2 border" />
          )}
          <input
            type="file"
            accept="image/*"
            className="border p-2 w-full rounded"
            onChange={e => {
              const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
              setImageFile(file);
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
              } else {
                setPreviewUrl(null);
              }
            }}
          />
          <div className="text-xs text-gray-500 mt-1">Leave empty to keep current image.</div>
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} required className="border p-2 w-full rounded">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
} 