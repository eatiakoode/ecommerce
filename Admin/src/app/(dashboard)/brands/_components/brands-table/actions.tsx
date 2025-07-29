import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteBrand } from "@/api/brand";

// Define Brand type
interface Brand {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface ActionsProps {
  brand: Brand;
  onRefresh: () => void;
  setBrands?: (val: Brand[] | ((prev: Brand[]) => Brand[])) => void;
}

export default function Actions({ brand, onRefresh, setBrands }: ActionsProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/brands/edit/${brand._id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      await deleteBrand(brand._id);
      toast.success("Brand deleted successfully!");
      onRefresh();
    } catch (e) {
      toast.error("Failed to delete brand");
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