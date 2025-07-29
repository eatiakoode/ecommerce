import { useState } from "react";

export default function Filters({ setFilter, filter, statusFilter, setStatusFilter }: { setFilter: (value: string) => void, filter: string, statusFilter: string, setStatusFilter: (value: string) => void }) {
  // Local state for controlled inputs
  const [localSearch, setLocalSearch] = useState(filter || "");
  const [localStatus, setLocalStatus] = useState(statusFilter || "all");

  // Apply filters only when Filter button is clicked
  const handleFilter = () => {
    setFilter(localSearch);
    setStatusFilter(localStatus);
  };

  // Reset both fields
  const handleReset = () => {
    setLocalSearch("");
    setLocalStatus("all");
    setFilter("");
    setStatusFilter("all");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <input
        type="text"
        placeholder="Search brand..."
        value={localSearch}
        onChange={e => setLocalSearch(e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-3 w-full md:w-1/3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
      />
      <select
        value={localStatus}
        onChange={e => setLocalStatus(e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-3 w-full md:w-1/4 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
      >
        <option value="all">Sort/Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
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