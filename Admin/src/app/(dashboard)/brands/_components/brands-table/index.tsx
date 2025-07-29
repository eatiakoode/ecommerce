
import Filters from "./filters";
import Actions from "./actions";
import React, { useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Download, Upload } from "lucide-react";
import { deleteBrand, importBrands } from "@/api/brand";

interface BrandsTableProps {
  brands: any[];
  isLoading: boolean;
  filter: string;
  setFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
}

export default function BrandsTable({
  brands,
  isLoading,
  filter,
  setFilter,
  statusFilter,
  setStatusFilter,
}: BrandsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  const handleExport = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/brand/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "brands.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Export failed");
    }
  }, []);

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
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 items-center">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded font-medium flex items-center gap-2 border border-gray-200"
          >
            <Download size={16} /> Export
          </button>
          <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded font-medium flex items-center gap-2 border border-gray-200 cursor-pointer">
            <Upload size={16} /> Import
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  try {
                    await importBrands(e.target.files[0]);
                    toast.success("Brands imported successfully");
                    setSelectedIds([]);
                    router.refresh();
                  } catch {
                    toast.error("Failed to import brands");
                  }
                }
              }}
            />
          </label>
        </div>
        <div className="flex gap-2 items-center">
          <button
            disabled={selectedIds.length === 0}
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete the selected brands?")) return;
              try {
                await Promise.all(selectedIds.map(id => deleteBrand(id)));
                toast.success("Selected brands deleted");
                setSelectedIds([]);
                router.refresh();
              } catch {
                toast.error("Failed to delete selected brands");
              }
            }}
            className={`px-4 py-2 rounded font-medium flex items-center gap-2 border border-gray-200 ${selectedIds.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
          >
            Delete
          </button>
          <button
            onClick={() => router.push("/brands/add")}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold shadow flex items-center gap-2"
          >
            + Add Brand
          </button>
        </div>
      </div>

      {/* Card 2: Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <MemoizedFilters
          filter={filter}
          setFilter={handleFilterChange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {/* Card 3: Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {isLoading ? (
          <div className="grid gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === brands.length && brands.length > 0}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedIds(brands.map(b => b._id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-3 border-b">Brand Name</th>
                  <th className="p-3 border-b">Description</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(brand._id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, brand._id]);
                          } else {
                            setSelectedIds(prev => prev.filter(id => id !== brand._id));
                          }
                        }}
                      />
                    </td>
                    <td className="p-3 font-semibold truncate max-w-xs">{brand.title || ""}</td>
                    <td className="p-3 text-sm text-gray-600 truncate max-w-xs">{brand.description}</td>
                    <td className="p-3 text-xs">
                      <span className={brand.status && brand.status.toLowerCase() === 'active' ? "text-green-600" : "text-red-600"}>
                        {brand.status ? (brand.status.charAt(0).toUpperCase() + brand.status.slice(1).toLowerCase()) : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <MemoizedActions brand={brand} onRefresh={() => {}} />
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
