import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, PenSquare, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { addSize, deleteSize, importSizes, exportSizes } from "@/api/size";
import { useRouter } from "next/navigation";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type ActionBarProps = {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  setSizes: (sizes: any[]) => void;
  sizes: any[];
};

export default function ActionBar({ selectedIds, setSelectedIds, setSizes, sizes }: ActionBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importSizes(file);
      // You may need to refresh the sizes list here
    }
  };

  const handleExport = async () => await exportSizes();
  const handleBulkAction = () => alert("Bulk Action");
  const handleBulkDelete = async () => {
    if (!window.confirm("Are you sure?")) return;
    await Promise.all(selectedIds.map(id => deleteSize(id)));
    // You may need to refresh the sizes list here
  };

  return (
    <div className="shadow-lg rounded-xl bg-white dark:bg-gray-900 border-0 animate-fadeIn w-full mb-4">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-6 p-6 items-center w-full">
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExport}>
            <Upload className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleImport}>
            <Download className="w-4 h-4 mr-2" /> Import
          </Button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Button variant="secondary" className="flex items-center gap-2" onClick={handleBulkAction} disabled={selectedIds.length === 0}>
            <PenSquare className="w-4 h-4 mr-2" /> Bulk Edit
          </Button>
          <Button variant="destructive" className="flex items-center gap-2" onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
          <Button
            onClick={() => router.push("/sizes/add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Size
          </Button>
        </div>
      </div>
    </div>
  );
} 