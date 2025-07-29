"use client";
import { useState } from "react";
import { addFaq } from "@/api/faq";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const FAQ_TYPES = ["how-to-buy", "exchange-and-return", "refund-question"];

export default function AddFaqPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      <h1 className="text-2xl font-bold mb-4">Add FAQ</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 w-full rounded"
            placeholder="FAQ title"
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="FAQ description"
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
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Add FAQ"}
        </Button>
      </form>
    </div>
  );
} 