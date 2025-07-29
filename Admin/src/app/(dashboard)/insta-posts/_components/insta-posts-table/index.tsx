import Actions from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define InstaPost type
interface InstaPost {
  _id: string;
  title: string;
  imageLink: string;
  instaLink: string;
  SKU: string;
  status: string;
}

interface InstaPostsTableProps {
  posts: InstaPost[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  setPosts: (val: InstaPost[] | ((prev: InstaPost[]) => InstaPost[])) => void;
}

// Helper to get the correct image URL
const getImageUrl = (image: string) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/uploads/')) return `http://localhost:5000${image}`;
  if (!image.startsWith('/')) return `http://localhost:5000/uploads/${image}`;
  return `http://localhost:5000/uploads/${image.replace(/^\//, '')}`;
};

export default function InstaPostsTable({ posts, loading, error, onRefresh, setPosts }: InstaPostsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("all");
  const router = useRouter();

  // Filter posts by title and status
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(appliedSearch.toLowerCase());
    const matchesStatus = appliedStatus === "all" || post.status === appliedStatus;
    return matchesSearch && matchesStatus;
  });

  // Bulk delete handler
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm("Are you sure you want to delete the selected posts?")) return;
    setPosts((prev: InstaPost[]) => prev.filter((p: InstaPost) => !selectedIds.includes(p._id)));
    setSelectedIds([]);
    onRefresh();
  };

  // Handle select all
  const allSelected = posts.length > 0 && selectedIds.length === posts.length;
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(posts.map((p: InstaPost) => p._id));
    } else {
      setSelectedIds([]);
    }
  };
  // Handle single select
  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(_id => _id !== id));
    }
  };

  if (loading) return <Skeleton className="h-40 w-full" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Actions Bar Card (Bulk Action, Delete, Add Insta Post) */}
      <div className="bg-background rounded-xl shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex gap-3 md:ml-auto justify-end w-full">
          <button
            onClick={() => {}}
            className="flex items-center gap-2 bg-[#232B39] text-white px-5 py-2 rounded-md hover:bg-[#2C3648] transition-colors text-sm font-medium min-w-[120px]"
          >
            Bulk Action
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            className="flex items-center gap-2 bg-[#7B2323] text-white px-5 py-2 rounded-md hover:bg-[#A93226] transition-colors text-sm font-medium min-w-[90px] disabled:opacity-50"
          >
            Delete
          </button>
          <button
            onClick={() => router.push("/insta-posts/add")}
            className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2 rounded-md hover:bg-[#1d4ed8] transition-colors text-sm font-medium min-w-[140px]"
          >
            + Add Insta Post
          </button>
        </div>
      </div>
      {/* Filter Bar (search by name) */}
      <div className="bg-background rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-4 w-full">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-border px-4 py-3 w-full md:w-1/3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border px-4 py-3 w-full md:w-1/4 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
        >
          <option value="all">Sort/Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          type="button"
          onClick={() => { setAppliedSearch(search); setAppliedStatus(statusFilter); }}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Filter
        </button>
        <button
          type="button"
          onClick={() => { setSearch(""); setStatusFilter("all"); setAppliedSearch(""); setAppliedStatus("all"); }}
          className="bg-muted text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted/70 transition-colors border border-border"
        >
          Reset
        </button>
      </div>
      {/* 3. Insta Posts Table Card */}
      <div className="bg-background rounded-xl shadow-md p-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 border-b border-border text-left font-bold uppercase text-xs w-10 align-middle text-foreground">
                <input
                  type="checkbox"
                  checked={filteredPosts.length > 0 && selectedIds.length === filteredPosts.length}
                  onChange={e => setSelectedIds(e.target.checked ? filteredPosts.map(p => p._id) : [])}
                  className="accent-blue-600 w-4 h-4 align-middle"
                />
              </th>
              <th className="p-3 border-b border-border text-left font-bold uppercase text-xs align-middle text-foreground">Title</th>
              <th className="p-3 border-b border-border text-left font-bold uppercase text-xs align-middle text-foreground">Image</th>
              <th className="p-3 border-b border-border text-left font-bold uppercase text-xs align-middle text-foreground">Link</th>
              <th className="p-3 border-b border-border text-left font-bold uppercase text-xs align-middle text-foreground">Status</th>
              <th className="p-3 border-b border-border text-left font-bold uppercase text-xs align-middle text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr className="bg-background">
                <td colSpan={5} className="text-center p-4 text-foreground">No posts found.</td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post._id} className="bg-background transition-colors hover:bg-muted/70">
                  <td className="p-3 border-b border-border align-middle">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(post._id)}
                      onChange={e => setSelectedIds(e.target.checked ? [...selectedIds, post._id] : selectedIds.filter(id => id !== post._id))}
                      className="accent-blue-600 w-4 h-4 align-middle"
                    />
                  </td>
                  <td className="p-3 border-b border-border text-foreground align-middle">{post.title}</td>
                  <td className="p-3 border-b border-border text-foreground align-middle">
                    <img src={getImageUrl(post.imageLink)} alt={post.title} className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="p-3 border-b border-border text-foreground align-middle">
                    <a href={post.instaLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Post</a>
                  </td>
                  <td className="p-3 border-b border-border align-middle">
                    <span className={`px-4 py-1 rounded-full text-xs font-semibold ${post.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{post.status === 'active' ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="p-3 border-b border-border align-middle">
                    <Actions post={post} onRefresh={onRefresh} setPosts={setPosts} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 