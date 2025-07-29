import { useState, useEffect } from "react";
import { getBlogCategories } from "@/api/blog";

export default function Filters({ setFilter, filter, categoryFilter, setCategoryFilter }: { setFilter: (value: string) => void, filter: string, categoryFilter: string, setCategoryFilter: (value: string) => void }) {
  const [localSearch, setLocalSearch] = useState(filter || "");
  const [localCategory, setLocalCategory] = useState(categoryFilter || "all");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getBlogCategories().then((data) => setCategories(data || []));
  }, []);

  const handleFilter = () => {
    setFilter(localSearch);
    setCategoryFilter(localCategory);
  };

  const handleReset = () => {
    setLocalSearch("");
    setLocalCategory("all");
    setFilter("");
    setCategoryFilter("all");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <input
        type="text"
        placeholder="Search blog..."
        value={localSearch}
        onChange={e => setLocalSearch(e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-3 w-full md:w-1/3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
      />
      <select
        value={localCategory}
        onChange={e => setLocalCategory(e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-3 w-full md:w-1/4 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.title}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleFilter}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Filter
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-200"
      >
        Reset
      </button>
    </div>
  );
} 