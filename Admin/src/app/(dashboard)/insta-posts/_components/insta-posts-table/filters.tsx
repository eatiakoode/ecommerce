import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function Filters({ setFilter, filter, statusFilter, setStatusFilter }) {
  const [localSearch, setLocalSearch] = useState(filter || "");
  const [localStatus, setLocalStatus] = useState(statusFilter || "all");

  const handleFilter = () => {
    setFilter(localSearch);
    setStatusFilter(localStatus);
  };

  const handleReset = () => {
    setLocalSearch("");
    setLocalStatus("all");
    setFilter("");
    setStatusFilter("all");
  };

  return (
    <Card className="mb-5 p-4 flex flex-col md:flex-row gap-4 items-center">
      <input
        type="search"
        placeholder="Search posts..."
        value={localSearch}
        onChange={e => setLocalSearch(e.target.value)}
        className="h-12 md:basis-1/2 rounded-lg border px-4"
      />
      <select
        value={localStatus}
        onChange={e => setLocalStatus(e.target.value)}
        className="h-12 rounded-lg border px-4"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
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
  );
} 