"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import axiosInstance from "@/helpers/axiosInstance";

const API_BASE = "http://localhost:5000/api/instapost";

export default function AddInstaPostPage() {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("instaLink", link);
      formData.append("status", isActive ? "active" : "inactive");
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        toast.error("Please select an image.");
        setLoading(false);
        return;
      }
      await axiosInstance.post("/instapost/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Insta post added successfully!");
      setTitle("");
      setImageFile(null);
      setLink("");
      setIsActive(true);
      router.push("/insta-posts");
    } catch {
      toast.error("Failed to add insta post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Insta Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} required className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Instagram Post Link</label>
          <input value={link} onChange={e => setLink(e.target.value)} required className="border px-3 py-2 rounded w-full" />
        </div>
        {/* SKU field removed */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select value={isActive ? "active" : "inactive"} onChange={e => setIsActive(e.target.value === "active")}
            className="border px-3 py-2 rounded w-full">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
          {loading ? "Adding..." : "Add Insta Post"}
        </button>
      </form>
    </div>
  );
} 