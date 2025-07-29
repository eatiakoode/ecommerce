import Actions from "./actions";
import Filters from "./filters";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/helpers/axiosInstance";

// Define Slider type
interface Slider {
  _id: string;
  // sku: string;
  title: string;
  image: string;
  description: string;
  isActive: boolean;
}

interface SlidersTableProps {
  sliders: Slider[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  setSliders: Dispatch<SetStateAction<Slider[]>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectRow: (id: string, checked: boolean) => void;
}

export default function SlidersTable({ sliders, loading, error, onRefresh, setSliders, selectedIds, setSelectedIds, handleSelectAll, handleSelectRow }: SlidersTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const getImageUrl = (image: string) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    if (image.startsWith('/uploads/')) return `http://localhost:5000${image}`;
    if (!image.startsWith('/')) return `http://localhost:5000/uploads/${image}`;
    return `http://localhost:5000/uploads/${image.replace(/^\//, '')}`;
  };

  // Filter sliders by title and status
  const filteredSliders = sliders.filter(slider => {
    const matchesTitle = slider.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (slider.status && slider.status.toLowerCase() === statusFilter.toLowerCase());
    return matchesTitle && matchesStatus;
  });

  if (loading) return <Skeleton className="h-40 w-full" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <Filters search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      {/* Table in its own Card */}
      <Card className="shadow-lg rounded-xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 border-0">
        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-4 border-b text-left font-bold uppercase text-sm bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={filteredSliders.length > 0 && selectedIds.length === filteredSliders.length}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="accent-blue-600 w-4 h-4 align-middle"
                  />
                </th>
                <th className="p-4 border-b text-left font-bold uppercase text-sm bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">ID</th>
                {/* <th className="p-4 border-b text-left font-bold uppercase text-sm bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">SKU</th> */}
                <th className="p-4 border-b text-left font-bold uppercase text-sm bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Title</th>
                <th className="p-4 border-b text-left font-bold uppercase text-sm bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Image</th>
                <th className="p-4 border-b text-left font-bold uppercase text-sm bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Description</th>
                <th className="p-4 border-b text-left font-bold uppercase text-sm bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Status</th>
                <th className="p-4 border-b text-left font-bold uppercase text-sm bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSliders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-6 text-muted-foreground">No sliders found.</td>
                </tr>
              ) : (
                filteredSliders.map((slider, idx) => (
                  <tr
                    key={slider._id}
                    className={
                      (idx % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800") +
                      " border-b transition-colors"
                    }
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(slider._id)}
                        onChange={e => handleSelectRow(slider._id, e.target.checked)}
                        className="accent-blue-600 w-4 h-4 align-middle"
                      />
                    </td>
                    <td className="p-4 font-mono text-base text-foreground">{slider._id.slice(-4).toUpperCase()}</td>
                    {/* <td className="p-4 font-mono text-base text-foreground">{slider.sku}</td> */}
                    <td className="p-4 font-semibold text-foreground">{slider.title}</td>
                    <td className="p-4">
                      <img src={getImageUrl(slider.image)} alt={slider.title} className="w-16 h-10 object-cover rounded-lg border" />
                    </td>
                    <td className="p-4 max-w-xs truncate text-foreground">{slider.description}</td>
                    <td className="p-4">
                      <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        slider.status === 'Active'
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>
                        {slider.status === 'Active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button className="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition" title="Edit" onClick={() => router.push(`/sliders/edit/${slider._id}`)}>
                        <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                      </button>
                      <button className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition" title="Delete" onClick={async () => {
                        if (confirm('Are you sure you want to delete this slider?')) {
                          await axiosInstance.delete(`/slider/${slider._id}`);
                          onRefresh();
                        }
                      }}>
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-300" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 