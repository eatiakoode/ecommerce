"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import axiosInstance from "@/helpers/axiosInstance";

const API_BASE = "http://localhost:5000/api/instapost";

export default function EditInstaPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [instaLink, setInstaLink] = useState("");
  const [SKU, setSKU] = useState("");
  const [status, setStatus] = useState("active");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/instapost/${id}`)
      .then(res => {
        const post = res.data;
        setTitle(post.title || "");
        setImageLink(post.imageLink || "");
        setInstaLink(post.instaLink || "");
        setStatus(post.status || "active");
        setLoading(false);
      })
      .catch(() => {
        setError("Insta post not found");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let dataToSend;
      let headers = {};
      if (imageFile) {
        dataToSend = new FormData();
        dataToSend.append("title", title);
        dataToSend.append("instaLink", instaLink);
        dataToSend.append("status", status);
        dataToSend.append("imageLink", imageFile);
        headers = { headers: { "Content-Type": "multipart/form-data" } };
      } else {
        dataToSend = { title, imageLink, instaLink, status };
      }
      await axiosInstance.put(`/instapost/${id}`, dataToSend, headers);
      toast.success("Insta post updated successfully!");
      router.push("/insta-posts");
    } catch {
      toast.error("Failed to update insta post");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Insta Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} className="border px-3 py-2 rounded w-full" />
          {imageLink && !imageFile && (
            <img src={imageLink.startsWith('http') ? imageLink : `http://localhost:5000${imageLink}`} alt="Current" className="w-24 h-16 object-cover rounded mt-2 border" />
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Instagram Post Link</label>
          <input value={instaLink} onChange={e => setInstaLink(e.target.value)} required className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border px-3 py-2 rounded w-full">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
          {loading ? "Updating..." : "Update Insta Post"}
        </button>
      </form>
    </div>
  );
} 