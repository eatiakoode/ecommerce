import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteBlog } from "@/api/blog";

export default function Actions({ blog, onRefresh }: { blog: any, onRefresh: () => void }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(blog._id);
      toast.success("Blog deleted");
      onRefresh();
      router.refresh();
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => router.push(`/blogs/edit/${blog._id}`)}
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