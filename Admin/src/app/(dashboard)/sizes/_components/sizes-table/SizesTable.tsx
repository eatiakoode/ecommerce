import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteSize } from "@/api/size";
import { toast } from "sonner";

export default function SizesTable({ sizes, loading, error, selectedIds, setSelectedIds, setSizes }) {
  const router = useRouter();
  const handleEdit = (size) => router.push(`/sizes/edit/${size._id}`);
  const handleDelete = async (id: string) => {
    try {
      await deleteSize(id);
      setSizes((prev) => prev.filter((s) => s._id !== id));
      toast.success("Size deleted successfully");
    } catch (error) {
      toast.error("Failed to delete size");
    }
  };

  // Select all handler
  const allSelected = sizes.length > 0 && selectedIds.length === sizes.length;
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(sizes.map((s) => s._id));
    } else {
      setSelectedIds([]);
    }
  };
  // Single select handler
  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (loading) return <Skeleton className="h-40 w-full" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className="shadow-lg rounded-xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 border-0 animate-fadeIn w-full">
      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-blue-50 dark:bg-gray-800">
              <th className="p-4 border-b">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all sizes"
                />
              </th>
              <th className="p-4 border-b text-left font-bold uppercase text-sm text-gray-700 dark:text-gray-200">
                Size
              </th>
              <th className="p-4 border-b text-left font-bold uppercase text-sm text-gray-700 dark:text-gray-200">
                Value
              </th>
              <th className="p-4 border-b text-left font-bold uppercase text-sm text-gray-700 dark:text-gray-200">
                Slug
              </th>
              <th className="p-4 border-b text-left font-bold uppercase text-sm text-gray-700 dark:text-gray-200">
                Status
              </th>
              <th className="p-4 border-b text-left font-bold uppercase text-sm text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sizes.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-6 text-muted-foreground"
                >
                  No sizes found.
                </td>
              </tr>
            ) : (
              sizes.map((size) => (
                <tr
                  key={size._id}
                  className="bg-white dark:bg-gray-900 border-b transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(size._id)}
                      onChange={() => handleSelect(size._id)}
                      aria-label={`Select size ${size.name}`}
                    />
                  </td>
                  <td className="p-4 text-foreground font-semibold">
                    {size.name}
                  </td>
                  <td className="p-4 text-foreground">{size.value}</td>
                  <td className="p-4 text-foreground">{size.slug}</td>
                  <td className="p-4">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold ${
                        size.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {size.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      className="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                      title="Edit"
                      onClick={() => handleEdit(size)}
                    >
                      <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-300" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will
                            permanently delete the size and remove the
                            data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(size._id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 