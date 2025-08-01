"use client";
import { useEffect, useState } from "react";
import { getFaqById, updateFaq } from "@/api/faq";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const FAQ_TYPES = ["how to buy", "exchange and return", "refund question"];

export default function EditFaqPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchFaq() {
      try {
        const faq = await getFaqById(id as string);
        setTitle(faq.title || "");
        setDescription(faq.description || "");
        setType(faq.type || "");
      } catch {
        toast.error("Failed to load FAQ");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchFaq();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateFaq(id as string, { title, description, type });
      toast.success("FAQ updated");
      router.push("/faq");
    } catch {
      toast.error("Failed to update FAQ");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit FAQ</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="">Select a type</option>
            {FAQ_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "how to buy" ? "How to Buy" : 
                 t === "exchange and return" ? "Exchange and Return" : 
                 t === "refund question" ? "Refund Question" : t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={updating}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {updating ? "Updating..." : "Update FAQ"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/faq")}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 