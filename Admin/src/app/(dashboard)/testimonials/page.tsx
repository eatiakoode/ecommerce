"use client";
import { useState, useEffect } from "react";
import { Plus, PenSquare, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import axiosInstance from "@/helpers/axiosInstance";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:5000/api/testimonials";

interface Testimonial {
  _id: string;
  title: string;
  description: string;
  image: string;
  status: string;
}

// Helper to get the correct image URL
const getImageUrl = (image: string) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/uploads/')) return `http://localhost:5000${image}`;
  // Fallback: if image is just a filename, prepend /uploads/
  if (!image.startsWith('/')) return `http://localhost:5000/uploads/${image}`;
  // Fallback: if image starts with / but not /uploads/, treat as /uploads/filename
  return `http://localhost:5000/uploads/${image.replace(/^\//, '')}`;
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", status: "Active" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  // Fetch all testimonials on mount and whenever the page is navigated to
  useEffect(() => {
    axiosInstance.get(API_BASE)
      .then(res => {
        console.log("Fetched testimonials:", res.data);
        setTestimonials(res.data);
      })
      .catch(() => setTestimonials([]));
    // Listen for navigation to refresh data
    if (router && router.refresh) {
      router.refresh();
    }
  }, [router]);

  // Filtered testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || (t.status && t.status.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  // Bulk select logic
  const allSelected = filteredTestimonials.length > 0 && filteredTestimonials.every(t => selectedIds.includes(t._id));
  const someSelected = filteredTestimonials.some(t => selectedIds.includes(t._id));
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredTestimonials.map(t => t._id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
  };

  // Bulk delete
  const handleBulkDelete = () => {
    setTestimonials(prev => prev.filter(t => !selectedIds.includes(t._id)));
    setSelectedIds([]);
  };

  // Bulk action placeholder
  const handleBulkAction = () => {
    alert("Bulk action triggered for: " + selectedIds.join(", "));
  };

  // Open add form
  const handleAdd = () => {
    setForm({ title: "", description: "", status: "Active" });
    setImageFile(null);
    setEditId(null);
    setShowForm(true);
  };

  // Open edit form (navigate to edit page)
  const handleEdit = (id: string) => {
    console.log("Navigating to edit with id:", id); // Should log a real _id
    router.push(`/testimonials/edit/${id}`);
  };

  // Handle form submit (add or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      // Edit
      await axiosInstance.put(`${API_BASE}/${editId}`, form);
    } else {
      // Add
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("status", form.status);
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        alert("Please select an image.");
        return;
      }
      await axiosInstance.post(`${API_BASE}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    }
    // Refresh testimonials
    const res = await axiosInstance.get(API_BASE);
    setTestimonials(res.data);
    setShowForm(false);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    await axiosInstance.delete(`${API_BASE}/${id}`);
    setTestimonials(prev => prev.filter((t) => t._id !== id));
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" } : t
      )
    );
  };

  // Handle filter
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering is handled reactively by state
  };

  // Handle reset
  const handleReset = () => {
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <div className="max-w-7xl mx-auto py-8 w-full">
      {/* Action Bar - match product UI, no Export/Import */}
      <Card className="mb-4 shadow-lg rounded-xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 border-0 animate-fadeIn w-full">
        <div className="flex flex-row justify-end gap-4 p-6 items-center w-full">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50 h-12"
            onClick={handleBulkAction}
            disabled={selectedIds.length === 0}
            style={{ minWidth: 120 }}
          >
            Bulk Action
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 h-12"
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            style={{ minWidth: 100 }}
          >
            Delete
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition h-12"
            onClick={handleAdd}
            style={{ minWidth: 130 }}
          >
            <Plus className="w-5 h-5" /> Add
          </button>
        </div>
      </Card>

      {/* Filter Bar */}
      <Card className="mb-5 p-4 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="search"
          placeholder="Search testimonials..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-12 md:basis-1/2 rounded-lg border px-4"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-12 rounded-lg border px-4"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={handleFilter}
        >
          Filter
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          onClick={handleReset}
        >
          Reset
        </button>
      </Card>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow border bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={el => { if (el) el.indeterminate = !allSelected && someSelected; }}
                  onChange={e => handleSelectAll(e.target.checked)}
                  aria-label="Select all"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredTestimonials.map((t) => {
              console.log("Testimonial row:", t);
              return (
                <tr key={t._id}>
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(t._id)}
                      onChange={e => handleSelectRow(t._id, e.target.checked)}
                      aria-label="Select row"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <img src={getImageUrl(t.image)} alt={t.title} className="w-12 h-12 rounded-full object-cover border" />
                  </td>
                  <td className="px-6 py-4 font-semibold">{t.title}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{t.description}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${t.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                      onClick={() => handleToggleStatus(t._id)}
                    >
                      {t.status === "Active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right flex gap-2 justify-end">
                    <button
                      className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
                      onClick={() => handleEdit(t._id)}
                    >
                      <PenSquare className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900"
                      onClick={() => handleDelete(t._id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredTestimonials.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No testimonials found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{editId ? "Edit" : "Add"} Testimonial</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  onChange={e => setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                {editId ? "Save Changes" : "Add Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
