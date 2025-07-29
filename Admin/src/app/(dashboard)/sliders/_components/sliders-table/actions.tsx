import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";

// Define Slider type
interface Slider {
  _id: string;
  title: string;
  image: string;
  description: string;
  isActive: boolean;
}

interface ActionsProps {
  slider: Slider;
  onRefresh: () => void;
  setSliders: (val: Slider[] | ((prev: Slider[]) => Slider[])) => void;
}

export default function Actions({ slider, onRefresh, setSliders }: ActionsProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/sliders/edit/${slider._id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;
    // In the future, call API to delete
    setSliders((prev: Slider[]) => prev.filter((s: Slider) => s._id !== slider._id));
    onRefresh();
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