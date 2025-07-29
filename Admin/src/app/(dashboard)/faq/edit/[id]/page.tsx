"use client";
import { useEffect, useState } from "react";
import { getFaqById, updateFaq } from "@/api/faq";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const FAQ_TYPES = ["how-to-buy", "exchange-and-return", "refund-question"];

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
        const faq = await getFaqById(id);
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
      await updateFaq(id, { title, description, type });
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
      <h1 className="text-2xl font-bold mb-4">Edit FAQ</h1>
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
            rows={4}
          />
        </div>
        <div>
          <label className="block mb-1">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select type</option>
            {FAQ_TYPES.map((faqType) => (
              <option key={faqType} value={faqType}>
                {faqType === "how-to-buy" ? "How to Buy" : 
                 faqType === "exchange-and-return" ? "Exchange and Return" : 
                 faqType === "refund-question" ? "Refund Question" : faqType}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={updating} className="w-full">
          {updating ? "Updating..." : "Update FAQ"}
        </Button>
      </form>
    </div>
  );
} 