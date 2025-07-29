"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/helpers/axiosInstance";

// Mock data for demonstration (should be replaced with API call in future)
const mockSliders = [
  { _id: "1", title: "Summer Sale", image: "/slider1.jpg", description: "Up to 50% off!", isActive: true },
  { _id: "2", title: "Winter Collection", image: "/slider2.jpg", description: "New arrivals for winter.", isActive: false },
];

export default function EditSliderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/slider/${id}`)
      .then(res => {
        setTitle(res.data.title || "");
        setDescription(res.data.description || "");
        setExistingImages(res.data.images || []);
        setLink(res.data.link || "");
        setStatus(res.data.status || 'Active');
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch slider");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let dataToSend;
      let headers = {};
      if (imageFiles.length > 0) {
        dataToSend = new FormData();
        dataToSend.append("title", title);
        dataToSend.append("description", description);
        dataToSend.append("link", link);
        dataToSend.append("status", status);
        existingImages.forEach(img => dataToSend.append("existingImages", img));
        imageFiles.forEach(file => dataToSend.append("images", file));
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        dataToSend = { title, description, link, images: existingImages, status };
      }
      await axiosInstance.put(`/slider/${id}`, dataToSend, { headers });
      router.push("/sliders");
    } catch (err) {
      alert("Failed to update slider");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Slider</h1>
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
          <label className="block mb-1 font-medium">Current Images</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img.startsWith('http') ? img : `http://localhost:5000${img.startsWith('/uploads/') ? img : '/uploads/' + img}`} alt="slider" className="w-20 h-12 object-cover rounded border" />
                <button type="button" className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}>×</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Add Images</label>
          <input type="file" accept="image/*" multiple onChange={e => setImageFiles(e.target.files ? Array.from(e.target.files) : [])} className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border px-3 py-2 rounded w-full">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Link</label>
          <input value={link} onChange={e => setLink(e.target.value)} required className="border px-3 py-2 rounded w-full" />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
          {loading ? "Updating..." : "Update Slider"}
        </button>
      </form>
    </div>
  );
} 