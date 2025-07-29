import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteFaq } from "@/api/faq";

export default function Actions({ faq, onRefresh }: { faq: any, onRefresh: () => void }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteFaq(faq._id);
      toast.success("FAQ deleted");
      onRefresh();
      router.refresh();
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => router.push(`/faq/edit/${faq._id}`)}
        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-xs font-semibold"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold"
      >
        Delete
      </button>
    </div>
  );
} 