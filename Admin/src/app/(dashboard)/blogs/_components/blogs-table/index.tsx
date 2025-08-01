import Filters from "./filters";
import Actions from "./actions";
import React from "react";
import { useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { deleteBlog } from "@/api/blog";

interface BlogsTableProps {
  blogs: any[];
  isLoading: boolean;
  filter: string;
  setFilter: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
}

export default function BlogsTable({
  blogs,
  isLoading,
  filter,
  setFilter,
  categoryFilter,
  setCategoryFilter,
}: BlogsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  // Debounce filter input
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleFilterChange = useCallback((val: string) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => setFilter(val), 300);
  }, [setFilter]);

  // Memoize Actions and Filters
  const MemoizedActions = React.memo(Actions);
  const MemoizedFilters = React.memo(Filters);

  return (
    <div className="space-y-6">
      {/* Card 1: Action Buttons */}
      <div className="bg-white dark:bg-[#181A20] rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-end gap-4">
        <div className="flex gap-2 items-center">
          <button
            disabled={selectedIds.length === 0}
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete the selected blogs?")) return;
              try {
                await Promise.all(selectedIds.map(id => deleteBlog(id)));
                toast.success("Selected blogs deleted");
                setSelectedIds([]);
                router.refresh();
              } catch {
                toast.error("Failed to delete selected blogs");
              }
            }}
            className={`px-4 py-2 rounded font-medium flex items-center gap-2 border border-gray-200 dark:border-gray-700 ${selectedIds.length === 0 ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed' : 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300'}`}
          >
            Delete
          </button>
          <button
            onClick={() => router.push("/blogs/add")}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold shadow flex items-center gap-2"
          >
            + Add Blog
          </button>
        </div>
      </div>

      {/* Card 2: Filter Bar */}
      <div className="bg-white dark:bg-[#181A20] rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <MemoizedFilters
          filter={filter}
          setFilter={handleFilterChange}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      </div>

      {/* Card 3: Table */}
      <div className="bg-white dark:bg-[#181A20] rounded-2xl shadow-lg p-6">
        {isLoading ? (
          <div className="grid gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-[#181A20] border border-gray-200 dark:border-gray-700 rounded shadow-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-[#23242B] text-left text-gray-700 dark:text-gray-200">
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === blogs.length && blogs.length > 0}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedIds(blogs.map(b => b._id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700">Image</th>
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700">Title</th>
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700">Author</th>
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700">Date</th>
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700">Category</th>
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#23242B]">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(blog._id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, blog._id]);
                          } else {
                            setSelectedIds(prev => prev.filter(id => id !== blog._id));
                          }
                        }}
                      />
                    </td>
                    <td className="p-3">
                      {blog.image ? (
                        <img
                          src={blog.image.startsWith('http') ? blog.image : `http://localhost:5000${blog.image}`}
                          alt={blog.title}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }}
                          onError={e => { 
                            console.log('Image failed to load:', blog.image);
                            (e.target as HTMLImageElement).src = '/no-image.png'; 
                          }}
                        />
                      ) : (
                        <img
                          src="/no-image.png"
                          alt="No image"
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }}
                        />
                      )}
                    </td>
                    <td className="p-3 font-semibold truncate max-w-xs text-gray-900 dark:text-gray-100">{blog.title || ""}</td>
                    <td className="p-3 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{blog.author || "No Author"}</td>
                    <td className="p-3 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {blog.date ? new Date(blog.date).toLocaleDateString() : "No Date"}
                    </td>
                    <td className="p-3 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {blog.category || "No Category"}
                    </td>
                    <td className="p-3 text-center">
                      <MemoizedActions blog={blog} onRefresh={() => {}} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 