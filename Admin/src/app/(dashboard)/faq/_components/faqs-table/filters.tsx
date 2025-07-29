import { useState } from "react";

const FAQ_TYPES = ["how-to-buy", "exchange-and-return", "refund-question"];

export default function Filters({ setFilter, filter, typeFilter, setTypeFilter }: { setFilter: (value: string) => void, filter: string, typeFilter: string, setTypeFilter: (value: string) => void }) {
  const [localSearch, setLocalSearch] = useState(filter || "");
  const [localType, setLocalType] = useState(typeFilter || "all");

  const handleFilter = () => {
    setFilter(localSearch);
    setTypeFilter(localType);
  };

  const handleReset = () => {
    setLocalSearch("");
    setLocalType("all");
    setFilter("");
    setTypeFilter("all");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <input
        type="text"
        placeholder="Search FAQ..."
        value={localSearch}
        onChange={e => setLocalSearch(e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-3 w-full md:w-1/3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
      />
      <select
        value={localType}
        onChange={e => setLocalType(e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-3 w-full md:w-1/4 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
      >
        <option value="all">All Types</option>
        {FAQ_TYPES.map((type) => (
          <option key={type} value={type}>
            {type === "how-to-buy" ? "How to Buy" : 
             type === "exchange-and-return" ? "Exchange and Return" : 
             type === "refund-question" ? "Refund Question" : type}
          </option>
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