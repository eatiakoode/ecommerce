"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/helpers/axiosInstance";

export default function AddSliderPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("link", link);
      formData.append("status", status);
      if (imageFiles.length === 0) {
        alert("Please select at least one image.");
        setLoading(false);
        return;
      }
      imageFiles.forEach(file => formData.append("images", file));
      await axiosInstance.post("/slider/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/sliders");
    } catch (err) {
      alert("Failed to add slider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Slider</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Images</label>
          <input type="file" accept="image/*" multiple onChange={e => setImageFiles(e.target.files ? Array.from(e.target.files) : [])} required className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Link</label>
          <input value={link} onChange={e => setLink(e.target.value)} required className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border px-3 py-2 rounded w-full">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
          {loading ? "Adding..." : "Add Slider"}
        </button>
      </form>
    </div>
  );
} 