"use client";
import { useEffect, useState } from "react";
import SlidersTable from "./_components/sliders-table";
import { Card } from "@/components/ui/card";
import { Download, Upload, PenSquare, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/helpers/axiosInstance";

// Define Slider type inline for this file
interface Slider {
  _id: string;
  title: string;
  image: string;
  description: string;
  isActive: boolean;
}

// Mock data for demonstration
const mockSliders: Slider[] = [
  { _id: "1", title: "Summer Sale", image: "/slider1.jpg", description: "Up to 50% off!", isActive: true },
  { _id: "2", title: "Winter Collection", image: "/slider2.jpg", description: "New arrivals for winter.", isActive: false },
];

export default function SlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axiosInstance.get("/slider")
      .then(res => {
        // Support both array and object API responses
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        // Map images array to image field for table, and capitalize status
        setSliders(data.map((slider: any) => ({
          ...slider,
          image: Array.isArray(slider.images) && slider.images.length > 0 ? slider.images[0] : "",
          status: slider.status ? (slider.status.charAt(0).toUpperCase() + slider.status.slice(1).toLowerCase()) : "Inactive"
        })));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch sliders");
      setLoading(false);
      });
  }, []);

  // Filter sliders by title and status
  const filteredSliders = sliders.filter(s => {
    const titleMatch = s.title.toLowerCase().includes(filter.toLowerCase());
    const statusMatch = statusFilter === "all" || (statusFilter === "active" && s.isActive) || (statusFilter === "inactive" && !s.isActive);
    return titleMatch && statusMatch;
  });

  // Bulk select logic
  const allSelected = filteredSliders.length > 0 && selectedIds.length === filteredSliders.length;
  const someSelected = filteredSliders.some(s => selectedIds.includes(s._id));
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredSliders.map(s => s._id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
  };
  // Bulk delete
  const handleBulkDelete = () => {
    setSliders(prev => prev.filter(s => !selectedIds.includes(s._id)));
    setSelectedIds([]);
  };
  // Bulk action placeholder
  const handleBulkAction = () => {
    alert("Bulk action triggered for: " + selectedIds.join(", "));
  };

  // Placeholder handlers for Export/Import
  const handleExport = () => alert("Export triggered");
  const handleImport = () => alert("Import triggered");

  return (
    <div className="max-w-7xl mx-auto py-8 w-full space-y-6">
      {/* Action Bar - match product UI */}
      <Card className="shadow-lg rounded-xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 border-0 animate-fadeIn w-full">
        <div className="flex flex-col xl:flex-row xl:justify-between gap-6 p-6 items-center w-full">
          {/* Left side: Export/Import */}
          <div className="flex flex-wrap gap-4 items-center"></div>
          {/* Right side: Bulk Action, Delete, Add Slider */}
          <div className="flex flex-row gap-4 items-center">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-[#1e293b] text-white rounded hover:bg-[#334155] transition h-12"
              onClick={handleBulkAction}
              disabled={selectedIds.length === 0}
              style={{ minWidth: 140 }}
            >
              <PenSquare className="w-5 h-5" /> Bulk Action
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-[#7f1d1d] text-white rounded hover:bg-[#b91c1c] transition h-12"
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              style={{ minWidth: 120 }}
            >
              <Trash2 className="w-5 h-5" /> Delete
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white rounded hover:bg-[#1d4ed8] transition h-12"
              onClick={() => router.push("/sliders/add")}
              style={{ minWidth: 150 }}
            >
              <Plus className="w-5 h-5" /> Add Slider
            </button>
          </div>
        </div>
      </Card>
      {/* Filter and Table (passed bulk selection logic) */}
      <SlidersTable
        sliders={filteredSliders}
        loading={loading}
        error={error}
        onRefresh={() => setSliders(mockSliders)}
        setSliders={setSliders}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        handleSelectAll={handleSelectAll}
        handleSelectRow={handleSelectRow}
      />
    </div>
  );
}
