"use client";
import { useState, useEffect } from "react";
import { addFaq } from "@/api/faq";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const FAQ_TYPES = ["how to buy", "exchange and return", "refund question"];

export default function AddFaqPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pre-select type if provided in URL
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setType(typeParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addFaq({ title, description, type });
      toast.success("FAQ added");
      router.push("/faq");
    } catch (e: any) {
      toast.error(e?.message || "Failed to add FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add FAQ</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Adding..." : "Add FAQ"}
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