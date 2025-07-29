import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";
import axiosInstance from "@/helpers/axiosInstance";

// Define InstaPost type
interface InstaPost {
  _id: string;
  title: string;
  imageLink: string;
  instaLink: string;
  SKU: string;
  status: string;
}

interface ActionsProps {
  post: InstaPost;
  onRefresh: () => void;
  setPosts: (val: InstaPost[] | ((prev: InstaPost[]) => InstaPost[])) => void;
}

export default function Actions({ post, onRefresh, setPosts }: ActionsProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/insta-posts/edit/${post._id}`);
  };

  const API_BASE = "http://localhost:5000/api/instapost";

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axiosInstance.delete(`${API_BASE}/${post._id}`);
      onRefresh();
    } catch {
      // Optionally show error toast
    }
  };

  return (
    <div className="flex gap-2">
      <button onClick={handleEdit} className="p-2 rounded hover:bg-muted transition-colors" title="Edit">
        <Edit className="w-4 h-4 text-blue-600" />
      </button>
      <button onClick={handleDelete} className="p-2 rounded hover:bg-muted transition-colors" title="Delete">
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>
    </div>
  );
} 